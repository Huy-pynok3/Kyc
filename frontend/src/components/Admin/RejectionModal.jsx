import React from "react";

export default function RejectionModal({ rejectionModal, setRejectionModal, handleConfirmRejection }) {
  if (!rejectionModal.show) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg sm:max-w-md">
        <h3 className="text-xl font-semibold text-red-600 mb-4">❌ Từ chối KYC</h3>
        <p className="text-sm text-gray-800 mb-3">
          Ví: <span className="font-mono break-all">{rejectionModal.wallet}</span>
        </p>
        <textarea
          value={rejectionModal.reason}
          onChange={(e) => setRejectionModal((prev) => ({ ...prev, reason: e.target.value }))}
          className="border border-gray-300 w-full p-3 rounded-md h-28 mb-4 resize-none text-sm focus:outline-none focus:ring focus:border-blue-400"
          placeholder="Nhập lý do từ chối..."
        />
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => setRejectionModal({ show: false, wallet: "", reason: "" })}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400 w-full sm:w-auto"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirmRejection}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 w-full sm:w-auto"
          >
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
}