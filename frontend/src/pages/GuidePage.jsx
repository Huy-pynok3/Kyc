import { useNavigate } from "react-router-dom";
import img from "@/images"; 
import { useState } from "react";
const preSteps = [
    {
        title: "Bạn chưa xác minh danh tính (KYC) trong MapleStory N",
        image: img.case1,
        description: "Để chơi MapleStory N có 2 cách:\n1. Hold 10 NXPC = gần 300k trong ví chỉ để được vào game – và không được dùng tiền đó. \n2. Giải pháp tiết kiệm hơn bên mình sẽ KYC hộ bạn qua link.",
    },
    //   {
    //     title: "Để chơi MapleStory N.Có 2 cách",
    //     image: img.case2,
    //   },
];

const steps = [
    {
        title: "Bước 1: Chọn avatar và click Verification",
        image: img.step1,
    },
    {
        title: "Bước 2: Chọn Proceed",
        image: img.step2,
    },
    {
        title: "Bước 3.1: Quét mã QR",
        description: "Sau khi quét mã QR, bạn sẽ thấy link KYC. Hãy sao chép link dạng https://form.argosidentity.com/?pid=p4n42yhhy1&... và dán vào form KYC bên mình",
        image: img.step3,
    },
    {
        title: "Bước 3.2: Hoặc bạn có thể upload QR",
        description: "Nếu bạn không thể quét mã QR, hãy tải ảnh mã QR lên và hệ thống sẽ tự giải mã QR và tự động điền link cho bạn.Để chính xác bạn hãy cắt QR gọn nhất có thể.",
        image: img.step6,
    },
    {
        title: "Bước 4: Bên mình sẽ thực hiện KYC cho bạn",
        image: img.step5,
    },
    {
        title: "Bước 5: Khi hoàn tất Verification lên level 1",
        image: img.step4,
    },
];

export default function GuidePage() {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-center text-indigo-700">Hướng dẫn thực hiện KYC</h1>

                <div className="mt-6 text-center">
                    <button onClick={() => navigate("/maplestory")} className="text-blue-600 hover:underline">
                        ← Quay về trang chính
                    </button>
                </div>

                {/* Section các trường hợp */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-red-600 text-center">
                        Nếu bạn đang gặp vấn đề như này
                    </h2>

                    {preSteps.map((caseItem, idx) => (
                        <div
                            key={idx}
                            className="bg-red-50 rounded-xl border-red-300 shadow p-4 flex flex-col sm:flex-row items-center gap-4"

                        >
                            <img
                                src={caseItem.image}
                                alt={caseItem.title}
                                className="w-full sm:w-64 rounded-md border cursor-pointer hover:opacity-80 transition"
                                onClick={() => setPreviewImage(caseItem.image)}
                            />

                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-red-600 ">{caseItem.title}</h3>
                                {caseItem.description && (
                                    <p className="text-red-600 text-lg mt-1 whitespace-pre-line">{caseItem.description}</p>
                                )}
                            </div>
                            {/* <p className="text-gray-600 text-sm mt-1">{caseItem.description}</p> */}
                        </div>
                    ))}

                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
                        <p className="font-semibold">⚠️ Cảnh báo lừa đảo:</p>
                        <p>Cẩn thận các nhóm ảo, cá nhân, "hướng dẫn newbie" nhưng lại bày chiêu trò “không cần KYC vẫn chơi được” – dễ dính scam! Ví Metamask không đổi được 12 ký tự, private key nó là duy nhất lộ là coi như mất. Hãy chỉ làm KYC từ nguồn tin cậy!</p>
                    </div>
                </div>

                {/* Section hướng dẫn các bước */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-indigo-600 text-center">Các bước thực hiện</h2>
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row items-center gap-4"
                        >
                            {/* <img src={step.image} alt={step.title} className="w-full sm:w-64 rounded-md border" /> */}
                            <img
                                src={step.image}
                                alt={step.title}
                                className="w-full sm:w-64 rounded-md border cursor-pointer hover:opacity-80 transition"
                                onClick={() => setPreviewImage(step.image)}
                            />

                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-indigo-600">{step.title}</h3>
                                {step.description && <p className="text-gray-600 text-sm mt-1">{step.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Preview image modal */}
                {previewImage && (
                    <div
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
                        onClick={() => setPreviewImage(null)}
                    >
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
                        />
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button onClick={() => navigate("/maplestory")} className="text-blue-600 hover:underline">
                        ← Quay về trang chính
                    </button>
                </div>
            </div>
        </div>
    );
}
