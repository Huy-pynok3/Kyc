import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WalletConnect from "@/components/WalletConnect";
import PaymentCheck from "@/components/PaymentCheck";
import FloatingMascots from "@/components/FloatingMascots";
import img from "@/images";

export default function HomePage() {
    const [walletData, setWalletData] = useState(null);
    const navigate = useNavigate();

    const handleSigned = (data) => {
        setWalletData(data);
        // navigate("/kyc", { state: { ...walletData, kycType: type } });

        navigate("/kyc", { state: data });
        // navigate("/choose-kyc", { state: data });
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"
            style={{
                backgroundImage: `
            url('/images/main/section_a/msu_symbol.png'),
            url('https://msu.io/images/main/section_a/bg_section_a.png')
            `,
                backgroundRepeat: "no-repeat, no-repeat",
                backgroundPosition: "calc(50% + 375px) -347px, 50%",
                backgroundSize: "1410px auto, cover",
            }}
        >
            {/* <PaymentCheck /> */}
            <FloatingMascots />

            <div className="max-w-lg w-full bg-white rounded-xl shadow-md p-6 space-y-6 text-center">
                <h1 className="text-3xl font-bold text-indigo-700">Service KYC MapleStory N</h1>
                <p className="text-gray-600">
                    📝 Để sử dụng dịch vụ KYC, vui lòng kết nối ví của bạn và xác nhận chữ ký. Sau khi KYC, bạn sẽ đủ
                    điều kiện chơi MapleStory N hoặc nhận NXPC token.
                </p>

                <WalletConnect onSigned={handleSigned} />

                <button
                    onClick={() => navigate("/guide")}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                    📘 Xem hướng dẫn lấy link KYC
                </button>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    {/* <span>
                        💬 Cần hỗ trợ? Liên hệ&nbsp;
                        <a
                            href="https://t.me/minelx57"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                            @minelx57
                        </a>
                    </span> */}
                <button onClick={() => navigate("/")} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer underline">
                    
                    ← Quay lại trang chủ
                </button>
                </div>
            </div>
            {/* <a
                href="https://t.me/minelx57"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white 
             px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 
             hover:scale-105 transition 
             sm:text-xs sm:px-3 sm:py-1.5 sm:gap-1.5"
            >
                <img src={img.tele} alt="Telegram" className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Hỗ trợ: @minelx57</span>
            </a> */}
        </div>
    );
}
