import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function KycHistoryPage() {
    const studentId = localStorage.getItem("studentId");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        if (!studentId) return;

        axios
            .get(`${API_BASE_URL}/api/kyc/history/${studentId}/kycs`, {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
            })
            .then((res) => {
                setHistory(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy lịch sử:", err);
                setLoading(false);
            });
    }, [studentId]);

    if (!studentId) {
        return <div className="p-4 text-red-500">Bạn chưa đăng nhập.</div>;
    }
    const renderStatus = (status) => {
        switch (status) {
            case "checking":
                return <span className="text-yellow-500">⏳ Chờ kiểm tra</span>;
            case "paid":
                return <span className="text-green-600">💸 Đã thanh toán</span>;
            case "rejected":
                return <span className="text-red-600">❌ Bị từ chối</span>;
            default:
                return <span className="text-gray-500">Không rõ</span>;
        }
    };

    return (
        <div className="min-h-screen bg-white p-4">
            <h1 className="text-xl font-bold text-center mb-4">📚 Lịch sử KYC của bạn</h1>

            {loading ? (
                <p className="text-center text-gray-500">Đang tải...</p>
            ) : history.length === 0 ? (
                <p className="text-center text-gray-500">Chưa thực hiện phiên KYC nào.</p>
            ) : (
                <div className="space-y-3">
                    {history.map((item) => (
                        <div key={item._id} className="border p-3 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">
                                <strong>Ví:</strong> {item.wallet.slice(0, 6)}...{item.wallet.slice(-4)}
                            </p>
                            <p className="text-sm text-blue-600">
                                <strong>Mã đơn:</strong> {item.kycSessionId}
                            </p>
                            <p className="text-sm">
                                <strong>Gửi lúc:</strong>{" "}
                                {new Date(item.imageUploadedAt || item.startedAt).toLocaleString("vi-VN")}
                            </p>
                            <p className="text-sm">
                                <strong>Trạng thái:</strong> {renderStatus(item.status)}
                            </p>

                            {item.status === "paid" && (
                                <div className="mt-1 inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-medium w-fit">
                                    Đã nhận: 40.000 VNĐ
                                </div>
                            )}
                            {item.status === "rejected" && item.adminNote && (
                                // <p className="text-sm text-red-500">
                                //     <strong>Lý do từ chối:</strong> {item.adminNote}
                                // </p>
                                <div className="mt-1 inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded text-xs font-medium w-fit">
                                    <strong>Lý do từ chối:</strong> {item.adminNote}
                                </div>
                            )}
                            <p className="text-sm ">
                                <strong>Ngân hàng:</strong> {item.bankInfo}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-6 text-center">
                <button onClick={() => navigate("/")} className="text-blue-600 hover:underline">
                    ← Quay về trang chính
                </button>
            </div>
        </div>
    );
    // return (
    //     <div className="max-w-md mx-auto p-4 text-sm">
    //         <h1 className="text-lg font-semibold mb-4 text-center">📋 Lịch sử KYC</h1>

    //         {loading ? (
    //             <p>⏳ Đang tải...</p>
    //         ) : history.length === 0 ? (
    //             <p>😔 Không có lịch sử nào.</p>
    //         ) : (
    //             <ul className="space-y-2">
    //                 {history.map((item, idx) => (
    //                     <li key={idx} className="p-3 border rounded bg-white shadow text-gray-800">
    //                         <p>
    //                             <span className="font-medium">Trạng thái:</span>
    //                         {item.status ==="checking" ?
    //                             (<span className="font-medium">Chờ kiểm tra</span>) : item.status === "paid" ?
    //                             (<span className="text-green-600 font-medium">Đã thanh toán</span>) :
    //                             (<span className="text-green-600 font-medium">Đã từ chối</span>)
    //                         }
    //                         </p>
    //                         <p>
    //                             🕒 <span className="font-medium">Gửi lúc:</span>{" "}
    //                             {new Date(item.imageUploadedAt || item.startedAt).toLocaleString("vi-VN")}
    //                         </p>
    //                         <p>
    //                             👛 <span className="font-medium">Ví:</span>{" "}
    //                             <span className="break-all text-xs">{item.wallet}</span>
    //                         </p>
    //                         <p>
    //                             🏛️ <span className="font-medium">Ngân hàng:</span>{" "}
    //                             <span className="break-all text-xs">{item.bankInfo || "Quên rồi"}</span>
    //                         </p>
    //                     </li>
    //                 ))}
    //             </ul>
    //         )}

    //         <div className="mt-6 text-center">
    //             <button onClick={() => navigate("/")} className="text-blue-600 hover:underline text-sm">
    //                 ← Quay về trang chính
    //             </button>
    //         </div>
    //     </div>
    // );
}
