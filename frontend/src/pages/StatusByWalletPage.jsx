import React, { useState } from "react";

export default function StatusByWalletPage() {
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectAndCheck = async () => {
    if (!window.ethereum) return alert("Cần cài Metamask!");

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const walletAddr = accounts[0].toLowerCase();
    setWallet(walletAddr);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/status/${walletAddr}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Lỗi truy vấn");

      setStatus(data.status);
    } catch (err) {
      setStatus("not_found");
    }

    setLoading(false);
  };

  const renderStatus = () => {
    switch (status) {
      case "approved":
        return <p className="text-green-600">✅ KYC thành công!</p>;
      case "pending":
        return <p className="text-yellow-600">⏳ Đang chờ xác minh</p>;
      case "rejected":
        return <p className="text-red-600">❌ Đã bị từ chối – vui lòng sửa lại thông tin</p>;
      case "not_found":
        return <p className="text-gray-600">📭 Chưa có yêu cầu KYC nào từ ví này</p>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">🔎 Kiểm Tra Trạng Thái KYC</h2>

      <button
        onClick={connectAndCheck}
        className="bg-indigo-600 text-white px-6 py-2 rounded shadow"
      >
        Kết nối ví & kiểm tra
      </button>

      {wallet && (
        <p className="mt-4 text-sm text-gray-500">Địa chỉ ví: {wallet}</p>
      )}

      <div className="mt-6 text-xl">{loading ? "⏳ Đang kiểm tra..." : renderStatus()}</div>
    </div>
  );
}
