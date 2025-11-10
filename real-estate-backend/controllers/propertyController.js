const pool = require('../config/database');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'real-estate',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png']
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

exports.getAllProperties = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM properties ORDER BY created_at DESC'
    );
    
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching properties',
      error: error.message
    });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM properties WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching property',
      error: error.message
    });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const cleanBody = {};
    for (let key in req.body) {
      const cleanKey = key.trim();
      let cleanValue = req.body[key];
      
      if (typeof cleanValue === 'string') {
        cleanValue = cleanValue.replace(/^["']|["']$/g, '');
      }
      
      cleanBody[cleanKey] = cleanValue;
    }
    
    const { project_name, builder_name, location, price, description } = cleanBody;
    
    console.log(' Cleaned data:', { project_name, builder_name, location, price, description });
    
    if (!project_name || !builder_name || !location || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide project_name, builder_name, location, and price'
      });
    }
    
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded. Please upload mainImage and galleryImages'
      });
    }
    
    if (!req.files.mainImage || req.files.mainImage.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Main image is required'
      });
    }
    
    if (!req.files.galleryImages || req.files.galleryImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one gallery image is required'
      });
    }
    
    console.log(' All validations passed');
    console.log('Project name:', project_name);
    console.log('Main image:', req.files.mainImage[0].originalname);
    console.log('Gallery images count:', req.files.galleryImages.length);
    
    console.log('Uploading main image to Cloudinary...');
    const mainImageUrl = await uploadToCloudinary(req.files.mainImage[0].buffer);
    console.log(' Main image uploaded:', mainImageUrl);
    
    console.log('Uploading gallery images to Cloudinary...');
    const galleryUploadPromises = req.files.galleryImages.map(file => 
      uploadToCloudinary(file.buffer)
    );
    const galleryImageUrls = await Promise.all(galleryUploadPromises);
    console.log(' Gallery images uploaded:', galleryImageUrls.length, 'images');
    
    console.log('Saving to database...');
    const result = await pool.query(
      `INSERT INTO properties 
       (project_name, builder_name, location, price, description, main_image, gallery_images) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [project_name, builder_name, location, price, description || '', mainImageUrl, galleryImageUrls]
    );
    
    console.log('Property saved to database with ID:', result.rows[0].id);
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating property',
      error: error.message
    });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cleanBody = {};
    for (let key in req.body) {
      const cleanKey = key.trim();
      let cleanValue = req.body[key];
      
      if (typeof cleanValue === 'string') {
        cleanValue = cleanValue.replace(/^["']|["']$/g, '');
      }
      
      cleanBody[cleanKey] = cleanValue;
    }
    
    const { project_name, builder_name, location, price, description } = cleanBody;

    if (!project_name || !builder_name || !location || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide project_name, builder_name, location, and price'
      });
    }

    const existingProperty = await pool.query(
      'SELECT * FROM properties WHERE id = $1',
      [id]
    );
    
    if (existingProperty.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    console.log('Updating property ID:', id);
    
    let mainImageUrl = existingProperty.rows[0].main_image;
    let galleryImageUrls = existingProperty.rows[0].gallery_images;

    if (req.files && req.files.mainImage && req.files.mainImage.length > 0) {
      console.log('Uploading new main image...');
      mainImageUrl = await uploadToCloudinary(req.files.mainImage[0].buffer);
      console.log(' New main image uploaded');
    }

    if (req.files && req.files.galleryImages && req.files.galleryImages.length > 0) {
      console.log('Uploading new gallery images...');
      const galleryUploadPromises = req.files.galleryImages.map(file => 
        uploadToCloudinary(file.buffer)
      );
      galleryImageUrls = await Promise.all(galleryUploadPromises);
      console.log(' New gallery images uploaded');
    }

    const result = await pool.query(
      `UPDATE properties 
       SET project_name = $1, builder_name = $2, location = $3, 
           price = $4, description = $5, main_image = $6, 
           gallery_images = $7, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $8 
       RETURNING *`,
      [project_name, builder_name, location, price, description || '', mainImageUrl, galleryImageUrls, id]
    );
    
    console.log(' Property updated successfully');
    
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating property',
      error: error.message
    });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProperty = await pool.query(
      'SELECT * FROM properties WHERE id = $1',
      [id]
    );
    
    if (existingProperty.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await pool.query('DELETE FROM properties WHERE id = $1', [id]);
    
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting property',
      error: error.message
    });
  }
};
