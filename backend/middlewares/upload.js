import uploadLocal from './uploadLocal.js';
import uploadCloudinary from './uploadCloudinary.js';

const useCloud = process.env.USE_CLOUDINARY === 'true';

const upload = useCloud ? uploadCloudinary : uploadLocal;

export default upload;
