import { Request, Response } from "express";
import Registration from "../models/Registration";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";

// Define a custom request type to include `user`
interface AuthRequest extends Request {
    user?: {
        userId: string;
        role?: "user" | "provider";
    };
}

// Create a new booking (registration for an activity)
export const createBooking = async (req: AuthRequest, res: Response) => {
    const { activity, provider } = req.body;

    if (!req.user || !req.user.userId) {
        throw new BadRequestError("User authentication failed");
    }

    const existingBooking = await Registration.findOne({
        user: req.user.userId,
        activity,
    });

    if (existingBooking) {
        throw new BadRequestError("You have already registered for this activity.");
    }

    const booking = await Registration.create({
        user: req.user.userId,
        activity,
        provider,
        status: "pending",
    });

    res.status(StatusCodes.CREATED).json({ booking });
};

// Get all bookings for a specific user
export const getUserBookings = async (req: AuthRequest, res: Response) => {
    if (!req.user || !req.user.userId) {
        throw new BadRequestError("User authentication failed");
    }

    const bookings = await Registration.find({ user: req.user.userId })
        .populate("activity")
        .populate("provider");

    res.status(StatusCodes.OK).json({ bookings, count: bookings.length });
};

// Get all bookings for a provider
export const getProviderBookings = async (req: AuthRequest, res: Response) => {
    if (!req.user || !req.user.userId) {
        throw new BadRequestError("User authentication failed");
    }

    const bookings = await Registration.find({ provider: req.user.userId })
        .populate("user")
        .populate("activity");

    res.status(StatusCodes.OK).json({ bookings, count: bookings.length });
};

// Update booking status (approve/reject)
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
    const { id: bookingId } = req.params;
    const { status } = req.body;

    if (!req.user || !req.user.userId) {
        throw new BadRequestError("User authentication failed");
    }

    if (!["approved", "rejected"].includes(status)) {
        throw new BadRequestError("Invalid status value");
    }

    const booking = await Registration.findOneAndUpdate(
        { _id: bookingId, provider: req.user.userId },
        { status },
        { new: true, runValidators: true }
    );

    if (!booking) {
        throw new NotFoundError(`Booking with id ${bookingId} not found`);
    }

    res.status(StatusCodes.OK).json({ booking });
};

// Delete a booking
export const deleteBooking = async (req: AuthRequest, res: Response) => {
    const { id: bookingId } = req.params;

    if (!req.user || !req.user.userId) {
        throw new BadRequestError("User authentication failed");
    }

    const booking = await Registration.findOneAndDelete({
        _id: bookingId,
        user: req.user.userId,
    });

    if (!booking) {
        throw new NotFoundError(`Booking with id ${bookingId} not found`);
    }

    res.status(StatusCodes.OK).json({ message: "Booking has been deleted" });
};
