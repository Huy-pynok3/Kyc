import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { WalletContext } from "@/contexts/WalletContext";

export default function WalletConnect({ onSigned }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { connectWallet } = useContext(WalletContext); // lấy hàm connectWallet từ context

    function isMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      }
    
      function isMetaMaskInstalled() {
        return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
      }
    
    const connectAndSign = async () => {
        setLoading(true);
        setError("");

        // Kiểm tra nếu đang sử dụng trên thiết bị di động
        // và nếu không có MetaMask, gợi ý mở bằng app Metamask
        const isMobileBrowser = isMobile();
        const hasEthereum = isMetaMaskInstalled();
        if (!hasEthereum) {
            if (isMobileBrowser) {
              // Gợi ý mở bằng app Metamask
              const currentUrl = window.location.href;
              const dappLink = `https://metamask.app.link/dapp/${currentUrl.replace(/^https?:\/\//, "")}`;
              window.location.href = dappLink;
              return;
            } else {
                setError("Vui lòng cài đặt Metamask extension trên trình duyệt.");
                 window.open("https://chromewebstore.google.com/detail/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=item-share-cb", "_blank");
                 setLoading(false);
              return;
            }
          }
        //
        try {
            // if (!window.ethereum) throw new Error("Vui lòng cài Metamask");

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const wallet = accounts[0];
            const now = new Date().toLocaleString();
            const message = `Tôi đồng ý thực hiện KYC cho ví: ${wallet} \nThời gian: ${now}`;

            const signature = await window.ethereum.request({
                method: "personal_sign",
                params: [message, wallet],
            });

            await connectWallet(); // cập nhật context

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
