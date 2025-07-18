import { config } from '../config/index.js';

export default function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token || token !== `Bearer ${config.secretToken}`) {
    return res.status(403).json({ error: 'Truy cập bị từ chối' });
  }

  next();
}
