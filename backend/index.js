import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import kycRoutes from "./routers/kyc.js";
import paymentRoutes from "./routers/payment.js";
import kycPublicRoutes from "./routers/kycPublic.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { startResetExpiredSessionsJob } from "./jobs/resetExpiredSessions.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Hash mật khẩu admin (thay bằng hash bạn sinh ra)
const ADMIN_PASSWORD_HASH = process.env.ADMIN_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint đăng nhập admin
app.post("/api/admin/login", async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: "Mật khẩu là bắt buộc" });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!isMatch) {
            return res.status(401).json({ error: "Sai mật khẩu" });
        }

        // Tạo JWT
        const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Đăng nhập thành công", token });
    } catch (error) {
        // console.error("Lỗi khi đăng nhập admin:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// app.get("/api/admin/generate-jwt-secret", (req, res) => {
//     try {
//       const crypto = require("crypto");
//       const secret = crypto.randomBytes(32).toString("hex");
//       res.json({ JWT_SECRET: secret });
//     } catch (error) {
//       console.error("Lỗi khi sinh JWT_SECRET:", error);
//       res.status(500).json({ error: "Lỗi server" });
//     }
//   });

app.use("/api/kyc", kycRoutes);

app.use("/api/kyc", kycPublicRoutes);
app.use("/api", paymentRoutes);

if (process.env.USE_CLOUDINARY !== "true") {
    app.use("/uploads", express.static("uploads"));
}
console.log('Upload đang dùng:', process.env.USE_CLOUDINARY === 'true' ? 'Cloudinary' : 'Local');

app.use((err, req, res, next) => {
    console.error("Lỗi server:", err);
    res.status(500).json({ error: "Lỗi server nội bộ" });
});
const PORT = process.env.PORT || 5001;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");

        // Start cronjob khi đã kết nối DB
        startResetExpiredSessionsJob();

        app.listen(PORT, () => {
            console.log(`Server ready at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
