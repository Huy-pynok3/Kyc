import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import KycHistoryPage from "@/components/KycHistoryPage";
import AvatarMenu from "@/components/AvatarMenu";
import LoginScreen from "@/components/LoginScreen";

const HomePage = () => {
    const navigate = useNavigate();
    
    const [studentId, setStudentId] = useState(localStorage.getItem("studentId") || "");
    const [inputId, setInputId] = useState("");


    const handleStart = () => {
        navigate("/order");
    };
    useEffect(() => {
        const storedId = localStorage.getItem("studentId");
        if (storedId) setStudentId(storedId);
      }, []);
    if (studentId === "") {
        // return <LoginScreen studentId={studentId} setStudentId={setStudentId} />;
        navigate("/login");

    }
    //   if (!studentId) {
    //     return (
    //       <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
    //         <div className="bg-white p-6 rounded shadow max-w-md w-full text-center space-y-4">
    //           <h2 className="text-xl font-bold">🔐 Nhập hoặc tạo mã</h2>
    //           <input
    //             type="text"
    //             className="w-full border rounded px-4 py-2"
    //             placeholder="Nhập mã (nếu đã có)"
    //             value={inputId}
    //             onChange={(e) => setInputId(e.target.value)}
    //           />
    //           <div className="flex justify-center gap-2">
    //             <button
    //               className="bg-blue-500 text-white px-4 py-2 rounded"
    //               onClick={() => {
    //                 if (inputId.trim()) {
    //                   localStorage.setItem("studentId", inputId.trim());
    //                   setStudentId(inputId.trim());
    //                 }
    //               }}
    //             >
    //               ✅ Sử dụng mã này
    //             </button>
    //             <button
    //               className="bg-green-500 text-white px-4 py-2 rounded"
    //               onClick={() => {
    //                 const randomId = "KYC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    //                 localStorage.setItem("studentId", randomId);
    //                 setStudentId(randomId);
    //               }}
    //             >
    //               🎲 Tạo mã ngẫu nhiên
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   }
    //  <LoginScreen studentId={studentId} setStudentId={setStudentId} />;
    // if (!studentId) {
    //     return <LoginScreen studentId={studentId} setStudentId={setStudentId} />;
    // }
    return (
        <div className="relative">
            <div className="absolute top-4 right-4">
            <   AvatarMenu studentId={studentId} />
            </div>

            <div
                className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto text-gray-800"
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
                <h1 className="text-2xl font-bold text-center mb-4">📘 Hướng dẫn thực hiện Job KYC</h1>

                <div className="space-y-6">
                    {/* Bước 1 */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                        <h2 className="font-semibold mb-2">🔹 Bước 1: Nhấn "Nhận đơn"</h2>
                        <img src="/guide/step1.png" alt="Bước 1" className="rounded-lg border w-full" />
                        <p className="text-sm mt-2 text-gray-600">
                            Đơn sẽ cập nhật liên tục hàng ngày (nếu có).Bấm <strong>Nhận đơn</strong> sẽ được chuyển đến
                            trang xác minh danh tính(KYC).
                        </p>
                    </div>

                    {/* Bước 2 */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                        <h2 className="font-semibold mb-2">
                            🔹 Bước 2: Thực hiện KYC theo hướng dẫn bên <strong>ARGOS Identity</strong>
                        </h2>
                        {/* <img src="/guide/step2.png" alt="Bước 2" className="rounded-lg border w-full" /> */}
                        {/* <p className="text-sm mt-2 text-gray-600">Chụp ảnh giấy tờ, selfie và hoàn tất xác minh.</p> */}
                    </div>

                    {/* Bước 3 */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                        <h2 className="font-semibold mb-2">
                            🔹 Bước 3: Gửi ảnh xác nhận KYC kèm thông tin ngân hàng nhận tiền
                        </h2>
                        <img src="/guide/step3.jpg" alt="Bước 3" className="rounded-lg border w-full" />
                        <p className="text-sm mt-2 text-gray-600">
                            Chụp ảnh toàn màn hình thông báo "KYC is approved" cùng mã và bấm{" "}
                            <strong>Tôi đã hoàn tất</strong> góc trái màn hình để gửi ảnh thông tin xác minh.
                        </p>
                    </div>

                    {/* Cảnh báo */}
                    {/* <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg text-sm">
          ⚠️ <strong>Cảnh báo:</strong> Tuyệt đối KHÔNG làm theo link KYC lạ do người khác gửi. Chỉ sử dụng link trên hệ thống để đảm bảo an toàn.
        </div> */}
                    {/* Cảnh báo an toàn */}
                    <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl text-sm flex flex-col items-center">
                        {/* <img src="/guide/warning.png" alt="Cảnh báo" className="w-24 h-24 mb-2" /> */}
                        <p className="text-red-700 font-semibold text-center">
                            ⚠️ Chỉ nhận Job và thực hiện KYC trên hệ thống chính thức.
                        </p>
                        <p className="text-gray-700 text-center mt-2">
                            Đường link xác minh phải bắt đầu bằng: <br />
                            <span className="font-mono text-blue-700">
                                https://form.argosidentity.com/?pid=p4n42yhhy
                            </span>
                        </p>
                        <p className="text-red-600 text-center mt-2 font-medium">
                            Nếu bạn tự ý xác minh qua đường link lạ, bên mình sẽ <strong>không chịu trách nhiệm</strong>{" "}
                            về hậu quả xảy ra.
                        </p>
                    </div>

                    {/* Nút Nhận Job */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleStart}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition"
                        >
                            Nhận Job ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
