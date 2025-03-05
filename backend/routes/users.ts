import express from "express";
import { getUserProfile, updateUserProfile, deleteUser } from "../controllers/users";
import authMiddleware from "../middleware/authentication";

const router = express.Router();

// Get user profile
router.get("/profile", authMiddleware, getUserProfile);

// Update user profile
router.put("/profile", authMiddleware, updateUserProfile);

// Delete user account
router.delete("/", authMiddleware, deleteUser);


export default router;
