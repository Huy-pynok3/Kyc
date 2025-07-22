import express from "express";
import mongoose from "mongoose";
import { Kyc, Session, History } from "../models/index.js";
import upload from "../middlewares/upload.js";
import verifyToken from '../middlewares/authToken.js';
import auth from '../middlewares/auth.js';
import { sendTelegramAlert } from "../services/telegramCheck.js"; 

const router = express.Router();

router.get("/info/:id", verifyToken, async (req, res) => {
    try {
        const kyc = await Kyc.findById(req.params.id);
        if (!kyc) return res.status(404).json({ error: "KYC không tồn tại" });

        res.json({
            _id: kyc._id,
            wallet: kyc.wallet,
            mapleLink: kyc.mapleLink,
            status: kyc.status,
            email: kyc.email || "",
            startedAt: kyc.startedAt || null,
        });
    } catch (err) {
        console.error("Lỗi khi lấy thông tin KYC:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});

router.get("/available", verifyToken, async (req, res) => {
    const availableKyc = await Kyc.find({ status: "pending" }).limit(20);
    res.json(availableKyc);
    console.log("Đã gửi danh sách KYC đang chờ");
    console.log("Số lượng KYC đang chờ:", availableKyc.length);
});

// router.post("/start/:id",verifyToken, async (req, res) => {
//     try {
//         const { id } = req.params;
//         // console.log("Bắt đầu phiên KYC cho ID:", typeof id);
//         // console.log("Objectid:", mongoose.Types.ObjectId.isValid(id));
//         // const { startedAt } = req.body;
//         // console.log("STARTED AT RECEIVED:", startedAt);
//         // console.log("Type:", typeof startedAt); // kiểm tra nếu là string

//         // const kyc = await Kyc.findOneAndUpdate(
//         //     { _id: id, status: "pending" },
//         //     { status: "processing", startedAt: new Date(startedAt) },
//         //     { new: true }
//         // );

//         // Kiểm tra định dạng startedAt
//         const parsedStartedAt = new Date(startedAt);
//         if (isNaN(parsedStartedAt)) {
//             console.error("Invalid startedAt date:", startedAt);
//             return res.status(400).json({ error: "Invalid startedAt date format" });
//         }

//         const kyc = await Kyc.findById(id);

//         if (!kyc || kyc.status !== "pending") {
//             return res.status(400).json({ error: "Đơn đã được xử lý hoặc không tồn tại" });
//         }
//         kyc.status = "processing";
//         kyc.startedAt = parsedStartedAt;
//         console.log("KYC trước khi lưu:", kyc);

//         try {
//             await kyc.save();
//             // Kiểm tra document từ MongoDB sau khi lưu
//             // await Kyc.findById(id);
//             // console.log("KYC sau khi lưu (từ MongoDB):", savedKyc.toObject());
//             res.json({ success: true });
//         } catch (saveError) {
//             console.error("Lỗi khi lưu KYC:", saveError);
//             return res.status(500).json({ error: "Lỗi khi lưu KYC", details: saveError.message });
//         }
//     } catch (err) {
//         console.error("Lỗi chi tiết khi xử lý KYC:", err);
//         res.status(500).json({ error: "Lỗi server", details: err.message });
//     }
// });
router.post("/start/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Bắt đầu phiên KYC cho ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID không hợp lệ" });
        }

        const kyc = await Kyc.findById(id);

        if (!kyc || kyc.status !== "pending") {
            return res.status(400).json({ error: "Đơn đã được xử lý hoặc không tồn tại" });
        }

        // Lấy thời gian bắt đầu từ hệ thống server
        const startedAt = new Date();

        kyc.status = "processing";
        kyc.startedAt = startedAt;

        await kyc.save();

        console.log("Đã cập nhật startedAt:", startedAt.toISOString());

        res.json({ success: true });
    } catch (err) {
        console.error("Lỗi chi tiết khi xử lý KYC:", err);
        res.status(500).json({ error: "Lỗi server", details: err.message });
    }
});



router.post("/sessions/new", verifyToken, async (req, res) => {
    const { kycId, wallet, studentId } = req.body;

    if (!kycId || !wallet) {
        return res.status(400).json({ error: "Thiếu thông tin" });
    }

    try {
        const emojiList = ["🔥", "🚀", "🌈", "🎯", "💎", "🦄", "🌟", "🍀"];
        const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        const randomSessionId = "KYC#" + Math.random().toString(36).substring(2, 8).toUpperCase();


        // Cập nhật session hiện tại nếu có, hoặc tạo mới nếu chưa
        let session = await Session.findOneAndUpdate(
            { kycId }, // mỗi KYC chỉ 1 session
            {
                $set: {
                    emoji: randomEmoji,
                    kycSessionId: randomSessionId,
                    studentId,
                    wallet,
                    // lastPing: new Date(), // cập nhật thời gian ping
                },
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        // Nếu session mới tạo mà chưa có startedAt → lấy từ bảng kyc
        // if (!session.startedAt) {
        //     const kyc = await Kyc.findById(kycId);
        //     if (kyc?.startedAt) {
        //         session.startedAt = kyc.startedAt;
        //         await session.save();
        //     }
        // }

        // Luôn đồng bộ startedAt từ Kyc sang Session (ghi đè)
        const kyc = await Kyc.findById(kycId);
        if (kyc?.startedAt) {
            session.startedAt = kyc.startedAt;
            await session.save();
        }

        res.json({ session });
    } catch (err) {
        console.error("Lỗi refresh session:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// Ping giữ phiên
router.post("/sessions/ping", verifyToken, async (req, res) => {
    const { kycId } = req.body;
    if (!kycId) return res.status(400).json({ error: "Thiếu kycId" });

    await Session.updateOne({ kycId }, { $set: { lastPingAt: new Date() } });
    res.json({ success: true });
});

router.post("/expire/:id", verifyToken, async (req, res) => {
    try {
        const kyc = await Kyc.findOneAndUpdate(
            { _id: req.params.id, status: "processing" },
            { status: "pending", startedAt: null },
            { new: true }
        );

        if (!kyc) {
            return res.status(400).json({ error: "Không thể cập nhật đơn" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Lỗi expire-session:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// export const confirmKycSession = async (req, res) => {
router.post("/confirm", verifyToken, async (req, res) => {
    const { studentId, wallet, kycSessionId, emoji, clickedConfirmedAt } = req.body;

    try {
        // 🔍 Tìm bản ghi KYC có sessionId
        const kyc = await Kyc.findOne({ wallet });

        if (!kyc) {
            return res.status(404).json({ error: "KYC session không tồn tại" });
        }

        // const clickedTime = new Date(clickedConfirmedAt);
        const clickedTime = new Date();
        const startedTime = new Date(kyc.startedAt); // 🔑 Lấy từ bảng KYC

        const secondsSinceStart = (clickedTime - startedTime) / 1000;
        console.log("Thời gian đã trôi qua (giây):", secondsSinceStart);
        // Nếu người dùng bấm xác nhận quá sớm (VD < 60 giây)
        if (secondsSinceStart < 60) {
            return res.status(400).json({
                error: "Bạn đã xác nhận quá sớm. Vui lòng hoàn tất KYC trước khi xác nhận.",
                tooEarly: true,
                secondsPassed: secondsSinceStart,
            });
        }

        // ✅ Cập nhật thông tin xác nhận
        const session = await Session.findOneAndUpdate(
            { kycId: kyc._id, wallet },
            {
                clickedConfirmedAt: clickedTime,
                // studentId,
                // emoji,
            },
            { new: true }
        );
        if (!session) {
            return res.status(404).json({ error: "Session không tồn tại" });
        }
        // kyc.confirmedAt = clickedTime;
        // kyc.studentId = studentId;
        // kyc.emoji = emoji;
        // await kyc.save();

        res.json({ success: true, message: "Xác nhận hoàn tất!" });
    } catch (err) {
        console.error("Lỗi xác nhận:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// const upload = multer({ dest: "uploads/" });
// router.post('/upload/:id', upload.single('image'), async (req, res) => {
// router.post("/upload/:id", upload.array("images", 4), async (req, res) => {
//     try {
//         const { kycId, bankInfo } = req.body;
//         // const imagePath = req.file?.path;
//         console.log('[UPLOAD] BODY:', req.body);
//         console.log('[UPLOAD] FILES:', images);
//         const images = req.files;

//         if (!kycId || !bankInfo || !images || images.length === 0) {
//             return res.status(400).json({ error: "Thiếu dữ liệu" });
//         }
//         const imagePaths = images.map((img) => img.path);
//         // Lưu vào MongoDB (giả định bạn có model KycSession)
//         await Session.findByIdAndUpdate(kycId, {
//             bankInfo,
//             uploadedImage: imagePaths,
//             imageUploadedAt: new Date(),
//         });

//         return res.json({ success: true });
//     } catch (error) {
//         console.error("[UPLOAD ERROR]", error);
//         return res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
//     }
// });
router.post("/upload/:id", verifyToken, upload.array("images", 4), async (req, res) => {
    try {
        const kycId = req.params.id;
        const studentId = req.body.studentId; 
        const files = req.files;
        const bankInfo = req.body.bankInfo; 
        const kycSessionId = req.body.kycSessionId;
        // console.log("[UPLOAD] BODY:", req.body);
        // console.log("[UPLOAD] FILES:", files);

        if (!kycId || !bankInfo || !files || files.length === 0) {
            return res.status(400).json({ error: "Thiếu dữ liệu" });
        }

        const imageUrls = files.map((file) => file.path);

        // await Session.findByIdAndUpdate(kycId, {
        const updated = await Session.findOneAndUpdate(
            { kycId },
            {
                bankInfo,
                uploadedImages: imageUrls,
                imageUploadedAt: new Date(),
            },
            { new: true }
        );
        // Cập nhật trạng thái KYC
        if (!updated) return res.status(404).json({ error: "Không tìm thấy phiên KYC" });

        // Cập nhật trạng thái của bảng KYC sang 'checking'
        await Kyc.findByIdAndUpdate(kycId, {
            status: "checking",
            updatedAt: new Date(),
        });

        await sendTelegramAlert("upload", {
            kycId,
            studentId,
            kycSessionId: updated.kycSessionId,
            wallet: updated.wallet,
            bankInfo,
        });
        // return res.json({ success: true, updated  });
        return res.json({ success: true });
    } catch (error) {
        console.error("[UPLOAD ERROR]", error);
        return res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
});

router.get("/session-status/:kycId", verifyToken, async (req, res) => {
    const { kycId } = req.params;
    try {
        const session = await Session.findOne({ kycId });
        if (!session) return res.status(404).json({ error: "Không tìm thấy phiên" });

        res.json({
            status: session.status,
            paidAt: session.paidAt,
            adminNote: session.adminNote || null,
        });
    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
});

router.get("/history/:studentId/kycs", verifyToken, async (req, res) => {
    const { studentId } = req.params;
  
    if (!studentId) {
      return res.status(400).json({ error: "Thiếu studentId" });
    }
  
    try {
      const sessions = await Session.find({
        studentId,
        imageUploadedAt: { $exists: true, $ne: null },
      });
  
      const histories = await History.find({
        studentId,
        imageUploadedAt: { $exists: true, $ne: null },
      });
  
      const combined = [...sessions, ...histories]
        .map((item) => ({
          wallet: item.wallet,
          kycSessionId: item.kycSessionId,
          kycId: item.kycId,
          status: item.status,
          startedAt: item.imageUploadedAt,
          bankInfo: item.bankInfo || "",
          adminNote: item.adminNote || "",
        }))
        .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  
      if (combined.length === 0) {
        return res.status(404).json({ error: "Không có lịch sử nào" });
      }
  
      return res.json(combined);
    } catch (err) {
      console.error("[HISTORY ERROR]", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
  });
// router.get("/history/:studentId/kycs", verifyToken, async (req, res) => {
//     const { studentId } = req.params;
  
//     if (!studentId) {
//       return res.status(400).json({ error: "Thiếu studentId" });
//     }
  
//     try {
//       const kycs = await Session.find({ studentId: studentId,imageUploadedAt: { $exists: true, $ne: null }  }).sort({ imageUploadedAt: -1 }); // LẤY DANH SÁCH
  
//       if (!kycs || kycs.length === 0) {
//         return res.status(404).json({ error: "Không tìm thấy KYC nào" });
//       }
  
//       // Trả về danh sách các KYC đơn giản
//       res.json(kycs.map(item => ({
//         wallet: item.wallet,
//         kycSessionId: item.kycSessionId,
//         kycId: item.kycId,
//         status: item.status,
//         startedAt: item.imageUploadedAt,
//         bankInfo: item.bankInfo || '',
//         adminNote: item.adminNote || '',
//       })));
//     } catch (err) {
//       console.error('[HISTORY ERROR]', err);
//       return res.status(500).json({ error: "Lỗi server" });
//     }
//   });
  
router.get("/:wallet/images", async (req, res) => {
    const { wallet } = req.params;

    try {
        const kyc = await Kyc.findOne({ wallet });
        if (!kyc) return res.status(404).json({ error: "Không tìm thấy KYC" });

        const session = await Session.findOne({
            kycId: kyc._id,
            status: "paid",
            uploadedImages: { $exists: true, $not: { $size: 0 } },
        });

        if (!session) return res.status(404).json({ error: "Không tìm thấy ảnh" });

        // res.json({ images: session.uploadedImages },  time: session.paidAt); // Mảng URL string
        res.json({
            images: session.uploadedImages,
            paidAt: session.paidAt, // Chuyển sang ISO string
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
router.get("/session/:kycId", async (req, res) => {
    const { kycId } = req.params;
  
    if (!kycId) {
      return res.status(400).json({ error: 'Thiếu kycId' });
    }
  
    try {
      const session = await Session.findOne({ kycId }).sort({ clickedConfirmedAt: -1 });
  
      if (!session) {
        return res.status(404).json({ error: 'Không tìm thấy phiên xác minh' });
      }
  
      return res.json({
        sessionId: session._id,
        kycSessionId: session.kycSessionId,
      });
    } catch (error) {
      console.error("Lỗi lấy session:", error);
      return res.status(500).json({ error: 'Lỗi server' });
    }
  });

export default router;
