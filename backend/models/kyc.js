import mongoose from "mongoose";

const Kyc = mongoose.model(
    "Kyc",
    new mongoose.Schema({
        wallet: { type: String, required: true, unique: true },
        email: String,
        mapleLink: { type: String, required: true },
        signature: String,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        submittedAt: { type: Date, default: Date.now },
        processedAt: Date,
        reason: String,
        forceApproved: { type: Boolean, default: false },
      })
);
export default Kyc;