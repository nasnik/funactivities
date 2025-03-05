import express from "express";
import {
    createBooking,
    getUserBookings,
    getProviderBookings,
    updateBookingStatus,
    deleteBooking
} from "../controllers/booking";
import authMiddleware from "../middleware/authentication";

const router = express.Router();

// Create a new booking
router.post("/", authMiddleware, createBooking);

// Get all bookings for a user
router.get("/user", authMiddleware, getUserBookings);

// Get all bookings for a provider
router.get("/provider", authMiddleware, getProviderBookings);

// Update booking status (approve/reject)
router.patch("/:id/status", authMiddleware, updateBookingStatus);

// Delete a booking
router.delete("/:id", authMiddleware, deleteBooking);

export default router;
