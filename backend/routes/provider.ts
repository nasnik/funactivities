import express from "express";
import upload from "../middleware/upload";
//import { uploadFile } from "../controllers/provider";
import { getProviderById } from "../controllers/provider";

const router = express.Router();

router.get("/:providerId", getProviderById);
//router.post("/:providerId/upload", upload.single("image"), uploadFile);

export default router;