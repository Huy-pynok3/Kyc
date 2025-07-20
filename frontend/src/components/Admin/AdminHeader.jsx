import React from "react";

export default function AdminHeader({ handleLogout }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">👨‍💼 Panel KYC</h2>
      <button onClick={handleLogout} className="bg-gray-600 text-white px-4 py-2 rounded text-sm">
        Đăng xuất
      </button>
    </div>
  );
}