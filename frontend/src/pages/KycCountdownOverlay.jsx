import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function KycCountdownOverlay({ studentId = 'unknown' }) {
  const { kycId } = useParams();
  const [timeLeft, setTimeLeft] = useState(300);
  const [confirmed, setConfirmed] = useState(false);
  const [kycSessionId, setKycSessionId] = useState('');
  const [kycData, setKycData] = useState(null);
  // const emojis = ['🚀', '🦊', '🎯', '🔥', '🌟', '🍀'];
  // const [emoji] = useState(emojis[Math.floor(Math.random() * emojis.length)]);
  const navigate = useNavigate();
  const [startedAt, setStartedAt] = useState(null); // dùng để tính countdown
  const [emoji, setEmoji] = useState(null);

  // Load KYC info
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/info/${kycId}`)
      .then(res => {
        setKycData(res.data);
      })
      .catch(() => {
        alert('Không thể tải dữ liệu KYC.');
      });
  }, [kycId]);


  useEffect(() => {
    const refreshSession = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/sessions/new`, {
          kycId: kycData._id,
          wallet: kycData.wallet,
          studentId,
        });
  
        const session = res.data.session;
        setEmoji(session.emoji);
        setKycSessionId(session.kycSessionId);
        setStartedAt(session.startedAt); // giữ thời gian đếm ngược
      } catch (err) {
        console.error("Không thể làm mới session:", err);
      }
    };
  
    if (kycData?._id && kycData.wallet) {
      refreshSession();
    }
  }, [kycData]);
  
  // Ping giữ session mỗi 10s
  useEffect(() => {
    if (!kycData?._id) return;

    const interval = setInterval(() => {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/sessions/ping`, {
        kycId: kycData._id,
      },{
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [kycData]);


  // Countdown sync theo thời gian thực từ startedAt
  useEffect(() => {
    if (!kycData?.startedAt) return;
    const startTime = new Date(kycData.startedAt).getTime();
    if (isNaN(startTime)) {
      console.error('LỖI: startedAt không hợp lệ:', kycData.startedAt);
      return;
    }
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, 60 - diff);
      setTimeLeft(remaining);

      if (remaining === 0) {
        // ✅ Hết thời gian: cập nhật status về pending và chuyển hướng
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/expire/${kycId}`, {
          kycId: kycData._id,
        });
        navigate("/order");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [kycData]);


  // Cancel nếu rời trang khi chưa xác nhận
  // useEffect(() => {
  //   return () => {
  //     if (!confirmed && kycId) {
  //       axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/cancel-session/${kycId}`);
  //     }
  //   };
  // }, [confirmed, kycId]);

  // const handleConfirmClick = () => {
  //   setConfirmed(true);
  //   axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/confirm`, {
  //     studentId,
  //     wallet: kycData.wallet,
  //     kycSessionId,
  //     emoji,
  //     clickedConfirmedAt: new Date().toISOString(),
  //   });
  //   navigate(`/upload/${kycId}`);
  // };
    const handleConfirmClick = async () => {
      setConfirmed(true);
    
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/kyc/confirm`,
          {
            studentId,
            wallet: kycData.wallet,
            kycSessionId,
            emoji,
            clickedConfirmedAt: new Date().toISOString(),
          }
        );
    
        if (response.data.success) {
          navigate(`/upload/${kycId}`);
        }
      } catch (err) {
        setConfirmed(false); // reset lại nút
    
        if (err.response?.data?.tooEarly) {
          const seconds = Math.floor(err.response.data.secondsPassed);
          alert(`⏳ Bạn đã bấm quá sớm! Hãy thực hiện đầy đủ bước KYC. Mới trôi qua ${seconds} giây.`);
        } else {
          alert('❌ Có lỗi xảy ra khi gửi xác nhận.');
        }
      }
    };
  
  if (!kycData) return <div className="p-4">Đang tải dữ liệu phiên KYC...</div>;

  return (
    <div className="relative">
      {/* Countdown Overlay */}
      <div className="fixed top-2 left-2 bg-white/80 p-2 rounded shadow text-xs z-50">
        <div className="font-semibold text-gray-700">
          ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} | {emoji}
        </div>
        {/* <div>Mã: <strong>{kycSessionId || 'Đang khởi tạo...'}</strong></div> */}
        <div>Mã: <strong>{kycSessionId ? kycSessionId : 'Đang khởi tạo...'}</strong></div>

        <div>Ví: {kycData.wallet.slice(0, 6)}...{kycData.wallet.slice(-4)}</div>

        {!confirmed && (
          <button
            onClick={handleConfirmClick}
            className="mt-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 w-full"
          >
            Tôi đã hoàn tất
          </button>
        )}

        {confirmed && (
          <div className="mt-1 text-green-600 font-semibold">✅ Đã gửi xác nhận!</div>
        )}
      </div>

      {/* KYC Form Iframe */}
      <iframe
        src={kycData.mapleLink}
        title="KYC Form"
        className="w-full h-[90vh] border rounded mt-4"
        allow="camera; microphone"
      ></iframe>
    </div>
  );
}
