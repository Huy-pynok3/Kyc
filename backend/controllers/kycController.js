import { Kyc, Payment, Session, History } from "../models/index.js";

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

//Admin
export const getAllKyc = async (req, res) => {
    try {
        const all = await Kyc.find().sort({ submittedAt: -1 });
        res.json(all);
    } catch (err) {
        res.status(500).json({ error: "Không thể lấy danh sách KYC." });
    }
};

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

export const getKycSessions = async (req, res) => {
    try {
      const checkingKycs = await Kyc.find({ status: "checking" });
      const  kycIds = checkingKycs.map(kyc => kyc._id);
      if (!kycIds || kycIds.length === 0) {
        return res.status(404).json({ error: "Không có phiên KYC nào đang checking" });
      }
     const sessions = await Session.find({ kycId: { $in: kycIds } }).sort({ imageUploadedAt: 1 });
      res.json(sessions);
    } catch (err) {
      console.error("[ADMIN PENDING ERROR]", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
  };

export const updateSessionStatus = async (req, res) => {
    const { kycId, status, adminNote } = req.body;

    if (!kycId || !["checking", "paid", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Thiếu hoặc trạng thái không hợp lệ" });
    }

    try {
        const session = await Session.findOne({ kycId });
        const kyc = await Kyc.findById(kycId);

        if (!kyc || !session) {
            return res.status(404).json({ error: "Không tìm thấy KYC hoặc session" });
        }

        if (status === "paid") {
            session.status = "paid";
            session.paidAt = new Date();
            session.adminNote = "";
            kyc.status = "approved";

            await session.save();
            await kyc.save();

            return res.json({ message: "Cập nhật thành công", session });
        }

        if (status === "rejected") {
            // Lưu vào bảng History trước khi xóa
            const historyData = {
                ...session.toObject(), // clone mọi trường
                status: "rejected",
                adminNote: adminNote || "",
                archivedAt: new Date(), // thời điểm lưu lịch sử
                _id: undefined, // tránh trùng _id
            };

            await History.create(historyData); // lưu vào bảng History

            await Session.deleteOne({ _id: session._id }); // xóa session

            kyc.status = "pending"; // nếu cần reset lại KYC
            await kyc.save();

            return res.json({ message: "Từ chối và lưu lịch sử thành công" });
        }

    } catch (err) {
        console.error("[Admin Update Session]", err);
        return res.status(500).json({ error: "Lỗi server" });
    }
};
