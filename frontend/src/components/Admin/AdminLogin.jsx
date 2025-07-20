import React from "react";

export default function AdminLogin({ password, setPassword, handleLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-center">Admin Login</h2>
        <input
          type="password"
          placeholder="Nhập mật khẩu admin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-4 py-2 w-full mb-4 rounded text-sm focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          onClick={handleLogin}
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full text-sm hover:bg-indigo-700"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}