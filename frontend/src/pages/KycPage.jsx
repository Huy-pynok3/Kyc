import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FloatingMascots from "@/components/FloatingMascots";
import PaymentSection from "./PaymentSection";
import { Check } from "lucide-react";
import jsQR from "jsqr"

export default function KycPage() {
    const location = useLocation();
    const walletData = location.state;
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [mapleLink, setMapleLink] = useState("");
    const [kycSubmitted, setKycSubmitted] = useState(false);
    const canvasRef = useRef();
    // Payment state variables
    const [hasPaid, setHasPaid] = useState(false);
    const [checkingPayment, setCheckingPayment] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);

    const [loading, setLoading] = useState(false);
    const [justPaid, setJustPaid] = useState(false);

    const hasPaidRef = useRef(false); // để tracking hasPaid đúng ngay lập tức

    const [expired, setExpired] = useState(false); // trạng thái hết hạn thanh toán

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                setMapleLink(code.data);
            } else {
                alert("Không đọc được mã QR, vui lòng thử lại.");
            }
        };
        img.src = URL.createObjectURL(file);
    };

    const checkPayment = async () => {
        if (!walletData?.wallet) return;
        setCheckingPayment(true);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/check-payment?from=${walletData.wallet}`,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                    },
                }
            );
            const data = await res.json();

            if (data.success) {
                if (!hasPaidRef.current) {
                    setHasPaid(data.success);
                    hasPaidRef.current = true;

                    setJustPaid(true);
                    setTimeout(() => setJustPaid(false), 4000);
                }
            }

            setPaymentResult(data);
        } catch (err) {
            console.error("Lỗi khi kiểm tra giao dịch:", err);
        }

        setCheckingPayment(false);
    };

    // Kiểm tra thanh toán mỗi 5 giây
    useEffect(() => {
        const interval = setInterval(() => {
            // if (expired) return; // Nếu đã hết hạn, không cần kiểm tra nữa
            if (hasPaidRef.current || expired) return; // Nếu đã thanh toán, không cần kiểm tra nữa

            checkPayment();
        }, 5000); // 5s kiểm tra một lần

        return () => clearInterval(interval);
    }, [expired]);

    // useEffect(() => {
    //   if (justPaid) {
    //     const audio = new Audio("/success.mp3");
    //     audio.play();
    //   }
    // }, [justPaid]);
    // useEffect(() => {
    //   if (hasPaid) {
    //     // Đợi nhẹ để user thấy thông báo đã thanh toán (nếu cần)
    //     setTimeout(() => {
    //     }, 1000);
    //   }
    // }, [hasPaid]);
    useEffect(() => {
        if (!walletData?.wallet) return navigate("/");
        const checkExistingKyc = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/status/${walletData.wallet}`, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                    },
                });
                const data = await res.json();

                if (["approved", "pending", "rejected", "checking"].includes(data.status)) {
                    // Nếu ví đã tồn tại, tự động chuyển hướng sang trang trạng thái
                    navigate(`/status?wallet=${walletData.wallet}`);
                }
            } catch (err) {
                console.log("Ví chưa có KYC – tiếp tục cho phép nhập form");
            } 
        };

        checkExistingKyc();
    }, [walletData?.wallet, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                email,
                mapleLink,
                wallet: walletData.wallet,
                signature: walletData.signature,
            };

            console.log("Gửi thông tin:", payload);

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Gửi thất bại");

            // Điều hướng sang trang trạng thái

            navigate(`/status?wallet=${walletData.wallet}`);
            alert("KYC đã được gửi thành công!");
            setKycSubmitted(true); 
        } catch (err) {
            alert("Lỗi khi gửi KYC: " + err.message);
        }

        setLoading(false);
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50"
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
            <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full space-y-6">
                {!hasPaid ? (
                    <>
                        <FloatingMascots hidden={true} />
                        <PaymentSection
                            wallet={walletData.wallet}
                            checkingPayment={checkingPayment}
                            checkPayment={checkPayment}
                            paymentResult={paymentResult}
                            qrUrl={walletData.qrUrl}
                            onExpire={() => setExpired(true)} // callback báo khi hết hạn
                            onResetExpire={() => setExpired(false)} // callback để reset trạng thái hết hạn
                        />
                        
                    </>
                ) : justPaid ? (
                    <>
                        <FloatingMascots />

                        <div
                            className="mb-4 bg-green-100 border border-green-300 text-green-800 px-4 py-4 rounded-lg shadow-md
                            transition-all duration-500 ease-in-out transform hover:scale-[1.01]"
                        >
                            <h3 className="text-sm font-semibold mb-1">💸 Thanh toán thành công!</h3>
                            <p className="text-sm mb-2">
                                Cảm ơn bạn đã thanh toán. Vui lòng hoàn tất bước KYC bên dưới.
                            </p>
                            <button
                                onClick={() => setJustPaid(false)} // hoặc ẩn tự động sau 5s
                                className="text-green-700 underline text-xs"
                            >
                                Đóng
                            </button>
                        </div>
                    </>
                ) : !kycSubmitted ? (
                    <>
                        <FloatingMascots />
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-600">
                                    Email (tuỳ chọn):
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-600">
                                    Link KYC từ MapleStory (bắt buộc):
                                </label>
                                <input
                                    type="url"
                                    value={mapleLink}
                                    onChange={(e) => setMapleLink(e.target.value)}
                                    placeholder="https://form.argosidentity.com/?pid=p4n42yhhy1&..."
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-600">
                                    Hoặc upload ảnh QR KYC:
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                                <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
                                <ul className="text-sm text-red-500 list-disc ml-5 mt-2">
                                    <li>Ảnh cần rõ nét, đủ sáng, không bị che hoặc cắt góc QR</li>
                                    <li>Nên cắt màn hình chỉ hiển thị mã QR</li>
                                    <li>Upload ảnh QR KYC là hỗ trợ ae không quét được QR lấy link</li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                            >
                                {loading ? "Đang xử lý..." : "Tạo phiên KYC"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <FloatingMascots />
                        <div className="text-center">
                            <p className="mb-2 text-green-600 font-semibold">
                                <Check size={20} className="text-green-600" />
                                Đã ghi nhận thông tin!
                            </p>

                            <a href={`/status?wallet=${walletData.wallet}`} className="text-blue-600 underline">
                                👉 Nhấn vào đây để kiểm tra kết quả KYC
                            </a>
                        </div>
                    </>
                )}
            </div>
            <div>
                {walletData && (
                    <div className="mt-4 text-sm text-green-600">
                        <Check size={20} className="inline mr-2" />
                        Đã ký xác nhận cho ví: <span className="font-mono">{walletData.wallet}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
