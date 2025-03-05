import { Request, Response } from "express";
import Activity from "../models/Activity";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import User from "../models/User";
import upload from "../middleware/upload";

interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
    file?: Express.Multer.File;
}

// Utility function to format activity for the frontend
const formatActivityForFrontend = (activity: any) => ({
    id: activity._id.toString(),
    name: activity.name,
    location: activity.location,
    description: activity.description,
    imageUrl: activity.imageUrl || "",
    ageGroup: activity.ageGroup,
    numOfMeetings: activity.numOfMeetings,
    price: activity.price,
    schedule: activity.schedule.map(({ day, startDate, time }: any) => ({
        day,
        startDate,
        time,
    })),
    createdBy: activity.createdBy.toString(),
});

// GET all activities (for homepage)
export const getActivitiesForHomepage = async (_req: Request, res: Response) => {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(4); // Latest 4 activities
    res.status(StatusCodes.OK).json({ activities, count: activities.length });
};

// GET activities by provider
export const getActivitiesByProvider = async (req: Request, res: Response) => {
    const { providerId } = req.params;

    if (!providerId) {
        throw new BadRequestError("Provider ID is required");
    }
    const activities = await Activity.find({ createdBy: providerId }).sort("createdAt");
    const provider = await User.findById(providerId);

    if (!provider) {
        throw new BadRequestError("Provider not found");
    }

    res.status(StatusCodes.OK).json({
        providerName: provider.name,
        activities,
        count: activities.length
    });
};

// GET all activities (optionally filtered by providerId)
export const getAllActivities = async (req: AuthRequest, res: Response) => {
    const { providerId } = req.query; // Check if a provider ID is passed

    let query = {};
    if (providerId) {
        query = { createdBy: providerId };
    }

    const activities = await Activity.find(query).sort("createdAt");

    res.status(StatusCodes.OK).json({ activities, count: activities.length });
};

// GET a single activity
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

    res.status(StatusCodes.OK).json(formatActivityForFrontend(activity));
};

// CREATE a new activity
export const createActivity = async (req: AuthRequest, res: Response) => {
    if (!req.user || !req.user.userId) {
        throw new BadRequestError("User authentication failed");
    }

    // Check if a file was uploaded
    let imageUrl = "";
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    req.body.createdBy = req.user.userId;
    req.body.imageUrl = imageUrl; // Store file path in the database

    const activity = await Activity.create(req.body);

    res.status(StatusCodes.CREATED).json(formatActivityForFrontend(activity));
};

// UPDATE an activity
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

    res.status(StatusCodes.OK).json(formatActivityForFrontend(activity));
};

// DELETE an activity
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
