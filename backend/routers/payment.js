import express from "express";
import { ethers, parseUnits, isAddress, formatUnits } from "ethers";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Chuẩn bị RPC & Contract
const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC);
const block = await provider.getBlockNumber();
console.log("Block:", block);

const DECIMALS = 6;
const MIN_AMOUNT = parseUnits(process.env.MIN_AMOUNT || "5", DECIMALS);
const RECEIVER = (process.env.RECEIVER_WALLET || "").toLowerCase();
const USDT_CONTRACT = process.env.USDT_CONTRACT;

if (!RECEIVER || !USDT_CONTRACT) {
    throw new Error("❌ Thiếu cấu hình RECEIVER_WALLET hoặc USDT_CONTRACT trong .env");
}

const ERC20_ABI = ["event Transfer(address indexed from, address indexed to, uint256 value)"];

const usdt = new ethers.Contract(process.env.USDT_CONTRACT, ERC20_ABI, provider);

// Model lưu giao dịch xác nhận
const Payment = mongoose.model(
    "Payment",
    new mongoose.Schema({
        from: String,
        txHash: String,
        amount: String,
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        confirmedAt: Date,
        forceApproved: Boolean,
        //   forceApproved: { type: Boolean, default: false }
        // Admin có thể đánh dấu giao dịch này là đã được phê duyệtforceApproved
    })
);

// Route kiểm tra thanh toán
router.get("/check-payment", async (req, res) => {
    const from = req.query.from?.toLowerCase();
    if (!from || !ethers.isAddress(from)) {
        return res.status(400).json({ success: false, error: "Địa chỉ không hợp lệ" });
    }

    try {
        // Check nếu đã được duyệt tay
        const manual = await Payment.findOne({ from, forceApproved: true });
        if (manual) {
            return res.json({
                success: true,
                txHash: manual.txHash,
                amount: manual.amount,
                manual: true,
            });
        }

        // Check log thật từ USDT contract
        const currentBlock = await provider.getBlockNumber();

        const logs = await usdt.queryFilter(usdt.filters.Transfer(from, RECEIVER), currentBlock - 10000, currentBlock);

        if (!logs.length) {
            return res.json({
                success: false,
                message: "Chưa phát hiện giao dịch USDT phù hợp",
            });
        }

        logs.sort((a, b) => b.blockNumber - a.blockNumber); // Ưu tiên giao dịch mới nhất

        const match = logs.find((log) => log.args.value.gte(MIN_AMOUNT));
        if (!match) {
            return res.json({
                success: false,
                message: "Giao dịch không đủ số lượng yêu cầu",
                // message: `Chưa có giao dịch USDT >= ${ethers.formatUnits(MIN_AMOUNT, DECIMALS)}`
            });
        }
        //// Kiểm tra đã lưu vào Mongo chưa

        const alreadySaved = await Payment.findOne({
            txHash: match.transactionHash,
        });
        if (alreadySaved) {
            return res.json({
                success: true,
                txHash: alreadySaved.txHash,
                amount: alreadySaved.amount,
            });
        }

        // Kiểm tra trùng
        const existing = await Payment.findOne({ txHash: match.transactionHash });
        if (existing) {
            return res.json({
                success: true,
                txHash: existing.txHash,
                amount: existing.amount,
            });
        }

        // Lưu lại
        const saved = await Payment.create({
            from,
            txHash: match.transactionHash,
            amount: formatUnits(match.args.value, DECIMALS),
            confirmedAt: new Date(),
        });

        res.json({
            success: true,
            txHash: saved.txHash,
            amount: saved.amount,
        });
    } catch (err) {
        console.error("❌ Lỗi khi kiểm tra giao dịch:", err);
        res.status(500).json({ success: false, error: "Lỗi server" });
    }
});

// Route để duyệt tay thanh toán
router.post("/manual-approve", async (req, res) => {
    const { wallet } = req.body;
    if (!wallet || !isAddress(wallet)) {
        return res.status(400).json({ success: false, message: "Địa chỉ không hợp lệ" });
    }
    try {
        // Kiểm tra nếu đã có giao dịch thực sự hoặc đã được duyệt tay
        const lowerWallet = wallet.toLowerCase();
        const existing = await Payment.findOne({
            from: lowerWallet,
            $or: [
                { forceApproved: true },
                { amount: { $gte: "0.000001" } }, // hoặc parseFloat(amount) > 0 nếu lưu là số
            ],
        });
        if (existing) {
            return res.json({
                success: false,
                message: "Ví này đã có thanh toán hoặc đã được duyệt tay rồi",
            });
        }
        await Payment.findOneAndUpdate(
            { from: lowerWallet },
            {
                txHash: "manual-" + Date.now(),
                amount: "0",
                confirmedAt: new Date(),
                forceApproved: true,
            },
            { upsert: true } // tạo mới nếu chưa có
        );

        res.json({ success: true, message: "Đã duyệt tay thanh toán cho ví này" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Lỗi server khi duyệt tay" });
    }
});

// Route lấy tất cả giao dịch thanh toán
router.get("/latest-kyc", async (req, res) => {
    try {
        const latest = await Payment.findOne({ status: "approved" })
            .sort({ confirmedAt: -1 })
            .limit(1);
        const wallet = latest?.from || null;
        // res.json({ from: latest?.from || null });
        res.json({ wallet });
    } catch (error) {
        console.error("Lỗi khi lấy giao dịch thanh toán:", error);
        return res.status(500).json({ success: false, error: "Lỗi server" });
    }
});
//

export default router;
