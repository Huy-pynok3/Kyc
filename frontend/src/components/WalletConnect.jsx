import { useState, useContext  } from "react";
import { Button } from "@/components/ui/button";
import { WalletContext } from "@/contexts/WalletContext";
export default function WalletConnect({ onSigned }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { connectWallet } = useContext(WalletContext); // ← THÊM dòng này
  const connectAndSign = async () => {
    setLoading(true);
    setError("");
    try {
      if (!window.ethereum) throw new Error("Vui lòng cài Metamask");

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const wallet = accounts[0];
      const now = new Date().toLocaleString();
      const message = `Tôi đồng ý thực hiện KYC cho ví: ${wallet} \nThời gian: ${now}`;

      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, wallet],
      });

      await connectWallet(); // ← THÊM dòng này để cập nhật context

      onSigned({ wallet, message, signature });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4 border rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold">Bước 1: Kết nối ví và ký xác nhận</h2>
      <Button className="cursor-grab" onClick={connectAndSign} disabled={loading}>
        {loading ? "Đang ký..." : "Kết nối & ký Metamask"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
