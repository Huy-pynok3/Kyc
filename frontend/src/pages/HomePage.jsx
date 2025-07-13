import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WalletConnect from "@/components/WalletConnect";
import PaymentCheck from "@/components/PaymentCheck";
export default function HomePage() {
  const [walletData, setWalletData] = useState(null);
  const navigate = useNavigate();

  const handleSigned = (data) => {
    setWalletData(data);
    navigate("/kyc", { state: data }); // chuyển sang bước 2
    
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"
        style={{
            backgroundImage: `
            url('/images/main/section_a/msu_symbol.png'),
            url('https://msu.io/images/main/section_a/bg_section_a.png')
            `,
            backgroundRepeat: 'no-repeat, no-repeat',
            backgroundPosition: 'calc(50% + 375px) -347px, 50%',
            backgroundSize: '1410px auto, cover',
        }}
    >
      {/* <PaymentCheck /> */}
        <img
            alt="yeti"
            width={154}
            height={158}
            src="https://msu.io/_next/image?url=%2Fimages%2Fmain%2Fsection_c%2Forange.png&w=256&q=75"
            className="absolute bottom-40 right-40 animate-bounce"
            style={{ zIndex: 10 }}
        />
        <img
            alt="yeti"
            width={154}
            height={158}
            src="https://msu.io/_next/image?url=%2Fimages%2Fmain%2Fsection_c%2Fpinkbean.png&w=256&q=75"
            className="absolute top-50 left-50 animate-spin"
            style={{ zIndex: 10 }}
        />

      <div className="max-w-lg w-full bg-white rounded-xl shadow-md p-6 space-y-6 text-center">
        <h1 className="text-3xl font-bold text-indigo-700">Service KYC MapleStory N</h1>
        <p className="text-gray-600">
        📝 Để sử dụng dịch vụ KYC, vui lòng kết nối ví của bạn và xác nhận chữ ký. Sau khi KYC,
        bạn sẽ đủ điều kiện chơi MapleStory N hoặc nhận NXPC token.

        </p>

        <WalletConnect onSigned={handleSigned} />
      </div>

    </div>
  
  );
}
// animate-bounce, animate-ping, animate-pulse, animate-spin.