const multer = require('multer');


const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {

  if (file.mimetype === 'image/jpeg' || 
      file.mimetype === 'image/jpg' || 
      file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, and PNG images are allowed'), false);
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

module.exports = upload;
