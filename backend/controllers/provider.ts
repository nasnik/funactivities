import { Request, Response } from "express";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors";

export const getProviderById = async (req: Request, res: Response) => {
    const { providerId } = req.params;
    const provider = await User.findById(providerId);

    if (!provider || provider.role !== "provider") {
        throw new NotFoundError("Provider not found.");
    }

    res.status(StatusCodes.OK).json({ provider });
};
/*
export const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    res.status(200).json({ message: "File uploaded successfully", filePath: req.file.path });
};*/
