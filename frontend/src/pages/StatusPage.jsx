import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, PartyPopper, Syringe, ClipboardPen } from "lucide-react";
import FloatingMascots from "@/components/FloatingMascots";
import { useNavigate } from "react-router-dom";

export default function StatusPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const wallet = params.get("wallet");

    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const [images, setImages] = useState([]);
    const [showImages, setShowImages] = useState(false);

    const [previewUrl, setPreviewUrl] = useState(null);
    const [paidAt, setPaidAt] = useState(null);
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const url = `${import.meta.env.VITE_API_BASE_URL}/api/kyc/status/${wallet}`;
                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                    },
                });
                const data = await res.json();

                // if (!(data.status === 'approved' || data.forceApproved)) {
                //     // 👈 Nếu không đủ điều kiện → chuyển hướng
                //     navigate('/kyc');
                //     return;
                // }
                if (data.status === "") {
                    // 👈 Nếu không đủ điều kiện → chuyển hướng
                    navigate("/kyc");
                    return;
                }
                setInfo(data);

                if (data.status === "approved") {
                    const resImg = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/${wallet}/images`);
                    if (resImg.ok) {
                        const imgData = await resImg.json();
                        setImages(imgData.images || []);
                        setPaidAt(imgData.paidAt || null);
                    } else {
                        console.warn("Không lấy được ảnh KYC");
                    }
                }
            } catch (err) {
                alert("Lỗi khi tải trạng thái KYC.");
            }
            setLoading(false);
        };

        if (wallet) fetchStatus();
    }, [wallet]);

    if (loading) return <p className="text-center mt-10">⏳ Đang tải trạng thái...</p>;
    if (!info) return <p className="text-center mt-10 text-red-600">❌ Không tìm thấy thông tin KYC.</p>;

    const { status, submittedAt, processedAt, reason, txHash } = info;
    console.log("Dữ liệu info:", info.submittedAt, info.processedAt, info.reason);

    const formatDate = (dateStr) => {
        if (!dateStr || typeof dateStr !== "string") return "...";
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "..." : d.toLocaleString("vi-VN");
    };
    // const formatDate = (iso) => new Date(iso).toLocaleString("vi-VN");
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-gray-50"
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
            <FloatingMascots />
            <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full space-y-6">
                <h2 className="text-2xl font-bold text-indigo-700 text-center">
                    <ClipboardPen size={30} className="inline mr-2" />
                    Trạng thái KYC
                </h2>

                <div className="space-y-2 text-sm text-gray-700">
                    <p>
                        <strong>Ví:</strong> <span className="font-mono text-xs">{wallet}</span>
                    </p>
                    <p>
                        <strong>Gửi lúc:</strong> {formatDate(submittedAt)}
                    </p>
                    {processedAt && (
                        <p>
                            <strong>Đã xử lý lúc:</strong> {formatDate(processedAt)}
                        </p>
                    )}

                    <p>
                        <strong>Trạng thái:</strong>{" "}
                        {status === "approved" ? (
                            <span className="text-green-600 font-semibold">KYC Đã duyệt</span>
                        ) : status === "rejected" ? (
                            <span className="text-red-600 font-semibold">KYC Từ chối</span>
                        ) : (
                            <span className="text-yellow-600 font-semibold">
                                KYC Đang chờ xử lý trong thời gian sớm nhất{" "}
                                <span className="text-xs">(lâu nhất là vài giờ)</span>
                            </span>
                        )}
                    </p>

                    {/* {status === "rejected" && rejectedReason && (
                        <p className="text-red-500">❌ Lý do từ chối: {rejectedReason}</p>
                    )} */}
                    {status === "rejected" && (
                        <div className="mt-2 text-sm text-red-600">
                            <Syringe size={20} className="inline mr-1" />
                            <strong>Lý do:</strong> {reason || "Không rõ lý do"}
                        </div>
                    )}

                    {txHash && (
                        <p>
                            <strong>Giao dịch:</strong>{" "}
                            <a
                                href={`https://bscscan.com/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Xem trên BscScan
                            </a>
                        </p>
                    )}

                    {/* {status === "approved" && (
                        <div className="bg-green-50 border border-green-300 rounded p-3 mt-4 text-green-700">
                            <div className="flex items-center gap-2">
                                <Check size={20} className="text-green-600" />
                                <span>KYC đã được duyệt lúc {formatDate(processedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <PartyPopper size={20} className="text-yellow-500" />
                                <span>Bạn đã đủ điều kiện chơi MapleStory N!</span>
                            </div>
                        </div>
                    )} */}
                    {status === "approved" && paidAt && (
                        <>
                            <div className="bg-green-50 border border-green-300 rounded p-3 mt-4 text-green-700">
                                <div className="flex items-center gap-2">
                                    <Check size={20} className="text-green-600" />
                                    {/* <span>KYC đã được duyệt lúc {formatDate(processedAt)}</span> */}
                                    <span>KYC đã được duyệt lúc {new Date(paidAt).toLocaleString("vi-VN")}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <PartyPopper size={20} className="text-yellow-500" />
                                    <span>Bạn đã đủ điều kiện chơi MapleStory N!</span>
                                </div>
                            </div>

                            {info.status === "approved" && images.length > 0 && (
                                <div className="mt-4">
                                    <button
                                        onClick={() => setShowImages(!showImages)}
                                        className="text-sm text-blue-600 underline"
                                    >
                                        {showImages ? "Ẩn ảnh" : "Xem chi tiết ảnh đã xác minh"}
                                    </button>
                                    {/* <p className="text-sm font-semibold mb-2 text-gray-700">Ảnh đã gửi:</p> */}
                                    {showImages && (
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {images.map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt={`Ảnh ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded cursor-pointer border"
                                                    onClick={() => setPreviewUrl(url)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Modal hiển thị ảnh lớn */}
                            {previewUrl && (
                                <div
                                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                    onClick={() => setPreviewUrl(null)}
                                >
                                    <img
                                        src={previewUrl}
                                        alt="Xem ảnh lớn"
                                        className="max-w-[90%] max-h-[90%] rounded shadow-lg"
                                    />
                                </div>
                            )}

                            {/* {info.status === "approved" && images.length > 0 && (
                            <div className="mt-4 z-100">
                                <button
                                    onClick={() => setShowImages(!showImages)}
                                    className="text-sm text-blue-600 underline"
                                >
                                    {showImages ? "Ẩn ảnh" : "Xem chi tiết ảnh đã xác minh"}
                                </button>

                                {showImages && (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {images.map((url, i) => (
                                            <img
                                                key={i}
                                                src={url}
                                                alt={`Ảnh KYC ${i + 1}`}
                                                className="rounded border object-cover"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )} */}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
