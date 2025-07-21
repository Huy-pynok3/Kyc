
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function KycStatusPage() {
  const { kycId } = useParams();
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/session-status/${kycId}`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        });
        setStatusData(res.data);
      } catch (err) {
        console.error("Lỗi lấy trạng thái phiên:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [kycId]);

  const renderStatus = () => {
    if (!statusData) return null;

    switch (statusData.status) {
      case "checking":
        return (
          <div className="text-yellow-600">
            <div className="text-3xl mb-2 animate-pulse">🕵️</div>
            <p className="text-lg font-semibold">Trạng thái chờ kiểm tra</p> 

            <p className="text-sm text-gray-600 mt-1">Bên mình sẽ kiểm tra thông tin của bạn trong thời gian sớm nhất.</p>
          </div>
        );
      case "paid":
        return (
          <div className="text-green-600">
            <div className="text-3xl mb-2">💸</div>
            <p className="text-lg font-semibold">Đã thanh toán!</p>
            <p className="text-sm text-gray-600 mt-1">Cảm ơn bạn đã hoàn thành xác minh. Phần thưởng đã được gửi.</p>
            {statusData.paidAt && (
              <p className="text-xs text-gray-500 mt-2">
                Thời gian thanh toán: {new Date(statusData.paidAt).toLocaleString()}
              </p>
            )}
          </div>
        );
      case "rejected":
        return (
          <div className="text-red-600">
            <div className="text-3xl mb-2 animate-pulse">🥺</div>
            <p className="text-lg font-semibold">Bị từ chối</p>
            <p className="text-sm mt-1">
              Đơn KYC của bạn đã bị từ chối.Mình rất buồn vì bạn thiếu trung thực.
            </p>
            {statusData.adminNote && (
              <p className="text-xs text-gray-500 mt-2 italic">Lý do: {statusData.adminNote}</p>
            )}
          </div>
        );
      default:
        return <p className="text-gray-500">Không xác định trạng thái.</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm bg-gray-100 shadow-md rounded-2xl p-6 text-center">
      <div className="text-4xl mb-4 animate-bounce">📤</div>
       <h1 className="text-xl font-bold text-gray-800 mb-2">
          Gửi thông tin thành công!
         </h1>
        {/* <h1 className="text-xl font-bold mb-4 animate-bounce">📍 Gửi thông tin thành công!</h1> */}
        <div className="text-sm text-green-500 mb-2 break-all">Mã KYC: {kycId}</div>

        {loading ? (
          <p className="text-gray-500 animate-pulse">Đang tải trạng thái...</p>
        ) : (
          renderStatus()
        )}

        {/* <div className="mt-6 text-xs text-gray-400">
          Nếu có thắc mắc, hãy liên hệ admin để được hỗ trợ sớm nhất.
        </div> */}
      </div>
      <div className="mt-6 text-center">
                <button
                onClick={() => navigate("/")}
                className="text-blue-600 hover:underline"
                >
                ← Quay về trang chính
                </button>
            </div>
    </div>
  );
}
