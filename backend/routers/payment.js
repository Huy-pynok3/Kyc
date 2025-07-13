import express from "express";
import { ethers, parseUnits, isAddress, formatUnits } from "ethers";
import dotenv from "dotenv";
dotenv.config();
import Payment from "../models/payments.js";
import { sendTelegramAlert } from "../services/telegramBot.js";

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

// Route kiểm tra thanh toán
router.get("/check-payment", async (req, res) => {
    const from = req.query.from?.toLowerCase();
    if (!from || !ethers.isAddress(from)) {
        return res.status(400).json({ success: false, error: "Địa chỉ không hợp lệ" });
    }

    try {

       // Check bank
        const bankPayment = await Payment.findOne({ from, method: "bank" });
        if (bankPayment) {
            return res.json({
                success: true,
                method: "bank",
                txHash: bankPayment.txHash,
                amount: bankPayment.amount,
            });
        }

        // Check nếu đã được duyệt tay
        const manual = await Payment.findOne({ from, forceApproved: true });
        if (manual) {
            // await sendTelegramAlert("payment", {
            //     method: "crypto",
            //     wallet: from,
            //     amount: manual.amount,
            //     txHash: manual.txHash || "Chưa có",
            //     note: "Đã duyệt tay thanh toán",
            // });
            if (!manual.notified) {
                await sendTelegramAlert("payment", {
                    method: "crypto",
                    wallet: manual.from,
                    amount: manual.amount,
                    note: "✅ Duyệt tay (forceApproved)",
                });

                manual.notified = true;
                await manual.save(); // cập nhật flag đã gửi
            }

            return res.json({
                success: true,
                method: "crypto",
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

        // Gửi thông báo Telegram
        await sendTelegramAlert("payment", {
            method: "crypto",
            wallet: from,
            amount: formatUnits(match.args.value, DECIMALS),
            txHash: match.transactionHash || "Chưa có",
        });

        res.json({
            success: true,
            method: "crypto",
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

//
// router.post("/webhook", async (req, res) => {
//     const { transId, description, amount, bankCode } = req.body;

//     if (!description || !amount) {
//       return res.status(400).json({ success: false, error: "Thiếu thông tin từ SePay" });
//     }

//     try {
//       // Dùng description làm ví (đã gắn từ frontend)
//       const wallet = description.toLowerCase();

//       const existing = await Payment.findOne({ from: wallet });
//       if (existing) {
//         return res.json({ success: true, message: "Đã xử lý trước đó" });
//       }

//       await Payment.create({
//         from: wallet,
//         txHash: `sepay-${transId}`,
//         amount,
//         confirmedAt: new Date(),
//         status: "approved",
//       });

//       res.json({ success: true });
//     } catch (err) {
//       console.error("Webhook SePay lỗi:", err);
//       res.status(500).json({ success: false });
//     }
//   });

router.post("/webhook", async (req, res) => {
    console.log("📩 Nhận webhook từ SePay:", req.body);

    const authHeader = req.headers["authorization"];
    const expectedKey = `Apikey ${process.env.SEPAY_SECRET_KEY}`;

    if (authHeader !== expectedKey) {
        return res.status(403).json({ error: "Sai hoặc thiếu API Key" });
    }

    const { id, transferAmount, content, referenceCode } = req.body;

    
    const txHash = referenceCode || `sepay_${id}`;
    const amount = transferAmount;
    const description = content;

    // Kiểm tra bắt buộc
    if (!txHash || !amount || !description) {
        return res.status(400).json({ error: "Thiếu dữ liệu webhook" });
    }
    // Tách ví người dùng từ nội dung chuyển khoản
    const matched = description?.match(/^SEVQR\+TKPTPT(0x[a-fA-F0-9]{40})$/);

    if (!matched) {
        return res.status(400).json({ error: "Không tìm thấy địa chỉ ví trong description" });
    }

    const wallet = matched[1].toLowerCase();
    // const wallet = description?.trim()?.toLowerCase();

    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
        return res.status(400).json({ error: "Sai định dạng ví từ description" });
    }

    try {
        const exists = await Payment.findOne({ txHash });
        if (exists) {
            return res.json({ success: false, message: "Giao dịch đã tồn tại" });
        }

        await Payment.create({
            from: wallet,
            txHash,
            amount,
            confirmedAt: new Date(),
            method: "bank",
            //   forceApproved: true,
        });

        console.log("✅ Đã ghi nhận thanh toán SePay cho ví:", wallet);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Lỗi xử lý webhook SePay:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// Route lấy tất cả giao dịch thanh toán
router.get("/latest-kyc", async (req, res) => {
    try {
        const latest = await Payment.findOne({ status: "pending" }).sort({ confirmedAt: -1 }).limit(1);
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
