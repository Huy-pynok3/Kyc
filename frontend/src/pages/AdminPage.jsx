// import {
//     AdminHeader,
//     AdminLogin,
//     ManualApprove,
//     KycTable,
//     RejectionModal,
//     AdminSessionCard,
//     UploadedImagesViewer }

// from "@/components/Admin";

// import { useAuth } from "../hooks/useAuth";
// import { useKyc } from "../hooks/useKyc";
// import { useSessions } from "../hooks/useSessions";

// export default function AdminPage() {
//   const { token, password, setPassword, handleLogin, handleLogout } = useAuth();
//   const {
//     list,
//     loading,
//     manualWallet,
//     setManualWallet,
//     rejectionModal,
//     setRejectionModal,
//     handleManualApprove,
//     handleUpdateStatus,
//     handleDeleteKyc,
//     handleConfirmRejection,
//   } = useKyc(token);
//   const { sessions } = useSessions();

//   if (!token) {
//     return <AdminLogin password={password} setPassword={setPassword} handleLogin={handleLogin} />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       <AdminHeader handleLogout={handleLogout} />
//       <ManualApprove
//         manualWallet={manualWallet}
//         setManualWallet={setManualWallet}
//         handleManualApprove={handleManualApprove}
//       />
//       <KycTable
//         list={list}
//         loading={loading}
//         handleUpdateStatus={handleUpdateStatus}
//         handleDeleteKyc={handleDeleteKyc}
//         setRejectionModal={setRejectionModal}
//       />
//       <div className="bg-gray-100 p-4 mt-6 rounded">
//         <h1 className="text-lg sm:text-xl font-bold mb-4 text-center">🧾 Danh sách phiên KYC</h1>
//         <div className="space-y-4">
//           {sessions.map((session) => (
//             <AdminSessionCard key={session._id} session={session} />
//           ))}
//         </div>
//       </div>
//       <RejectionModal
//         rejectionModal={rejectionModal}
//         setRejectionModal={setRejectionModal}
//         handleConfirmRejection={handleConfirmRejection}
//       />
//     </div>
//   );
// }

// src/pages/AdminPage.jsx
import React, { useState } from "react";
import {
    AdminHeader,
    AdminLogin,
    ManualApprove,
    KycTable,
    RejectionModal,
    AdminSessionCard,
    // UploadedImagesViewer,
} from "@/components/Admin";
import { useAuth } from "../hooks/useAuth";
import { useKyc } from "../hooks/useKyc";
import { useSessions } from "../hooks/useSessions";

export default function AdminPage() {
    const { token, password, setPassword, handleLogin, handleLogout } = useAuth();
    const {
        list,
        loading,
        manualWallet,
        setManualWallet,
        rejectionModal,
        setRejectionModal,
        handleManualApprove,
        handleUpdateStatus,
        handleDeleteKyc,
        handleConfirmRejection,
    } = useKyc(token);
    const { sessions } = useSessions();
    const [activeTab, setActiveTab] = useState("sessions"); // Quản lý tab hiện tại

    if (!token) {
        return <AdminLogin password={password} setPassword={setPassword} handleLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <AdminHeader handleLogout={handleLogout} />
            <ManualApprove
                manualWallet={manualWallet}
                setManualWallet={setManualWallet}
                handleManualApprove={handleManualApprove}
            />
            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`flex-1 py-2 px-4 text-center text-sm font-semibold ${
                        activeTab === "kyc" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                    } rounded-tl-md`}
                    onClick={() => setActiveTab("kyc")}
                >
                    Yêu cầu KYC
                </button>
                <button
                    className={`flex-1 py-2 px-4 text-center text-sm font-semibold ${
                        activeTab === "sessions" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                    } rounded-tr-md`}
                    onClick={() => setActiveTab("sessions")}
                >
                    Phiên KYC
                </button>
            </div>
            {/* Nội dung tab */}
            {activeTab === "kyc" && (
                <KycTable
                    list={list}
                    loading={loading}
                    handleUpdateStatus={handleUpdateStatus}
                    handleDeleteKyc={handleDeleteKyc}
                    setRejectionModal={setRejectionModal}
                />
            )}
            {activeTab === "sessions" && (
                <div className="bg-gray-100 p-4 rounded">
                    <h1 className="text-lg sm:text-xl font-bold mb-4 text-center">🧾 Danh sách phiên KYC</h1>
                    <div className="space-y-4">
                        {sessions.length === 0 ? (
                            <p className="text-center text-gray-600">📭 Chưa có phiên KYC nào.</p>
                        ) : (
                            sessions.map((session) => <AdminSessionCard key={session._id} session={session} />)
                        )}
                    </div>
                </div>
            )}
            <RejectionModal
                rejectionModal={rejectionModal}
                setRejectionModal={setRejectionModal}
                handleConfirmRejection={handleConfirmRejection}
            />
        </div>
    );
}
