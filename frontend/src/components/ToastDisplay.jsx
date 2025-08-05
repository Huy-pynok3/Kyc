import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

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

  const { t } =  useTranslation('toast')

  useEffect(() => {
    const interval = setInterval(async () => {
      let wallet = null;

      if (mode === "random") {
        // Tạo ví giả mỗi lần
        wallet = "0x" + Math.random().toString(16).substr(2, 40);
      } else {
        // Gọi backend lấy ví thật mới ký
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/latest-kyc`);

          const data = await res.json();
          wallet = data.wallet;
          console.log("Lấy ví mới:", wallet);
        } catch (err) {
          console.error("Không lấy được ví:", err);
        }
      }

      if (wallet && wallet !== lastWallet.current) {
        lastWallet.current = wallet;

        toast.success(`${getRandomEmoji()} ${t('toast_after')} ${shorten(wallet)} ${t('toast_before')}`, {
          duration: 4000,
        });
        // toast.success(`🎉 Ví ${shorten(wallet)} vừa hoàn tất KYC!`, {
        //     icon: getRandomEmoji(),
        //   });
          
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [mode]);

  return null;
}
