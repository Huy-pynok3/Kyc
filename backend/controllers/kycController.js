import fs from "fs";
import path from "path";
const storePath = path.join(process.cwd(), "data", "kycStore.json");

function readStore() {
  if (!fs.existsSync(storePath)) return {};
  return JSON.parse(fs.readFileSync(storePath, "utf-8"));
}

function writeStore(data) {
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
}

export const submitKyc = (req, res) => {
  const { wallet, email, mapleLink, signature } = req.body;

  if (!wallet || !mapleLink || !signature) {
    return res.status(400).json({ error: "Thiếu dữ liệu cần thiết." });
  }

  const store = readStore();

  store[wallet.toLowerCase()] = {
    email,
    mapleLink,
    signature,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  writeStore(store);
  res.json({ message: "Đã lưu thông tin KYC." });
};

export const getKycStatus = (req, res) => {
  const { wallet } = req.params;
  const store = readStore();

  const data = store[wallet.toLowerCase()];
  if (!data) {
    return res.status(404).json({ status: "not_found" });
  }

  res.json({ 
    status: data.status,
    submittedAt: data.submittedAt,
    reason: data.reason || null, 
    processedAt: data.processedAt || null, 
    forceApproved: data.forceApproved || false,
  });
};


//Admin
export const getAllKyc = (req, res) => {
  try {
    console.log("🔥 getAllKyc was called");
    const store = readStore();
    const all = Object.entries(store).map(([wallet, data]) => ({ wallet, ...data }));
    res.json(all);
  } catch (error) {
    console.error("Error in getAllKyc:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// export const getAllKyc = (req, res) => {
//     console.log("🔥 getAllKyc was called");
//     const store = readStore();

//     const all = Object.entries(store).map(([wallet, data]) => ({ wallet, ...data }));
//     // res.setHeader("Content-Type", "application/json"); 
//     res.json(all);
//   };
// export const getAllKyc = (req, res) => {
//   try {
//     const store = readStore(); // object hoặc undefined
//     if (!store || typeof store !== "object") {
//       return res.status(200).json([]); // trả về JSON rỗng
//     }

//     const all = Object.entries(store).map(([wallet, data]) => ({ wallet, ...data }));
//     console.log("Dữ liệu trả về từ /api/kyc/all:", all);

//     res.status(200).json(all);
//   } catch (err) {
//     console.error("Lỗi khi đọc store:", err);
//     res.status(500).json({ error: "Không thể đọc dữ liệu KYC" });
//   }
// };

  // export const updateKycStatus = (req, res) => {
  //   const { wallet, status, reason  } = req.body;
  //   if (!wallet || !["approved", "rejected"].includes(status)) {
  //     return res.status(400).json({ error: "Yêu cầu không hợp lệ" });
  //   }
  
  //   const store = readStore();
  //   const entry = store[wallet.toLowerCase()];
  //   if (!entry) return res.status(404).json({ error: "Không tìm thấy ví này" });
  
  //   entry.status = status;
  //   writeStore(store);
  //   res.json({ message: `Đã cập nhật trạng thái KYC sang ${status}` });
  // };
  export const updateKycStatus = (req, res) => {
    const { wallet, status, reason } = req.body;
  
    // Kiểm tra đầu vào
    if (!wallet || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Yêu cầu không hợp lệ" });
    }

    const store = readStore();
    const entry = store[wallet.toLowerCase()];

    if (!entry) return res.status(404).json({ error: "Không tìm thấy ví này" });
  
    entry.status = status;
    entry.processedAt = new Date().toISOString();

    // Ghi thêm lý do nếu bị từ chối
    if (status === "rejected") {
      entry.reason = reason || "Không rõ lý do";
    } else {
      delete entry.reason; // Xóa lý do cũ nếu được duyệt
    }
  
    writeStore(store);
  
    res.json({
      message: `Đã cập nhật trạng thái KYC sang ${status}`,
      ...(status === "rejected" ? { reason } : {}),
    });
  };
  
  
  
// Get KYC status by wallet address customer
  export const getKycStatusByWallet = (req, res) => {
    const wallet = req.params.wallet?.toLowerCase();
    if (!wallet) return res.status(400).json({ error: "Thiếu địa chỉ ví" });
  
    const store = readStore();
    const entry = store[wallet];
  
    if (!entry) return res.status(404).json({ status: "not_found" });
  
    res.json({
      status: entry.status || "pending",
      email: entry.email || null,
      mapleLink: entry.mapleLink || null,
      submittedAt: entry.submittedAt || null,
    });
  };
  
  export const passAdminLogin = async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: "Mật khẩu là bắt buộc" });
      }
  
      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (!isMatch) {
        return res.status(401).json({ error: "Sai mật khẩu" });
      }
  
      // Tạo JWT
      const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ message: "Đăng nhập thành công", token });
    } catch (error) {
      console.error("Lỗi khi đăng nhập admin:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  };
  // app.post("/api/admin/login", async (req, res) => {
  //   try {
  //     const { password } = req.body;
  //     if (!password) {
  //       return res.status(400).json({ error: "Mật khẩu là bắt buộc" });
  //     }
  
  //     // So sánh mật khẩu
  //     const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  //     if (!isMatch) {
  //       return res.status(401).json({ error: "Sai mật khẩu" });
  //     }
  
  //     // Tạo JWT
  //     const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
  //     res.json({ message: "Đăng nhập thành công", token });
  //   } catch (error) {
  //     console.error("Lỗi khi đăng nhập admin:", error);
  //     res.status(500).json({ error: "Lỗi server" });
  //   }
  // });
