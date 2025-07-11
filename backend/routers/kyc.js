import express from "express";
import { submitKyc, getKycStatus, getKycStatusByWallet } from "../controllers/kycController.js";
import { getAllKyc, updateKycStatus } from "../controllers/kycController.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/submit", submitKyc);
router.get("/status/:wallet", getKycStatus);

// Admin routes
router.get("/all", getAllKyc);
router.post("/update-status", updateKycStatus);
router.get("/all", auth, getAllKyc);
router.post("/update-status", auth, updateKycStatus);
router.get("/status/:wallet", getKycStatusByWallet);

// module.exports = router;
export default router;
