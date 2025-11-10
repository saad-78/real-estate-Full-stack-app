const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const propertyController = require('../controllers/propertyController');


router.get('/', propertyController.getAllProperties);


router.get('/:id', propertyController.getPropertyById);


router.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }
  ]),
  propertyController.createProperty
);


router.put(
  '/:id',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }
  ]),
  propertyController.updateProperty
);

router.delete('/:id', propertyController.deleteProperty);

module.exports = router;
