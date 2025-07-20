import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const studentId = req.body.studentId || 'unknown_student';
    return {
      folder: `kyc_uploads/${studentId}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      // transformation: [{ width: 800, height: 800, crop: 'limit' }],
    };
  },
});


const upload = multer({ storage });

export default upload;
