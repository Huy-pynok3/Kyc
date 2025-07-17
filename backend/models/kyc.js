import mongoose from "mongoose";
mongoose.set("debug", true);

const Kyc = mongoose.model(
    "Kyc",
    new mongoose.Schema({
        wallet: { type: String, required: true, unique: true },
        email: String,
        mapleLink: { type: String, required: true },
        signature: String,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected", "processing"],
          default: "pending",
        },
        submittedAt: { type: Date, default: Date.now },
        processedAt: Date,
        reason: String,
        forceApproved: { type: Boolean, default: false },
        startedAt: {
          type: Date,
        },
      })
);
export default Kyc;