import mongoose from "mongoose";

const Session = mongoose.model(
    "Session",
    new mongoose.Schema({
      kycId: { type: mongoose.Schema.Types.ObjectId, ref: "Kyc", required: true },
      wallet: { type: String, required: true },
      kycSessionId: { type: String, required: true },
      emoji: { type: String, required: true },
      startedAt: { type: Date, required: true },
      clickedConfirmedAt: { type: Date }, // khi bấm "Tôi đã hoàn tất"
      imageUrl: { type: String },          // sau khi upload ảnh
      bankAccount: { type: String },       // số tài khoản để trả công
      studentId: { type: String },
      createdAt: { type: Date, default: Date.now },
      lastPingAt: { type: Date },
    })
);
export default Session;
