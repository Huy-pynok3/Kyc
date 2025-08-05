import { useState, useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { WalletContext } from "@/contexts/WalletContext";
import { HelpCircle } from "lucide-react";
import useTooltip from "@/hooks/useTooltip";
import { useTranslation } from "react-i18next";
import { Trans } from 'react-i18next';

export default function WalletConnect({ onSigned }) {

    const { t } = useTranslation("connect"); 

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { wallet, connectWallet } = useContext(WalletContext); // lấy hàm connectWallet từ context
    const iconRef = useRef(null);
    const { showTooltip, setShowTooltip, tooltipRef } = useTooltip();

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
                window.open(
                    "https://chromewebstore.google.com/detail/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=item-share-cb",
                    "_blank"
                );
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
        <div className="relative p-4 space-y-4 border rounded-xl shadow-md max-w-md mx-auto">
            <div className="flex justify-center items-center gap-1 relative">
                <h2 className="text-lg font-semibold">{t('step1_title')}</h2>
                <button
                    ref={iconRef}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none relative"
                    onClick={() => setShowTooltip((prev) => !prev)}
                    title={t("tooltip_title")}
                >
                    <HelpCircle className="w-4 h-4 text-blue-600 cursor-pointer animate-bounce" />
                </button>
            </div>

            {/* Tooltip */}
            {showTooltip && (
                <div
                    ref={tooltipRef}
                    className="absolute z-50 bg-white border border-indigo-300 text-sm text-gray-800 rounded-md shadow-md w-72 px-2 py-2"
                    style={{
                        top: iconRef.current?.offsetTop + 40,
                        left: iconRef.current?.offsetLeft - 250 + 15, // căn chỉnh theo layout
                    }}
                >
                    <div
                        className="absolute w-3 h-3 bg-white rotate-45 border-l border-t border-indigo-300"
                        style={{
                            top: "-6px",
                            left: "250px", // canh đúng dưới icon
                        }}
                    />
                    <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg border border-gray-200">
                        {/* {t("tooltip_description")} */}
                        <Trans i18nKey={t("tooltip_description")} ns="submit" components={{ strong: <strong /> }} />

                    </p>
                </div>
            )}
            {wallet ? (
                <Button className="cursor-pointer" onClick={() => onSigned({ wallet })}>{t("continue")}</Button>
            ) : (
                <Button className="cursor-pointer" onClick={connectAndSign} disabled={loading}>
                    {loading ? t("signing") : t("connect_button")}
                </Button>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}
