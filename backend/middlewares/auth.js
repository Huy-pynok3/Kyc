
// export default (req, res, next) => {
//     const token = req.headers["authorization"];
//     // const token = req.headers.authorization;
//     console.log("🛡️ Token nhận được:", token);
//     if (!token || token !== process.env.ADMIN_TOKEN) {
//         console.log("❌ Token không hợp lệ");
//         return res.status(401).json({ error: "Unauthorized" });
//     }

//     next();
// };
// export default function auth(req, res, next) {
//     // const token = req.headers["authorization"];
//     const token = req.headers.authorization;
//     console.log("🛡️ Token nhận được:", token);
  
//     if (!token || token !== process.env.ADMIN_TOKEN) { // ví dụ đơn giản
//       console.log("❌ Token không hợp lệ");
//       return res.status(401).json({ error: "Unauthorized" });
//     }
  
//     next();
//   }
  

// export default function auth(req, res, next) {
//     const token = req.headers.authorization;
//     console.log("Token nhận được từ frontend:", token);
  
//     if (!token || token !== process.env.ADMIN_TOKEN) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
  
//     next();
//   }
// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Token nhận được từ frontend:", authHeader);

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