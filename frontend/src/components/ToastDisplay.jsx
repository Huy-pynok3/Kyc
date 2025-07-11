import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// const emojis = ["🐸", "🦄", "🐼", "🧙‍♂️", "👾", "🦊", "🐢", "🐤"];
const emojis = [
    '👾', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐯', '🐨', '🐒',
    '🦒', '🦘', '🦓', '🐘', '🦏', '🦛', '🐪', '🦒', '🦜', '🦚', '🐍', '🦎',
    '🐢', '🐙', '🦑', '🦐', '🦞', '🦀', '🐠', '🐟', '🐬', '🦈', '🐳', '🐋',
    '🦋', '🐛', '🐝', '🦗', '🦂', '🕷️', '🐤', '🐸', '🦄', '🧙‍♂️'
];

function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function shorten(wallet) {
  return wallet.slice(0, 6) + "..." + wallet.slice(-4);
}

export default function ToastDisplay({ mode = "real" }) {
  const lastWallet = useRef(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      let wallet = null;

      if (mode === "random") {
        // Tạo ví giả mỗi lần
        wallet = "0x" + Math.random().toString(16).substr(2, 40);
      } else {
        // Gọi backend lấy ví thật mới ký
        try {
          const res = await fetch("http://localhost:5000/api/latest-kyc");

          const data = await res.json();
          wallet = data.wallet;
          console.log("Lấy ví mới:", wallet);
        } catch (err) {
          console.error("Không lấy được ví:", err);
        }
      }

      if (wallet && wallet !== lastWallet.current) {
        lastWallet.current = wallet;

        toast.success(`${getRandomEmoji()} Ví ${shorten(wallet)} vừa hoàn tất KYC!`, {
          duration: 10000,
        });
        // toast.success(`🎉 Ví ${shorten(wallet)} vừa hoàn tất KYC!`, {
        //     icon: getRandomEmoji(),
        //   });
          
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [mode]);

  return null;
}
