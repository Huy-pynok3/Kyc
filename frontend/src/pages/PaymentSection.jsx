import React, { useState, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";

export default function PaymentSection({
    wallet,
    qrUrl,
    checkPayment,
    checkingPayment,
    paymentResult,
    onExpire, // Hàm callback khi hết giờ tu KycPage
    onResetExpire, // Hàm callback để reset trạng thái hết hạn
    
}) {
    const { t } = useTranslation("payment");

    const [method, setMethod] = useState("crypto");
    const [manualWallet, setManualWallet] = useState("");

    const [timeLeft, setTimeLeft] = useState(600); // 10 phút crypto, 5 phút bank
    const [expired, setExpired] = useState(false);
    const amount = parseInt(import.meta.env.VITE_PRICE_BANK) || 100000; 
    const usdt = parseFloat(import.meta.env.VITE_PRICE_CRYPTO) || 5; 
    qrUrl = `https://qr.sepay.vn/img?bank=VietinBank&acc=101877183706&amount=${amount}&des=SEVQR+TKPTPT${encodeURIComponent(
        wallet
    )}&size=200x200`;

    // Reset timer khi đổi phương thức
    useEffect(() => {
        setTimeLeft(method === "crypto" ? 600 : 240); // 10p hoặc 5p
        setExpired(false);
        onResetExpire(); //  báo lên KycPage để tiếp tục check-payment
    }, [method]);


    // Bắt đầu countdown
    useEffect(() => {
        if (expired) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setExpired(true);
                   
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [expired]);

   // Khi hết hạn => báo về KycPage
    useEffect(() => {
        if (expired) {
        onExpire();
        }
    }, [expired, onExpire]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 w-full max-w-xl mx-auto space-y-4 cursor-grab">
            <h2 className="text-2xl font-bold text-indigo-700 text-center">{t('step_title')}</h2>

            <h2 className="text-xl font-semibold text-indigo-700 mb-4 text-center cursor-grab">
                {t('method_title')}
            </h2>
            {/* Chọn phương thức */}
            <div className="flex justify-center gap-3 text-sm flex-wrap ">
                <button
                    onClick={() => setMethod("crypto")}
                    className={`cursor-grab px-4 py-2 rounded-lg border ${
                        method === "crypto" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {t('method_crypto')}
                </button>
                <button
                    onClick={() => setMethod("bank")}
                    className={`cursor-grab px-4 py-2 rounded-lg border ${
                        method === "bank" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {t('method_bank')}
                </button>
            </div>

            {/* Countdown */}
            <div className="text-sm text-center text-gray-600 mb-4">
                {/* ⏳ Thời gian còn lại: <span className="font-semibold">{formatTime(timeLeft)}</span> */}
                <Trans i18nKey={t('countdown')} values={{ time: formatTime(timeLeft) }} components={{ 1: <span className="font-semibold" /> }} />
            </div>

            {!expired ? (
                method === "crypto" ? (
                    <>
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded text-sm">
                            <p className="mb-2">
                                <Trans i18nKey={t("crypto_notice")}  values= {{usdt}} components={{ strong: <strong /> }} />

                                {/* 💰 Vui lòng chuyển <strong>{usdt} USDT (BEP-20)</strong> đến địa chỉ: */}
                            </p>

                            <div className="bg-gray-100 p-3 rounded break-all font-mono text-gray-800 mb-4 text-xs cursor-auto">
                                0x2fecd57da676a1c43c2fec4f47b3d7dc753db2e9
                            </div>

                            <p className="text-sm text-gray-700 mb-2">
                                {/* Nếu bạn gửi từ sàn (Binance, OKX,...), vui lòng nhập địa chỉ ví bạn đã dùng để gửi: */}
                                {t('crypto_note_wallet')}
                            </p>

                            <input
                                type="text"
                                value={manualWallet}
                                onChange={(e) => setManualWallet(e.target.value)}
                                placeholder={t('crypto_input_placeholder')}
                                className="w-full border rounded px-3 py-2 text-sm"
                            />

                            <p className="mt-2">{t('crypto_submit_note')}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => checkPayment(manualWallet)}
                            disabled={checkingPayment}
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 mt-4 cursor-grab"
                        >
                            {checkingPayment ? t("crypto_checking") : t("crypto_submit_btn")}
                        </button>

                        {paymentResult && !paymentResult.success && (
                            <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded">
                                ❌ {paymentResult.message || "Chưa phát hiện giao dịch hợp lệ."}
                                <br />
                                {t('crypto_failed')}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm text-center">
                        <p className="mb-2 font-medium">💸 Vui lòng chuyển khoản <strong>100,000đ</strong> đến:</p>
                        {qrUrl ? (
                            <img src={qrUrl} alt="SePay QR" className="mx-auto w-48 h-48 mb-2" />
                        ) : (
                            <p>Đang tải QR…</p>
                        )}
                    </div> */}
                        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded text-sm space-y-3 wrap">
                            <p>
                                {/* 💸 Vui lòng chuyển khoản <strong>{amount.toLocaleString("vi-VN")} VND</strong> tới tài
                                khoản bên dưới: */}
                                <Trans
                                    i18nKey={t("bank_notice")}
                                    values={{ amount: `${amount.toLocaleString("vi-VN")} VND` }}
                                    components={{ 1: <strong /> }}
                                    />
                            </p>
                            <div className="bg-white px-3 py-2 rounded border border-green-300 text-sm">
                                Ngân hàng: VietinBank
                                <br />
                                STK: <strong>101877183706</strong>
                                <br />
                                Nội dung:{" "}
                                <span className="font-mono break-all inline-block max-w-full">
                                    SEVQR+TKPTPT{wallet || "Mã ví bạn đã ký"}
                                </span>
                            </div>
                            <div className="text-center mt-3">
                                <img src={qrUrl} alt="QR" className="mx-auto w-48 h-48 mb-2" />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => checkPayment()}
                            disabled={checkingPayment}
                            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                        >
                            {checkingPayment ? t("crypto_checking") : t("crypto_submit_btn")}
                        </button>
                        {paymentResult && !paymentResult.success && (
                            <div className="mt-2 text-red-600 text-sm">
                                ❌ {paymentResult.message || "Chưa nhận được thanh toán."}
                            </div>
                        )}
                    </>
                )
            ) : (
                <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded text-sm text-center">
                    {t("expired")}
                    <button
                        className="mt-2 block mx-auto text-blue-600 underline"
                        onClick={() => window.location.reload()}
                    >
                        {t("reload_session")}
                    </button>
                </div>
            )}
        </div>
    );
}
