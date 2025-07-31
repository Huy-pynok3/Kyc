import express from "express";
import {
    submitKyc,
    getKycStatus,
    getKycStatusByWallet,
    getAllKyc,
    updateKycStatus,
    deleteKyc,
    getKycSessions,
    updateSessionStatus,
} from "../controllers/kycController.js";
import  verifyToken  from '../middlewares/authToken.js';
import auth from "../middlewares/auth.js";

const router = express.Router();

//client
router.post("/submit",verifyToken, submitKyc);
router.get("/status/:wallet",verifyToken, getKycStatus);
// router.get("/status/:wallet",verifyToken, getKycStatusByWallet);


// Admin routes

router.get("/sessions", auth, getKycSessions);
// router.get("/sessions", getKycSessions);
router.get("/all", auth, getAllKyc);
router.post("/update-status", auth, updateKycStatus);
router.post("/session-status/update", auth, updateSessionStatus);
router.delete("/delete", auth, deleteKyc); 

export default router;
