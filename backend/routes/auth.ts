import express from "express";
import { login, registerUser, registerProvider } from "../controllers/auth";

const router = express.Router();

// Register a new user
router.post("/register/user", registerUser);

// Register a new provider
router.post("/register/provider", registerProvider);

// Login user or provider
router.post("/login", login);

export default router;
