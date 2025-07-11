
import dotenv from 'dotenv';
dotenv.config()

import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import kycRoutes from "./routers/kyc.js";
import paymentRoutes from "./routers/payment.js";

  const app = express();
  app.use(cors());
  app.use(express.json());
  
  app.use("/api/kyc", kycRoutes);
  app.use("/api", paymentRoutes);

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
