import React, { useEffect, useState } from "react";

export default function AdminPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [password, setPassword] = useState("");

  // Thêm state cho nhập ví thủ công
  const [manualWallet, setManualWallet] = useState("");

  const handleManualApprove = async () => {
    if (!manualWallet) return alert("Nhập địa chỉ ví");

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/manual-approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ wallet: manualWallet }),
    });

    const json = await res.json();
    alert(json.message);
    setManualWallet("");
  };
  //end

  // Popup từ chối
  const [rejectionModal, setRejectionModal] = useState({
    show: false,
    wallet: "",
    reason: "",
  });
  //

  // const fetchKycList = async (authToken) => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/all`, {
  //       headers: { Authorization: authToken },
  //     });
  //     if (!res.ok || res.status === 204) {
  //       alert("Không có dữ liệu KYC.44");
  //       return;
  //     }
  //     const data = await res.json();
  //     console.log("Dữ liệu KYC:", data);
  //     setList(data);
  //   } catch (err) {
  //     alert("Không thể tải danh sách KYC.");
  //   }
  //   setLoading(false);
  // };

  

  // const handleLogin = () => {
  //   if (password === "123") {
  //     // đồng bộ với .env
  //     localStorage.setItem("adminToken", password);
  //     setToken(password);
  //     fetchKycList(password); // 👉 gọi sau khi token đã đúng
  //   } else {
  //     alert("Sai mật khẩu");
  //   }
  // };


  const handleLogin = async () => {
    try {
      console.log("Gửi yêu cầu đăng nhập:", { password });
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      console.log("Phản hồi đăng nhập:", { status: res.status, headers: res.headers.get("content-type") });
      if (!res.ok) {
        const err = await res.json();
        console.error("❌ Đăng nhập không OK:", res.status, err);
        alert(`Lỗi đăng nhập: ${err.error}`);
        return;
      }
  
      const data = await res.json();
      console.log("JWT nhận được:", data.token);
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      fetchKycList(data.token); // Gọi fetchKycList với JWT
      console.log("🔑 Đăng nhập thành công, token:", data.token);
    } catch (err) {
      console.error("Lỗi trong try-catch handleLogin:", err);
      alert("Không thể đăng nhập.");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setList([]);
  };

  const fetchKycList = async (authToken) => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/kyc/all`;
      console.log("🔑 Gửi auth token:", authToken);
      console.log("API URL:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          // Authorization: authToken ,
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("Response status:", res.status);
      console.log("Content-Type:", res.headers.get("content-type"));

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ res không OK:", {
        status: res.status,
        statusText: res.statusText,
        errorText: errorText.slice(0, 200), // Giới hạn để dễ đọc
      });
      alert(`Không lấy được dữ liệu KYC. Status: ${res.status}, Error: ${errorText.slice(0, 200)}`);
      return;
    }

      const data = await res.json();
      console.log("Dữ liệu KYC:", data);
      setList(data);
    } catch (error) {
      console.error("🚨 Lỗi trong fetchKycList:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      alert(`Không thể tải danh sách KYC: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (wallet, status, reason="") => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ wallet, status, reason }),
    });
    fetchKycList(token);
  };
  // Popup từ chối
  const confirmRejection = () => {
    const { wallet, reason } = rejectionModal;
    // if (!reason.trim()) {
    //   alert("Vui lòng nhập lý do từ chối");
    //   return;
    // }
    const trimmedReason = reason.trim() || "Lý do không xác định";
    updateStatus(wallet, "rejected", trimmedReason);
    setRejectionModal({ show: false, wallet: "", reason: "" });
  };
  //

  useEffect(() => {
    console.log("useEffect: Gọi fetchKycList với token:", token);
    if (token) fetchKycList(token);
  }, [token]);

  if (!token) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-4">🔐 Admin Login</h2>
            <input
              type="password"
              placeholder="Nhập mật khẩu admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full mb-4"
            />
            <button
              onClick={handleLogin}
              className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-4 mb-6 rounded shadow space-y-2">
        <h3 className="font-semibold">➕ Duyệt tay ví đã thanh toán</h3>
        <div className="flex gap-2">
          <input
            value={manualWallet}
            onChange={(e) => setManualWallet(e.target.value)}
            placeholder="Nhập ví cần duyệt tay"
            className="border px-3 py-1 rounded w-96"
          />
          <button
            onClick={handleManualApprove}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Duyệt tay
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">👨‍💼 Quản lý Yêu Cầu KYC</h2>
        <button
          onClick={handleLogout}
          className="bg-gray-600 text-white px-4 py-2 rounded text-sm"
        >
          Đăng xuất
        </button>
      </div>

      {loading ? (
        <p>⏳ Đang tải dữ liệu...</p>
      ) : list.length === 0 ? (
        <p>📭 Chưa có yêu cầu KYC nào.</p>
      ) : (
        <table className="w-full bg-white shadow rounded overflow-x-auto">
          <thead className="bg-gray-100 text-sm text-left">
            <tr>
              <th className="p-2">Ví</th>
              <th>Email</th>
              <th>Link Maple</th>
              <th>Trạng thái</th>
              <th>Gửi lúc</th>
              <th>Lý do từ chối</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {list.map((item) => (
              <tr key={item.wallet} className="border-b hover:bg-gray-50">
                <td className="p-2 font-mono text-xs">{item.wallet}</td>
                <td className="p-2">{item.email || "-"}</td>
                <td className="p-2">
                  <a
                    href={item.mapleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Xem
                  </a>
                </td>
                <td className="p-2 capitalize">
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

                  {/* {item.status === "rejected" && item.reason && (
                    <div className="text-xs text-gray-500 mt-1 italic">
                      {item.reason}

                    </div>
                  )} */}
                </td>
                <td className="p-2 text-xs text-gray-600">
                  {new Date(item.submittedAt).toLocaleString("vi-VN")}
                </td>

                <td className="p-2 text-sm text-gray-600">
                  {item.status === "rejected" ? item.reason || "—" : "—"}
                </td>

                <td className="p-2 space-x-2">
                  <button
                    onClick={() => updateStatus(item.wallet, "approved")}
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Duyệt
                  </button>
                  {/* <button
                    onClick={() => updateStatus(item.wallet, "rejected")}
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                  > */}
                  <button
                    onClick={() =>
                      setRejectionModal({
                        show: true,
                        wallet: item.wallet,
                        reason: "",
                      })
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                  >
                    Từ chối
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    {/* </div> */}

    {/* Modal từ chối */}
{/* Modal từ chối */}
{rejectionModal.show && (
  <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200">
      <h3 className="text-xl font-semibold text-red-600 mb-4">❌ Từ chối KYC</h3>
      <p className="text-sm text-gray-800 mb-2">
        Ví: <span className="font-mono">{rejectionModal.wallet}</span>
      </p>
      <textarea
        value={rejectionModal.reason}
        onChange={(e) =>
          setRejectionModal((prev) => ({
            ...prev,
            reason: e.target.value,
          }))
        }
        className="border border-gray-300 w-full p-3 rounded-md h-24 mb-4 resize-none focus:outline-none focus:ring focus:border-blue-400"
        placeholder="Nhập lý do từ chối..."
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={() =>
            setRejectionModal({ show: false, wallet: "", reason: "" })
          }
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Hủy
        </button>
        <button
          onClick={confirmRejection}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Từ chối
        </button>
      </div>
    </div>
  </div>
)}

  </div>
  );
}
