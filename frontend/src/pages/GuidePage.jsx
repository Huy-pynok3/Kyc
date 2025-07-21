import { useNavigate } from "react-router-dom";
import img from "@/images"; // bạn đã import đúng ở đây
import { useState } from "react";
const preSteps = [
    {
        title: "Bạn chưa xác minh danh tính (KYC) trong MapleStory N",
        image: img.case1,
    },
    //   {
    //     title: "Trường hợp 2: Bạn đã từng tạo tài khoản nhưng chưa xác minh",
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
        title: "Bước 3: Quét mã QR",
        description: "Sau khi quét mã QR, bạn sẽ thấy link KYC. Hãy sao chép link này và dán vào form KYC.",
        image: img.step3,
    },
    {
        title: "Bước 4: Khi hoàn tất Verification lên level 1",
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
                    <button onClick={() => navigate("/")} className="text-blue-600 hover:underline">
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
                        //  className="bg-red-50 bg-opacity-90 border border-yellow-300 p-4 rounded-xl text-sm text-center"

                        >
                            <img
                                src={caseItem.image}
                                alt={caseItem.title}
                                className="w-full sm:w-64 rounded-md border cursor-pointer hover:opacity-80 transition"
                                onClick={() => setPreviewImage(caseItem.image)}
                            />

                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-red-600">{caseItem.title}</h3>
                            </div>
                        </div>
                    ))}
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
                    <button onClick={() => navigate("/")} className="text-blue-600 hover:underline">
                        ← Quay về trang chính
                    </button>
                </div>
            </div>
        </div>
    );
}
