import express from "express";
import Payment from "../models/payments.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  const { transId, description, amount, bankCode } = req.body;

  if (!description || !amount) {
    return res.status(400).json({ success: false, error: "Thiếu thông tin từ SePay" });
  }

  try {
    // Dùng description làm ví (đã gắn từ frontend)
    const wallet = description.toLowerCase();

    const existing = await Payment.findOne({ from: wallet });
    if (existing) {
      return res.json({ success: true, message: "Đã xử lý trước đó" });
    }

    await Payment.create({
      from: wallet,
      txHash: `sepay-${transId}`,
      amount,
      confirmedAt: new Date(),
      status: "approved",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Webhook SePay lỗi:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
