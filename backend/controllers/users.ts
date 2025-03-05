import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authentication";

export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const user = await User.findById(req.user.userId).select("-password"); // Exclude password
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
            return;
        }

        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};

// Get all users (for admin)
export const getAllUsers = async (req: Request, res: Response) => {
    const users = await User.find().select("-password");
    res.json(users);
};

// Update user profile
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
    if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
        return;
    }

    const userId = req.user.userId;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
    res.json(updatedUser);
};

// Delete user account
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
        return;
    }

    const userId = req.user.userId;
    await User.findByIdAndDelete(userId);
    res.json({ msg: "User deleted" });
};
