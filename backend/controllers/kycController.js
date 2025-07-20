import { Kyc, Payment, Session } from "../models/index.js";

export const submitKyc = async (req, res) => {
    const { wallet, email, mapleLink, signature } = req.body;

    if (!wallet || !mapleLink || !signature) {
        return res.status(400).json({ error: "Thiếu dữ liệu cần thiết." });
    }

    try {
        const existing = await Kyc.findOne({ wallet: wallet.toLowerCase() });
        if (existing) {
            return res.status(400).json({ error: "Ví đã gửi KYC rồi." });
        }

        await Kyc.create({
            wallet: wallet.toLowerCase(),
            email,
            mapleLink,
            signature,
        });

        res.json({ message: "Đã lưu thông tin KYC." });
    } catch (err) {
        console.error("Lỗi submitKyc:", err);
        res.status(500).json({ error: "Lỗi server." });
    }
};

export const getKycStatus = async (req, res) => {
    const { wallet } = req.params;

    try {
        const kyc = await Kyc.findOne({ wallet: wallet.toLowerCase() });
        if (!kyc) return res.status(404).json({ status: "not_found" });

        res.json({
            status: kyc.status,
            submittedAt: kyc.submittedAt,
            reason: kyc.reason || null,
            processedAt: kyc.processedAt || null,
            forceApproved: kyc.forceApproved || false,
        });
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi lấy trạng thái KYC." });
    }
};

//Admin
export const getAllKyc = async (req, res) => {
    try {
        const all = await Kyc.find().sort({ submittedAt: -1 });
        res.json(all);
    } catch (err) {
        res.status(500).json({ error: "Không thể lấy danh sách KYC." });
    }
};
// export const getAllKyc =  async (req, res) => {
//   try {
//     console.log("getAllKyc was called");
//     const store = readStore();
//     const all = Object.entries(store).map(([wallet, data]) => ({ wallet, ...data }));
//     if (!all || all.length === 0) {
//       console.error("Không có dữ liệu KYC nào trong store.");
//       return res.status(200).json([]); // Trả về mảng rỗng nếu không có dữ liệu
//     }
//     res.json(all);

//   } catch (error) {
//     console.error("Error in getAllKyc:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const updateKycStatus = async (req, res) => {
    const { wallet, status, reason } = req.body;
    // Kiem tra xem có địa chỉ ví và trạng thái hợp lệ không
    if (!wallet || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Yêu cầu không hợp lệ" });
    }

    try {
        const kyc = await Kyc.findOne({ wallet: wallet.toLowerCase() });
        if (!kyc) return res.status(404).json({ error: "Không tìm thấy ví này" });

        kyc.status = status;
        kyc.processedAt = new Date();
        kyc.reason = status === "rejected" ? reason || "Không rõ lý do" : null;

        await kyc.save();

        res.json({ message: `Đã cập nhật trạng thái KYC sang ${status}` });
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi cập nhật KYC." });
    }
};

export const deleteKyc = async (req, res) => {
    const { wallet } = req.body;

    if (!wallet) return res.status(400).json({ error: "Thiếu địa chỉ ví" });

    const walletLower = wallet.toLowerCase();

    try {
        await Kyc.deleteOne({ wallet: walletLower });

        await Payment.deleteMany({ from: walletLower });

        res.json({ message: `Đã xóa hoàn toàn KYC cho ví ${wallet}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi khi xóa KYC." });
    }
};

// API public lấy KYC theo ví
export const getKycStatusByWallet = async (req, res) => {
    const wallet = req.params.wallet?.toLowerCase();
    if (!wallet) return res.status(400).json({ error: "Thiếu địa chỉ ví" });

    try {
        const entry = await Kyc.findOne({ wallet });
        if (!entry) return res.status(404).json({ status: "not_found" });

        res.json({
            status: entry.status || "pending",
            email: entry.email || null,
            mapleLink: entry.mapleLink || null,
            submittedAt: entry.submittedAt || null,
        });
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi truy vấn KYC." });
    }
};

//   router.get("/sessions", auth, async (req, res) => {

//     const latestKyc = await Kyc.findOne({ status: "checking" }).sort({ startedAt: -1 });
//     if (!latestKyc) {
//         return res.status(404).json({ error: "Không có phiên KYC nào đang checking" });
//     }
//     const sessions = await Session.find({ kycId: latestKyc._id }).sort({ startedAt: -1 });
//     res.json(sessions);
// });

export const getKycSessions = async (req, res) => {
    try {
        // console.log("Đang xử lý getKycSessions, user:", req.user);
        const latestKyc = await Kyc.findOne({ status: "checking" }).sort({ startedAt: -1 });
        // console.log("Kyc checking mới nhất:", latestKyc);
        if (!latestKyc) {
            return res.status(404).json({ error: "Không có phiên KYC nào đang checking" });
        }
        const sessions = await Session.find({ kycId: latestKyc._id }).sort({ startedAt: -1 });
        res.json(sessions);
    } catch (err) {
        console.error("Lỗi khi lấy phiên KYC:", err);
        res.status(500).json({ error: "Lỗi server." });
    }
};

export const updateSessionStatus = async (req, res) => {
    const { kycId, status, adminNote } = req.body;

    // Xác thực đầu vào
    if (!kycId || !["checking", "paid", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Thiếu hoặc trạng thái không hợp lệ" });
    }

    try {
        const session = await Session.findOne({ kycId });
        const kyc = await Kyc.findOne({ _id: kycId });

        if (!kyc) {
            return res.status(404).json({ error: "Không tìm thấy KYC" });
        }
        if (!session) {
            return res.status(404).json({ error: "Không tìm thấy phiên session" });
        }

        session.status = status;

        if (status === "paid") {
            session.paidAt = new Date();
            session.adminNote = ""; 
            kyc.status = "approved";
        }

        if (status === "rejected") {
            session.adminNote = adminNote || "";
            session.paidAt = undefined; 
            kyc.status = "pending"; 
        }

        await session.save();
        await kyc.save();

        res.json({ message: "Cập nhật thành công", session });
    } catch (err) {
        console.error("[Admin Update Session]", err);
        res.status(500).json({ error: "Lỗi server" });
    }
};
