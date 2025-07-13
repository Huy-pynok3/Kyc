// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

// export async function sendTelegramMessage(text) {
//   try {
//     await axios.post(TELEGRAM_API, {
//       chat_id: process.env.TELEGRAM_CHAT_ID,
//       text: text,
//       parse_mode: "HTML",
//     });
//   } catch (err) {
//     console.error("❌ Lỗi gửi tin nhắn Telegram:", err.response?.data || err.message);
//   }
// }


import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

/**
 * Gửi tin nhắn Telegram theo loại thông báo
 * @param {"payment" | "kyc"} type 
 * @param {Object} data 
 */
export async function sendTelegramAlert(type, data) {
  let text = "";

  const now = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

//   if (type === "payment") {
//     text = `🤑 <b>[THANH TOÁN MỚI]</b>\n` +
//            `👤 <b>Ví:</b> ${data.wallet}\n` +
//            `💰 <b>Gói:</b> ${data.amount} VND\n` +
//            `⏱ <b>Thời gian:</b> ${now}`;
//   }
    if (type === "payment") {
        const method = data.method === "bank" ? "🏦 Bank Transfer" : `💲 Crypto`;
        const currency = data.method === "crypto" ? "USDT" : "VND";
        const walletOrBankInfo =
        data.method === "crypto"
            ? `👛 <b>Ví:</b> ${data.wallet}`
            : `🏦 <b>Ngân hàng:</b> ${data.bankName}\n💳 <b>Số tài khoản:</b> ${data.bankAccount}`;


        text = `🤑 <b>[THANH TOÁN MỚI – ${method}]</b>\n` +
            `${walletOrBankInfo}\n` +
            `💰 <b>Số tiền:</b> ${data.amount} ${currency}\n` +
            `⏱ <b>Thời gian:</b> ${now}`;
        if(data.note){
            text += `\n📝 <b>Ghi chú:</b> ${data.note}`;
        }
    }
  

  if (type === "kyc") {
    text = `✅ <b>[KYC HOÀN TẤT]</b>\n` +
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
