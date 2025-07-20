
import { useState, useEffect } from "react";
import { fetchKycList, updateKycStatus, deleteKyc, manualApprove } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

export const useKyc = (token) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualWallet, setManualWallet] = useState("");
  const [rejectionModal, setRejectionModal] = useState({ show: false, wallet: "", reason: "" });
  const { handleLogout } = useAuth(); 

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await fetchKycList(token);
      setList(data);
    } catch (err) {

      if (err.message === "Session expired") {
        handleLogout(); // Gọi logout khi token hết hạn
      } else {
        alert(`Không thể tải danh sách KYC: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualApprove = async () => {
    if (!manualWallet) return alert("Nhập địa chỉ ví");
    try {
      const data = await manualApprove(token, manualWallet);
      alert(data.message);
      setManualWallet("");
    } catch (err) {
      alert(`Lỗi duyệt tay: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (wallet, status, reason = "") => {
    try {
      await updateKycStatus(token, wallet, status, reason);
      fetchList();
    } catch (err) {
      alert(`Lỗi cập nhật trạng thái: ${err.message}`);
    }
  };

  const handleDeleteKyc = async (wallet) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa yêu cầu KYC của ví ${wallet}?`)) return;
    try {
      await deleteKyc(token, wallet);
      fetchList();
    } catch (err) {
      alert(`Lỗi xóa KYC: ${err.message}`);
    }
  };

  const handleConfirmRejection = () => {
    const { wallet, reason } = rejectionModal;
    const trimmedReason = reason.trim() || "Lý do không xác định";
    handleUpdateStatus(wallet, "rejected", trimmedReason);
    setRejectionModal({ show: false, wallet: "", reason: "" });
  };

  useEffect(() => {
    if (token) fetchList();
  }, [token]);

  return {
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
  };
};