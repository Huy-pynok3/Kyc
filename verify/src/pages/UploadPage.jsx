import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function UploadPage() {
    const { kycId } = useParams();
    const [images, setImages] = useState([]);
    const [bankInfo, setBankInfo] = useState("");
    // const [studentId, setStudentId] = useState(localStorage.getItem("studentId") || "unknown");
    const [uploading, setUploading] = useState(false);
    const [kycSessionId, setKycSessionId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessionId = async () => {
          try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/session/${kycId}`);
            setKycSessionId(res.data.kycSessionId);
          } catch (err) {
            console.error("Không thể lấy session:", err.response?.data || err.message);
          }
        };
    
        if (kycId) {
          fetchSessionId();
        }
      }, [kycId]);

      
    useEffect(() => {
        if (!kycId) return;

        const interval = setInterval(() => {
            axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/kyc/sessions/ping`,
                {
                    kycId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                    },
                }
            );
        }, 20000); // Ping mỗi 20 giây

        return () => clearInterval(interval); // Xóa interval khi unmount
    }, [kycId]);

    useEffect(() => {
        const confirmed  = localStorage.getItem("kycConfirmed");

        // Nếu đã vào Upload mà chưa bấm xác nhận → redirect về
        if (!confirmed ) {
            alert("Vui lòng xác nhận KYC trước khi tải ảnh lên.");
            localStorage.removeItem("kycConfirmed");

            navigate("/"); // hoặc về trang đầu, hoặc thông báo
            return;
        }

        const handleBack = () => {
            alert("Bạn không thể quay lại trang này.Bạn đã xác nhận KYC rồi.");
            window.history.pushState(null, "", window.location.href);
        };


        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handleBack);

        return () => {
            window.removeEventListener("popstate", handleBack);
        };
    }, [navigate]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 4) {
            alert("Chỉ được tải tối đa 4 ảnh.");
            return;
        }

        setImages((prev) => [...prev, ...files]);
    };

    const handleSubmit = async () => {
        if (images.length === 0) {
            return alert("Vui lòng chọn ảnh KYC.");
        }
        if (!bankInfo) return alert("Vui lòng nhập thông tin ngân hàng.");

        const formData = new FormData();
        formData.append("kycId", kycId);
        // formData.append("studentId", studentId);
        formData.append("kycSessionId", kycSessionId); // Thêm sessionId
        formData.append("bankInfo", bankInfo);
        images.forEach((img, index) => {
            formData.append(`images`, img);
        });

        try {
            setUploading(true);
            // Gửi dữ liệu lên server
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/upload/${kycId}`, formData, {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
            });

            // await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/upload/${kycId}`, formData, {
            //   headers: { 'Content-Type': 'multipart/form-data' },
            // });

            alert("Gửi thành công!");
           localStorage.removeItem("kycConfirmed");
            navigate(`/kyc-status/${kycId}`, { replace: true });
        } catch (err) {
            alert("Gửi thất bại. Vui lòng thử lại sau.");
            console.error("Upload error:", err.response?.data || err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="p-4 max-w-sm mx-auto min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">📤 Gửi ảnh & STK ngân hàng</h1>

            <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    Chọn ảnh KYC thành công, có thể gửi qr ngân hàng vào đây (tối đa 4):
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full text-sm bg-white p-2 border rounded"
                />
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative">
                            <img
                                src={URL.createObjectURL(img)}
                                alt={`preview-${idx}`}
                                className="w-full h-20 object-cover rounded border"
                            />
                            <button
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                title="Xóa"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Thông tin ngân hàng:</label>
                <textarea
                    rows={4}
                    className="w-full text-sm p-3 rounded border bg-white"
                    placeholder="VD: MB Bank - 123456789"
                    value={bankInfo}
                    onChange={(e) => setBankInfo(e.target.value)}
                ></textarea>
            </div>

            <button
                onClick={handleSubmit}
                disabled={uploading}
                className={`w-full py-3 text-white rounded font-semibold transition ${
                    uploading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                }`}
            >
                {uploading ? "Đang gửi..." : "📨 Gửi thông tin"}
            </button>
        </div>
    );
}

// // pages/UploadPage.jsx
// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";

// export default function UploadPage() {
//     const { kycId } = useParams();
//     const [image, setImage] = useState(null);
//     const [bankInfo, setBankInfo] = useState("");
//     const [uploading, setUploading] = useState(false);

//     const handleSubmit = async () => {
//         if (!image || !bankInfo) return alert("❗ Vui lòng nhập đầy đủ thông tin.");

//         const formData = new FormData();
//         formData.append("kycId", kycId);
//         formData.append("image", image);
//         formData.append("bankInfo", bankInfo);

//         try {
//             setUploading(true);
//             await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/upload`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             alert("✅ Gửi thành công!");
//         } catch (err) {
//             alert("❌ Gửi thất bại. Vui lòng thử lại sau.");
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div className="p-4 max-w-sm mx-auto min-h-screen bg-white flex flex-col justify-center">
//             <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">📤 Tải ảnh & nhập STK</h1>

//             <div className="mb-4">
//                 <label className="block mb-2 text-sm font-medium text-gray-700">Ảnh xác minh:</label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setImage(e.target.files[0])}
//                     className="w-full text-sm bg-gray-100 p-2 rounded border"
//                 />
//                 {image && (
//                     <div className="mt-2">
//                         <img src={URL.createObjectURL(image)} alt="Preview" className="w-full rounded border" />
//                     </div>
//                 )}
//             </div>

//             <div className="mb-4">
//                 <label className="block mb-2 text-sm font-medium text-gray-700">Thông tin ngân hàng:</label>
//                 <textarea
//                     rows={4}
//                     className="w-full text-sm p-3 rounded border bg-gray-100"
//                     placeholder="VD: MB Bank - 123456789"
//                     value={bankInfo}
//                     onChange={(e) => setBankInfo(e.target.value)}
//                 ></textarea>
//             </div>

//             <button
//                 onClick={handleSubmit}
//                 disabled={uploading}
//                 className={`w-full py-3 text-white rounded font-semibold ${
//                     uploading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
//                 }`}
//             >
//                 {uploading ? "Đang gửi..." : "📨 Gửi thông tin"}
//             </button>
//         </div>
//     );
// }
