import React from "react";

export default function ManualApprove({ manualWallet, setManualWallet, handleManualApprove }) {
  return (
    <div className="bg-white p-4 mb-6 rounded shadow space-y-2">
      <h3 className="font-semibold text-lg">➕ Duyệt tay ví đã thanh toán</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={manualWallet}
          onChange={(e) => setManualWallet(e.target.value)}
          placeholder="Nhập ví cần duyệt tay"
          className="border px-4 py-2 rounded w-full text-sm focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          onClick={handleManualApprove}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 w-full sm:w-auto"
        >
          Duyệt tay
        </button>
      </div>
    </div>
  );
}