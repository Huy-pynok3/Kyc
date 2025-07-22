import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginScreen from "@/components/LoginScreen";
import AvatarMenu from "@/components/AvatarMenu";

const HomePage = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId") || "");

  const handleStart = () => {
    navigate("/order");
  };

  if (!studentId) {
    return <LoginScreen studentId={studentId} setStudentId={setStudentId} />;
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4">
        <AvatarMenu studentId={studentId} />
      </div>

      <div
        className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-100 px-4 py-6 max-w-md mx-auto text-gray-900"
        style={{
          backgroundImage: `
            url('https://msu.io/images/main/section_a/msu_symbol.png'),
            url('https://msu.io/images/main/section_a/bg_section_a.png')
          `,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundPosition: "center -347px, center",
          backgroundSize: "contain, cover",
        }}
      >
        {/* Tiêu đề với nền đệm */}
        <div className="bg-white bg-opacity-80 py-2 px-4 rounded-lg mx-auto max-w-sm sm:max-w-md mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            📘 Hướng dẫn thực hiện Job KYC
          </h1>
        </div>

        {/* Nút Nhận Job ngay (fixed bottom) */}
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-10">
          <button
            onClick={handleStart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition cursor-pointer"
          >
            Nhận Job ngay
          </button>
        </div>

        <div className="space-y-6 ">
          {/* Bước 1 */}
          <div className="bg-white bg-opacity-90 p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-2 text-gray-900">🔹 Bước 1: Nhấn "Nhận đơn"</h2>
            <img src="/guide/step1.png" alt="Bước 1" className="rounded-lg border w-full" />
            <p className="text-sm mt-2 text-gray-700">
              Đơn sẽ cập nhật liên tục hàng ngày (nếu có). Bấm <strong>Nhận đơn</strong> sẽ được chuyển đến trang xác minh danh tính (KYC).
            </p>
          </div>

          {/* Bước 2 */}
          <div className="bg-white bg-opacity-90 p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-2 text-gray-900">
              🔹 Bước 2: Thực hiện KYC theo hướng dẫn bên <strong>ARGOS Identity</strong>
            </h2>
            <p className="text-sm mt-2 text-gray-700">Chụp ảnh giấy tờ, selfie và hoàn tất xác minh.</p>
          </div>

          {/* Bước 3 */}
          <div className="bg-white bg-opacity-90 p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-2 text-gray-900">
              🔹 Bước 3: Gửi ảnh xác nhận KYC kèm thông tin ngân hàng nhận tiền
            </h2>
            <img src="/guide/step3.jpg" alt="Bước 3" className="rounded-lg border w-full" />
            <p className="text-sm mt-2 text-gray-700">
              Chụp ảnh toàn màn hình thông báo "KYC is approved" cùng mã và bấm <strong>Tôi đã hoàn tất</strong> góc trái màn hình để gửi ảnh thông tin xác minh.
            </p>
          </div>

          {/* Cảnh báo */}
          <div className="bg-yellow-50 bg-opacity-90 border border-yellow-300 p-4 rounded-xl text-sm text-center">
            <p className="text-red-800 font-semibold">⚠️ Chỉ nhận Job và thực hiện KYC trên hệ thống chính thức.</p>
            <p className="text-gray-700 mt-2">
              Đường link xác minh phải bắt đầu bằng: <br />
              <span className="font-mono text-blue-800">https://form.argosidentity.com/?pid=p4n42yhhy</span>
            </p>
            <p className="text-red-800 mt-2 font-medium">
              Nếu bạn tự ý xác minh qua đường link lạ, bên mình sẽ <strong>không chịu trách nhiệm</strong> về hậu quả xảy ra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;