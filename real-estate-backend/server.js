const express = require('express');
const cors = require('cors');
require('dotenv').config();

const propertyRoutes = require('./routes/propertyRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/properties', propertyRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Real Estate API is running',
    endpoints: {
      getAllProperties: 'GET /api/properties',
      getPropertyById: 'GET /api/properties/:id',
      createProperty: 'POST /api/properties',
      updateProperty: 'PUT /api/properties/:id',
      deleteProperty: 'DELETE /api/properties/:id'
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

app.all('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
