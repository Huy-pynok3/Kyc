import express from "express";
import mongoose from "mongoose";
import { Kyc, Session } from "../models/index.js";
import upload from "../middlewares/upload.js";


export async function getKycInfo(req, res) {
    try {
      const kyc = await Kyc.findById(req.params.id);
      if (!kyc) return res.status(404).json({ error: 'KYC không tồn tại' });
  
      res.json({
        _id: kyc._id,
        wallet: kyc.wallet,
        mapleLink: kyc.mapleLink,
        status: kyc.status,
        email: kyc.email || '',
        startedAt: kyc.startedAt || null,
      });
    } catch (err) {
      console.error('Lỗi khi lấy thông tin KYC:', err);
      res.status(500).json({ error: 'Lỗi server' });
    }
  }
  
  export async function getAvailableKyc(req, res) {
    try {
      const availableKyc = await Kyc.find({ status: 'pending' }).limit(20);
      res.json(availableKyc);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách KYC:', err);
      res.status(500).json({ error: 'Lỗi server' });
    }
  }