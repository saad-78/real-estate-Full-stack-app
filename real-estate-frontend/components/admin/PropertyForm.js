'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProperty, updateProperty } from '@/lib/api';

export default function PropertyForm({ property = null }) {
  const router = useRouter();
  const isEditMode = !!property;

  const [formData, setFormData] = useState({
    project_name: property?.project_name || '',
    builder_name: property?.builder_name || '',
    location: property?.location || '',
    price: property?.price || '',
    description: property?.description || '',
  });

  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleGalleryImagesChange = (e) => {
    if (e.target.files) {
      setGalleryImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('project_name', formData.project_name);
      data.append('builder_name', formData.builder_name);
      data.append('location', formData.location);
      data.append('price', formData.price);
      data.append('description', formData.description);

      if (mainImage) {
        data.append('mainImage', mainImage);
      } else if (!isEditMode) {
        alert('Please select a main image');
        setLoading(false);
        return;
      }

      if (galleryImages.length > 0) {
        galleryImages.forEach((file) => {
          data.append('galleryImages', file);
        });
      } else if (!isEditMode) {
        alert('Please select at least one gallery image');
        setLoading(false);
        return;
      }

      if (isEditMode) {
        await updateProperty(property.id, data);
        alert('Property updated successfully!');
      } else {
        await createProperty(data);
        alert('Property created successfully!');
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Property' : 'Add New Property'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name *
          </label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Builder Name *
          </label>
          <input
            type="text"
            name="builder_name"
            value={formData.builder_name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Main Image {!isEditMode && '*'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {isEditMode && property.main_image && (
            <img
              src={property.main_image}
              alt="Current main"
              className="mt-2 h-32 w-32 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gallery Images {!isEditMode && '*'}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryImagesChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {isEditMode && property.gallery_images && (
            <div className="mt-2 flex gap-2">
              {property.gallery_images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="h-20 w-20 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : isEditMode ? 'Update Property' : 'Create Property'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
