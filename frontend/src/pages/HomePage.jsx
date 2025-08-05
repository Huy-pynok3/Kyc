import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WalletConnect from "@/components/WalletConnect";
import FloatingMascots from "@/components/FloatingMascots";
import { useTranslation } from "react-i18next";

export default function HomePage() {
    const { t } = useTranslation("connect");

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
                <h1 className="text-3xl font-bold text-indigo-700">{t("title")}</h1>
                <p className="text-gray-600">{t("description")}</p>

                <WalletConnect onSigned={handleSigned} />

                <button
                    onClick={() => navigate("/guide")}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                    {t("guide")}
                </button>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer underline"
                    >
                        {t("back_home")}
                    </button>
                </div>
            </div>
        </div>
    );
}
