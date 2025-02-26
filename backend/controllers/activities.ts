import { Request, Response } from "express";
import Activity from "../models/Activity";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";

// Define a custom request type to include `user`
interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

export const getAllActivities = async (req: AuthRequest, res: Response) => {
    const activities = await Activity.find({ createdBy: req.user?.userId }).sort("createdAt");
    res.status(StatusCodes.OK).json({ activities, count: activities.length });
};

export const getActivity = async (req: AuthRequest, res: Response) => {
    const {
        user: { userId } = {},
        params: { id: activityId },
    } = req;

    if (!userId) {
        throw new BadRequestError("User authentication failed");
    }

    const activity = await Activity.findOne({ _id: activityId, createdBy: userId });

    if (!activity) {
        throw new NotFoundError(`Activity with id ${activityId} not found`);
    }

    res.status(StatusCodes.OK).json({ activity });
};

export const createActivity = async (req: AuthRequest, res: Response) => {
    if (!req.user || !req.user.userId) {
        throw new BadRequestError("User authentication failed");
    }

    req.body.createdBy = req.user.userId;
    const activity = await Activity.create(req.body);

    res.status(StatusCodes.CREATED).json({ activity });
};

export const updateActivity = async (req: AuthRequest, res: Response) => {
    const {
        user: { userId } = {},
        params: { id: activityId },
        body: { price },
    } = req;

    if (!userId) {
        throw new BadRequestError("User authentication failed");
    }

    if (price === "") {
        throw new BadRequestError("Price cannot be empty");
    }

    const activity = await Activity.findOneAndUpdate(
        { _id: activityId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    );

    if (!activity) {
        throw new NotFoundError(`Activity with id ${activityId} not found`);
    }

    res.status(StatusCodes.OK).json({ activity });
};

export const deleteActivity = async (req: AuthRequest, res: Response) => {
    const {
        user: { userId } = {},
        params: { id: activityId },
    } = req;

    if (!userId) {
        throw new BadRequestError("User authentication failed");
    }

    const activity = await Activity.findOneAndDelete({ _id: activityId, createdBy: userId });

    if (!activity) {
        throw new NotFoundError(`Activity with id ${activityId} not found`);
    }

    res.status(StatusCodes.OK).send("Activity has been deleted");
};
