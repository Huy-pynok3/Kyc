import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function KycCountdownOverlay({ studentId = 'unknown' }) {
  const { kycId } = useParams();
  const [timeLeft, setTimeLeft] = useState(300);
  const [confirmed, setConfirmed] = useState(false);
  const [kycSessionId, setKycSessionId] = useState('');
  const [kycData, setKycData] = useState(null);
  const emojis = ['🚀', '🦊', '🎯', '🔥', '🌟', '🍀'];
  const [emoji] = useState(emojis[Math.floor(Math.random() * emojis.length)]);
  const navigate = useNavigate();

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
    if (!kycData?.startedAt || !studentId) return;
  
    const id = 'KYC#' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setKycSessionId(id);
  
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/sessions/new`, {
      studentId,
      wallet: kycData.wallet,
      kycId: kycData._id,
      kycSessionId: id,
      startedAt: kycData.startedAt, // ✅ LẤY TỪ BẢNG KYC
      emoji,
    });
  }, [studentId, kycData?.startedAt, emoji]);
  

  // Countdown sync theo thời gian thực từ startedAt
  useEffect(() => {
    if (!kycData?.startedAt) return;
    const startTime = new Date(kycData.startedAt).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, 300 - diff);
      setTimeLeft(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [kycData]);

  const handleConfirmClick = () => {
    setConfirmed(true);
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/confirm`, {
      studentId,
      wallet: kycData.wallet,
      kycSessionId,
      emoji,
      clickedConfirmedAt: new Date().toISOString(),
    });
    navigate(`/upload/${kycId}`);
  };

  if (!kycData) return <div className="p-4">Đang tải dữ liệu phiên KYC...</div>;

  return (
    <div className="relative">
      {/* Countdown Overlay */}
      <div className="fixed top-2 left-2 bg-white/80 p-2 rounded shadow text-xs z-50">
        <div className="font-semibold text-gray-700">
          ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} | {emoji}
        </div>
        <div>Mã: <strong>{kycSessionId || 'Đang khởi tạo...'}</strong></div>
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
