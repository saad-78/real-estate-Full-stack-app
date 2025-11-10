# Real Estate Listing System

## Tech Stack

**Backend:**
- Node.js
- Express.js
- PostgreSQL (Neon)
- Cloudinary (Image Storage)
- Multer (File Upload)

**Frontend:**
- Next.js 15
- React 18
- Tailwind CSS

---

## Installation Instructions

### Backend Setup
cd backend
npm install



Create `.env` file and add environment variables (see below).

Run SQL to create table:
CREATE TABLE properties (
id SERIAL PRIMARY KEY,
project_name VARCHAR(255) NOT NULL,
builder_name VARCHAR(255) NOT NULL,
location VARCHAR(255) NOT NULL,
price DECIMAL(15, 2) NOT NULL,
description TEXT,
main_image TEXT NOT NULL,
gallery_images TEXT[],
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



Start server:
npm run dev



### Frontend Setup
cd frontend
npm install

text

Create `.env.local` file and add environment variables (see below).

Start server:
npm run dev

text

---

## Environment Variables

### Backend `.env`
PORT=5000
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

text

### Frontend `.env.local`
NEXT_PUBLIC_API_URL=http://localhost:5000/api

text

**For production:** Replace `http://localhost:5000/api` with your deployed backend URL.

---

## API Documentation

**Base URL:** `http://localhost:5000/api`

### 1. Get All Properties
GET /api/properties

text
**Response:**
{
"success": true,
"count": 2,
"data": [...]
}

text

### 2. Get Property by ID
GET /api/properties/:id

text
**Response:**
{
"success": true,
"data": {...}
}

text

### 3. Create Property
POST /api/properties
Content-Type: multipart/form-data

text
**Body Fields:**
- `project_name` (text, required)
- `builder_name` (text, required)
- `location` (text, required)
- `price` (number, required)
- `description` (text, optional)
- `mainImage` (file, required)
- `galleryImages` (files, required)

**Response:**
{
"success": true,
"message": "Property created successfully",
"data": {...}
}

text

### 4. Update Property
PUT /api/properties/:id
Content-Type: multipart/form-data

text
**Body:** Same as Create (images optional)

**Response:**
{
"success": true,
"message": "Property updated successfully",
"data": {...}
}

text

### 5. Delete Property
DELETE /api/properties/:id

text
**Response:**
{
"success": true,
"message": "Property deleted successfully"
}

text

### 6. Health Check
GET /health

text
**Response:**
{
"status": "ok",
"timestamp": "2025-11-10T18:00:00.000Z"
}

