// src/components/Admin/KycTable.jsx
import React from "react";

export default function KycTable({ list, loading, handleUpdateStatus, handleDeleteKyc, setRejectionModal }) {
  if (loading) return <p className="text-center text-gray-600">⏳ Đang tải dữ liệu...</p>;
  if (list.length === 0) return <p className="text-center text-gray-600">📭 Chưa có yêu cầu KYC nào.</p>;

  return (
    <div className="w-full bg-white shadow rounded overflow-x-auto">
      {/* Bảng cho desktop (ẩn trên mobile) */}
      <table className="hidden md:table w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Ví</th>
            <th>Email</th>
            <th>Link Maple</th>
            <th>Trạng thái</th>
            <th>Gửi lúc</th>
            <th>Lý do từ chối</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.wallet} className="border-b hover:bg-gray-50">
              <td className="p-3 font-mono text-sm">{item.wallet}</td>
              <td className="p-3">{item.email || "-"}</td>
              <td className="p-3">
                <a href={item.mapleLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Xem
                </a>
              </td>
              <td className="p-3 capitalize">
                <span
                  className={
                    item.status === "approved"
                      ? "text-green-600"
                      : item.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {item.status}
                </span>
              </td>
              <td className="p-3 text-sm text-gray-600">{new Date(item.submittedAt).toLocaleString("vi-VN")}</td>
              <td className="p-3 text-sm text-gray-600">{item.status === "rejected" ? item.reason || "—" : "—"}</td>
              <td className="p-3 space-x-2 flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(item.wallet, "approved")}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Duyệt
                </button>
                <button
                  onClick={() => setRejectionModal({ show: true, wallet: item.wallet, reason: "" })}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => window.open(`https://bscscan.com/address/${item.wallet}`, "_blank")}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  BscScan
                </button>
                <button
                  onClick={() => handleDeleteKyc(item.wallet)}
                  className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                >
                  Cook
                </button>
                <button
                  onClick={() => handleUpdateStatus(item.wallet, "pending")}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                >
                  Đặt lại
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cards cho mobile */}
      <div className="md:hidden space-y-4">
        {list.map((item) => (
          <div key={item.wallet} className="bg-white p-4 rounded-lg shadow border">
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Ví:</span>
                <p className="font-mono text-sm break-all">{item.wallet}</p>
              </div>
              <div>
                <span className="font-semibold">Email:</span> {item.email || "-"}
              </div>
              <div>
                <span className="font-semibold">Link Maple:</span>{" "}
                <a href={item.mapleLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Xem
                </a>
              </div>
              <div>
                <span className="font-semibold">Trạng thái:</span>{" "}
                <span
                  className={
                    item.status === "approved"
                      ? "text-green-600"
                      : item.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {item.status}
                </span>
              </div>
              <div>
                <span className="font-semibold">Gửi lúc:</span>{" "}
                <span className="text-sm text-gray-600">{new Date(item.submittedAt).toLocaleString("vi-VN")}</span>
              </div>
              <div>
                <span className="font-semibold">Lý do từ chối:</span>{" "}
                <span className="text-sm text-gray-600">{item.status === "rejected" ? item.reason || "—" : "—"}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => handleUpdateStatus(item.wallet, "approved")}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Duyệt
                </button>
                <button
                  onClick={() => setRejectionModal({ show: true, wallet: item.wallet, reason: "" })}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => window.open(`https://bscscan.com/address/${item.wallet}`, "_blank")}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  BscScan
                </button>
                <button
                  onClick={() => handleDeleteKyc(item.wallet)}
                  className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                >
                  Cook
                </button>
                <button
                  onClick={() => handleUpdateStatus(item.wallet, "pending")}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}