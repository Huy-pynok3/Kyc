import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

export async function sendTelegramAlert(type, data) {
    let text = "";

    const now = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    if (type === "payment") {
        const method = data.method === "bank" ? "🏦 Bank Transfer" : `🐋 Crypto`;
        const currency = data.method === "crypto" ? "USDT" : "VND";
        text =
            `🤑 <b>[THANH TOÁN MỚI – ${method}]</b>\n` +
            `👛 <b>Ví:</b> ${data.wallet}\n` +
            `📌 <b>TxHash:</b> ${data.txHash}\n` +
            `💰 <b>Số tiền:</b> ${data.amount.toLocaleString('vi-VN')} ${currency}\n` +
            `⏱ <b>Thời gian:</b> ${now}`;

        if (data.note) {
            text += `\n📝 <b>Ghi chú:</b> ${data.note}`;
        }
    }

    if (type === "kyc") {
        text =
            `✅ <b>[KYC HOÀN TẤT]</b>\n` +
            `👤 <b>Ví:</b> ${data.wallet}\n` +
            `📧 <b>Email:</b> ${data.email || "Không có"}\n` +
            `🔗 <b>Link KYC:</b> ${data.kycLink}\n` +
            `⏱ <b>Thời gian:</b> ${now}`;
    }

    try {
        await axios.post(TELEGRAM_API, {
            chat_id: CHAT_ID,
            text: text,
            parse_mode: "HTML",
        });
        console.log("Đã gửi thông báo Telegram");
    } catch (err) {
        console.error("Loi gui Telegram:", err.response?.data || err.message);
    }
}
