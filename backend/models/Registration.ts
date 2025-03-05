import mongoose, { Schema, Document } from "mongoose";

export interface IRegistration extends Document {
    user: mongoose.Types.ObjectId;
    activity: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    status: "pending" | "approved" | "rejected";
}

const RegistrationSchema = new Schema<IRegistration>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        activity: {
            type: Schema.Types.ObjectId,
            ref: "Activity",
            required: true,
        },
        provider: {
            type: Schema.Types.ObjectId,
            ref: "Provider",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model<IRegistration>("Registration", RegistrationSchema);
