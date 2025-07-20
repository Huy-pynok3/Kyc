import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export default function KycAvailablePage() {
    const [kycList, setKycList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const amount = 40000;
    useEffect(() => {
        console.log("useEffect chạy");
        setIsLoading(true);
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/available`, {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
            })
            .then((res) => {
                setKycList(res.data);
                setIsLoading(false);
            });
    }, []);

    const handleClick = async (id) => {
        try {
            navigate(`/kyc/${id}`);
        } catch {
            alert("Lỗi khi nhận đơn.");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-blue-700 mb-6">📋 Đơn KYC chờ xử lý</h1>

            {isLoading ? (
                // <p className="text-gray-500">Đang tải đơn...</p>
                <div className="flex justify-center">
                    <ClipLoader color="#2563eb" size={40} />
                </div>
            ) : kycList.length === 0 ? (
                <p className="text-gray-500">Hiện không có đơn nào.</p>
            ) : (
                <ul className="space-y-4">
                    {kycList.map((kyc) => (
                        <li
                            key={kyc._id}
                            className="bg-white rounded-2xl shadow-md px-4 py-3 text-left border border-gray-100"
                        >
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">
                                    <b>👛 Ví:</b> {kyc.wallet.slice(0, 6)}...{kyc.wallet.slice(-4)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <b>💸 Tiền công:</b> {amount.toLocaleString("vi-VN")} VND
                                </p>

                                <p className="text-sm text-gray-600 break-all inline-block">
                                    <b>🔗 Maple Link:</b> {kyc.mapleLink.slice(0, 45)}...{kyc.mapleLink.slice(-40)}
                                </p>

                                <p className="text-sm text-gray-600">
                                    <b>🕐 Trạng thái:</b>{" "}
                                    <span className="font-semibold text-yellow-600">
                                        {kyc.status === "pending" ? "Chờ xử lý" : kyc.status}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    <b>📅 Gửi lúc:</b> {new Date(kyc.submittedAt).toLocaleString("vi-VN")}
                                </p>
                            </div>

                            <button
                                onClick={() => handleClick(kyc._id)}
                                className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                            >
                                Nhận đơn
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
