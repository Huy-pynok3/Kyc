import express from "express";
import {
    submitKyc,
    getKycStatus,
    getKycStatusByWallet,
    getAllKyc,
    updateKycStatus,
    deleteKyc,
} from "../controllers/kycController.js";

import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/submit", submitKyc);
router.get("/status/:wallet", getKycStatus);
router.get("/status/:wallet", getKycStatusByWallet);

// Admin routes
// router.get("/all", getAllKyc);
// router.post("/update-status", updateKycStatus);
router.get("/all", auth, getAllKyc);
router.post("/update-status", auth, updateKycStatus);
router.delete("/delete", auth, deleteKyc); 

export default router;
