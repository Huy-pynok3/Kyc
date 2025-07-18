import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginScreen = ({ studentId, setStudentId }) => {
    const [inputId, setInputId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Kiểm tra studentId từ localStorage khi mount
    useEffect(() => {
        const storedId = localStorage.getItem("studentId");
        if (storedId && !studentId) {
            setStudentId(storedId);
        }
    }, [studentId, setStudentId]);

    const handleUseCode = () => {
        if (!inputId.trim()) {
            toast.error("Vui lòng nhập mã!", { autoClose: 2000 });
            return;
        }
        if (!inputId.match(/^KYC-[A-Z0-9]{6}$/)) {
            toast.error("Mã không đúng định dạng (KYC-XXXXXX) !", { autoClose: 2000 });
            return;
        }
        setIsLoading(true);
        localStorage.setItem("studentId", inputId.trim());
        setStudentId(inputId.trim());
        setInputId(""); // Xóa input sau khi đăng nhập
        toast.success("Đăng nhập thành công!", { autoClose: 2000 });
        setIsLoading(false);
    };

    const handleGenerateCode = () => {
        const newRandomId = "KYC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        setInputId(newRandomId);
        toast.success("Tạo mã mới thành công!", { autoClose: 2000 });
    };

    const handleCopyCode = () => {
        if (inputId.trim()) {
            navigator.clipboard.writeText(inputId);
            toast.success("Đã sao chép mã!", { autoClose: 2000 });
        } else {
            toast.error("Không có mã để sao chép!", { autoClose: 2000 });
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Đang đăng nhập...</div>;
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-gray-100"
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
            <div className="absolute top-4 right-4 w-48 h-48 sm:w-64 sm:h-64 bg-[url('https://msu.io/images/main/section_a/shooting_star.png')] bg-no-repeat bg-[top_50px_right_-10px] bg-[200px_auto] animate-pulse"></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md text-center space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Nhập hoặc tạo mã</h2>

                {/* Cảnh báo */}
                <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg text-sm text-yellow-800">
                    Hãy ghi nhớ mã để đăng nhập lần sau và xem lịch sử KYC của bạn!
                </div>

                <div className="relative">
                    <input
                        type="text"
                        className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mã (nếu đã có)"
                        value={inputId}
                        onChange={(e) => setInputId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUseCode()}
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800"
                        onClick={handleCopyCode}
                        aria-label="Sao chép mã"
                    >
                        📋
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition colors disabled:bg-blue-300"
                        onClick={handleUseCode}
                        disabled={!inputId.trim() || isLoading}
                    >
                        Đăng nhập
                    </button>
                    <button
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        onClick={handleGenerateCode}
                        disabled={isLoading}
                    >
                        Tạo mã mới
                    </button>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar
                closeOnClick
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default LoginScreen;

// import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // import { useNavigate } from "react-router-dom";
// // const navigate = useNavigate();
// const LoginScreen = () => {
//     const [inputId, setInputId] = useState("");
//     const [studentId, setStudentId] = useState(localStorage.getItem("studentId") || "");

//     const handleUseCode = () => {
//         if (inputId.trim()) {
//             localStorage.setItem("studentId", inputId.trim());
//             setStudentId(inputId.trim());
//             toast.success("Đăng nhập thành công!", { autoClose: 2000 });
//         } else {
//             toast.error("Vui lòng nhập mã!", { autoClose: 2000 });
//         }
//     };

//     const handleGenerateCode = () => {
//         const newRandomId = "KYC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
//         setInputId(newRandomId); // Cập nhật mã ngẫu nhiên vào input
//         toast.success("Tạo mã mới thành công!", { autoClose: 2000 });
//     };

//     const handleCopyCode = () => {
//         if (inputId.trim()) {
//             navigator.clipboard.writeText(inputId);
//             toast.success("Đã sao chép mã!", { autoClose: 2000 });
//         } else {
//             toast.error("Không có mã để sao chép!", { autoClose: 2000 });
//         }
//     };

//     if (!studentId) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-gray-100">
//                 <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md text-center space-y-6">
//                     <h2 className="text-2xl font-bold text-gray-800">🔐 Nhập hoặc tạo mã</h2>

//                     {/* Input cho mã */}
//                     <div className="relative">
//                         <input
//                             type="text"
//                             className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Nhập mã (nếu đã có)"
//                             value={inputId}
//                             onChange={(e) => setInputId(e.target.value)}
//                             onKeyDown={(e) => e.key === "Enter" && handleUseCode()}
//                         />
//                         <button
//                             className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-100 px-2 py-1 rounded text-blue-600 hover:bg-blue-200"
//                             onClick={handleCopyCode}
//                             aria-label="Sao chép mã"
//                         >
//                             📋
//                         </button>
//                     </div>

//                     {/* Các nút hành động */}
//                     <div className="flex flex-col sm:flex-row justify-center gap-3">
//                         <button
//                             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300"
//                             onClick={handleUseCode}
//                             disabled={!inputId.trim()}
//                         >
//                             Đăng nhập
//                         </button>
//                         <button
//                             className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
//                             onClick={handleGenerateCode}
//                         >
//                             Tạo mã mới
//                         </button>
//                     </div>
//                 </div>
//                 <ToastContainer
//                     position="top-center"
//                     autoClose={2000}
//                     hideProgressBar
//                     closeOnClick
//                     pauseOnHover
//                     theme="light"
//                 />
//             </div>
//         );
//     }

// };

// export default LoginScreen;
