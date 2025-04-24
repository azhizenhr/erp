import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'EmployeeProfiles', // Folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});