import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function KycReceivePage() {
    const { kycId } = useParams();
    const amount = 40000;
    const [kycInfo, setKycInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/info/${kycId}`,
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
            }
            
        ).then((res) => {
            setKycInfo(res.data);
        });
    }, [kycId]);

    // const handleStartKyc = async () => {
    //     console.log("Gửi KYC ID:", kycId);
    //     const startedAt = new Date().toISOString();
    //     try {
    //         const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/start/${kycId}`, {
    //             startedAt,
    //         }, {
    //             headers: {
    //                 Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
    //             },
    //         });

    //         if (res.data.success) {
    //             localStorage.removeItem("kycConfirmed");
    //             navigate(`/kyc-session/${kycId}`);
    //         } else {
    //             alert('Không thể nhận đơn. Có thể đã được người khác nhận.');
    //         }
    //     } catch (err) {
    //         // console.error(err);
    //         alert("Đã có người nhận đơn KYC này. Vui lòng thử lại sau.");
    //     }
    // };

    // time server
    const handleStartKyc = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/start/${kycId}`, null,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                    },
                }
            );
            if (res.data.success) {
                localStorage.removeItem("kycConfirmed");
                navigate(`/kyc-session/${kycId}`);
            } else {
                alert('Không thể nhận đơn. Có thể đã được người khác nhận.');
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi khi nhận đơn KYC.");
        }
    };
    

    if (!kycInfo) return <div className="p-4 text-center">Đang tải thông tin KYC...</div>;

    return (
        <div className="p-4 max-w-md mx-auto text-center">
            <h1 className="text-xl font-bold mb-2">📋 Tạo phiên KYC</h1>
            <p className="text-sm text-gray-600 mb-4">
                Vui lòng thực hiện KYC trên điện thoại để đảm bảo truy cập camera.
            </p>
            <div className="bg-white shadow rounded p-4 text-left text-sm">
                <p className=" break-all inline-block">
                    <b>👛 Địa chỉ ví:</b> {kycInfo.wallet.slice(0, 6)}...{kycInfo.wallet.slice(-4)}
                </p>

                <p className="text-sm text-gray-600">
                    <b>💸 Tiền công:</b> {amount.toLocaleString("vi-VN")} VND
                </p>

                <p className="text-sm text-gray-600 break-all inline-block">
                    <b>🔗 Maple Link:</b> {kycInfo.mapleLink.slice(0, 45)}...{kycInfo.mapleLink.slice(-40)}
                </p>

                <p className="text-sm text-gray-600">
                    <b>🕐 Trạng thái:</b>{" "}
                    <span className="font-semibold text-yellow-600">
                        {kycInfo.status === "pending" ? "Chờ xử lý" : kycInfo.status}
                    </span>
                </p>
               
            </div>
            <button
                onClick={() => handleStartKyc()}

                className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
            >
                Tôi sẵn sàng KYC
            </button>
        </div>
    );
}
