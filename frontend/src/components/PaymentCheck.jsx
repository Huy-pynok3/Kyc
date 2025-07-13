import { useEffect, useState } from "react";

export default function PaymentCheck({ wallet, onSuccess }) {
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!wallet) return;

    const checkPayment = async () => {
      setChecking(true);
      try {
        setError(import.meta.env.VITE_API_BASE_URL);

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/check-payment?from=${wallet}`);
        const data = await res.json();

        if (data.success) {
          onSuccess(data); // 🔁 Gọi callback nếu đã thanh toán hoặc duyệt tay
        } else {
          setError(data.message || "Chưa phát hiện thanh toán");
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra thanh toán:", err);
        setError("Lỗi khi kiểm tra thanh toán");

      }
      setChecking(false);
    };

    checkPayment();
  }, [wallet]);

  return (
    <div className="bg-yellow-50 text-yellow-700 p-4 rounded shadow mt-4 text-sm">
      {checking ? (
        "🔄 Đang kiểm tra thanh toán..."
      ) : error ? (
        <>
          <p>⚠️ {error}</p>
          <p>Vui lòng kiểm tra ví hoặc thử lại sau.</p>
        </>
      ) : null}
    </div>
  );
}
