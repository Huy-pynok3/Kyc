import { useState } from "react";
import axios from "axios";
import UploadedImagesViewer from "./UploadedImagesViewer";

export default function AdminSessionCard({ session }) {
    const [status, setStatus] = useState(session.status || "checking");
    const [note, setNote] = useState(session.adminNote || "");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (status === "rejected" && !note.trim()) {
            alert("Vui lòng nhập lý do từ chối.");
            return;
        }
        const token = localStorage.getItem("adminToken");
        if (!token) {
            alert("Bạn chưa đăng nhập quản trị viên.");
            return;
        }
        // console.log("Token:", token); 
        // console.log("Data gửi:", { kycId: session.kycId, status, adminNote: status === "rejected" ? note : "" });
        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/session-status/update`, {
                kycId: session.kycId,
                status,
                adminNote: status === "rejected" ? note : "",
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            
            alert("Cập nhật thành công!");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi cập nhật trạng thái.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-xl p-4 mb-4 border max-w-md mx-auto">
            <div className="text-sm text-gray-700 space-y-1">
                <p>
                    <strong>KYC ID:</strong> <span className="break-all">{session.kycId}</span>
                </p>
                <p>
                    <strong>Ví:</strong> <span className="break-all text-blue-700">{session.wallet}</span>
                </p>
                <p>
                    <strong>User:</strong> {session.studentId} 
                </p>
                <p>
                    <strong>Mã:</strong> {session.kycSessionId}
                </p>
                <p>
                    <strong>Emoji:</strong> {session.emoji}
                </p>
                <p>
                    <strong>Bắt đầu:</strong> {new Date(session.startedAt).toLocaleString()}
                </p>
                <p>
                    <strong>Kết thúc:</strong> {new Date(session.clickedConfirmedAt).toLocaleString()}
                </p>
                <p>
                    <strong>Gửi ảnh lúc:</strong> {new Date(session.imageUploadedAt).toLocaleString()}
                </p>

                <p>
                    <strong>Ngân hàng:</strong> {session.bankInfo}
                </p>
                <p><strong>Ảnh đã gửi: </strong></p>
    
                <UploadedImagesViewer uploadedImages={session.uploadedImages} />
            </div>



            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border rounded p-2"
                >
                    <option value="checking">🕵️ Đang kiểm tra</option>
                    <option value="paid">💸 Đã thanh toán</option>
                    <option value="rejected">❌ Từ chối</option>
                </select>
            </div>

            {status === "rejected" && (
                <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lý do từ chối</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full border rounded p-2 text-sm"
                        rows={2}
                        placeholder="Nhập lý do từ chối..."
                    />
                </div>
            )}

            <button
                onClick={handleUpdate}
                disabled={loading}
                className={`mt-4 w-full py-2 rounded font-semibold text-white transition ${
                    loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
                {loading ? "Đang lưu..." : "Cập nhật trạng thái"}
            </button>
        </div>
    );
}
