import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // const studentId = req.body.studentId || 'unknown_student';
    const kycSessionId = req.body.kycSessionId || 'unknown_session'; 
    const cleanFolderName = kycSessionId.replace(/[^a-zA-Z0-9-_]/g, "_");
    return {
      folder: `kyc_uploads/${cleanFolderName}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      // transformation: [{ width: 800, height: 800, crop: 'limit' }],
    };
  },
});


const upload = multer({ storage });

export default upload;
