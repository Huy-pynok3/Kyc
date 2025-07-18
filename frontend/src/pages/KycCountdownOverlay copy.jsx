import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function KycCountdownOverlay({ studentId = 'unknown' }) {
  const { kycId } = useParams();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [doneClickedAt, setDoneClickedAt] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [kycSessionId, setKycSessionId] = useState('');
  const [startTime] = useState(Date.now());
  const emojis = ['🚀', '🦊', '🎯', '🔥', '🌟', '🍀'];
  const [emoji] = useState(emojis[Math.floor(Math.random() * emojis.length)]);
  const [kycData, setKycData] = useState(null);

  useEffect(() => {
    // Lấy thông tin từ DB dựa trên kycId
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/info/${kycId}`).then(res => {
      setKycData(res.data);
    });
  }, [kycId]);

  // Generate session ID on mount
  useEffect(() => {
    if (!kycData) return;
    const id = 'KYC#' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setKycSessionId(id);

    // Send session start to backend
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/start`, {
      studentId,
      wallet: kycData.wallet,
      kycSessionId: id,
      startedAt: new Date().toISOString(),
      emoji,
    });
  }, [studentId, kycData, emoji]);

  // Countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDoneClick = () => {
    const clickedAt = Date.now();
    setDoneClickedAt(clickedAt);

    axios.post('/api/kyc/done', {
      studentId,
      wallet: kycData.wallet,
      kycSessionId,
      clickedDoneAt: new Date(clickedAt).toISOString(),
      isSuspicious: (clickedAt - startTime) < 120000,
    });
  };

  const handleConfirmClick = () => {
    setConfirmed(true);
    axios.post('/api/kyc/confirm', {
      studentId,
      wallet: kycData.wallet,
      kycSessionId,
      clickedConfirmedAt: new Date().toISOString(),
    });
  };

  if (!kycData) return <div className="p-4">Đang tải dữ liệu phiên KYC...</div>;

  return (
    <div className="relative">
      {/* Countdown Overlay */}
      <div className="fixed top-2 left-2 bg-white/80 p-2 rounded shadow text-xs z-50">
        <div className="font-semibold text-gray-700">
          ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} | {emoji}
        </div>
        <div>Mã: <strong>{kycSessionId}</strong></div>
        <div>Ví: {kycData.wallet.slice(0, 6)}...{kycData.wallet.slice(-4)}</div>

        {!doneClickedAt && (
          <button
            onClick={handleDoneClick}
            className="mt-2 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 w-full"
          >
            Tôi đã xong
          </button>
        )}

        {doneClickedAt && !confirmed && (
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
