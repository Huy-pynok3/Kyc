
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  // console.log("Token nhận được từ frontend:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("Lỗi xác thực JWT:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}