import { useLocation, useNavigate } from "react-router-dom";
import FloatingMascots from "./FloatingMascots";
import img from "@/images";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';


export default function ChooseKycPage() {

    const { t, i18n } = useTranslation('home');

    // const location = useLocation();
    const navigate = useNavigate();
    // const walletData = location.state;

    const handleSelect = (type) => {
        if (type === "maplestory") {
            navigate("/maplestory");
            // navigate("/kyc", { state: { ...walletData, kycType: type } });
        } else {
            alert(t("choose_kyc.coming_soon_alert"));
        }
    };

    return (

        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"
            style={{
                backgroundImage: `
                url('https://msu.io/images/main/section_a/msu_symbol.png'),
                url('https://msu.io/images/main/section_a/bg_section_a.png')
                `,
                backgroundRepeat: "no-repeat, no-repeat",
                backgroundPosition: "calc(50% + 375px) -347px, 50%",
                backgroundSize: "1410px auto, cover",
            }}
        >

            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6 text-center">

                <h1 className="text-2xl font-bold text-indigo-700">{t("choose_kyc.title")}</h1>
                <p style={{display: 'none'}}>Current Lang: {i18n.language}</p>
                <p className="text-gray-600 text-sm">
                    {t('choose_kyc.subtitle')}
                </p>

                <div className="grid gap-3">
                    <button
                        onClick={() => handleSelect("maplestory")}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition cursor-pointer"
                    >
                        <img
                            src="https://msu.io/favicon.ico"
                            alt="maplestory"
                            className="inline-block w-5 h-5 mr-2 align-middle"
                        />
                        KYC MapleStory
                    </button>
                    <button
                        onClick={() => handleSelect("zalo")}
                        className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
                    >
                        <img src={img.zalo} alt="zalo" className="inline-block w-5 h-5 mr-2 align-middle" />
                        KYC Zalo <span className="text-xs text-red-500 ml-1">(Coming soon)</span>
                    </button>
                    <button
                        onClick={() => handleSelect("shopee")}
                        className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
                    >
                        <img src={img.shopee} alt="shopee" className="inline-block w-5 h-5 mr-2 align-middle" />
                        KYC Shopee <span className="text-xs text-red-500 ml-1">(Coming soon)</span>
                    </button>
                    <button
                        onClick={() => handleSelect("san")}
                        className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
                    >
                        💹 KYC Sàn Cỏ<span className="text-xs text-red-500 ml-1">(Coming soon)</span>
                    </button>
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <span>
                        💬 {t("choose_kyc.support_text")}&nbsp;
                        <a
                            href="https://t.me/minelx57"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                            @minelx57
                        </a>
                    </span>
                </div>
            </div>

            <div className="absolute top-0 right-0 p-5 max-md:p-2">
                <LanguageSwitcher/>
            </div>
                
            <FloatingMascots />
        </div>


    );
}
