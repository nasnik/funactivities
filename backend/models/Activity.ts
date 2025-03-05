import mongoose, { Schema, Document, Types } from "mongoose";

interface Schedule {
    day: string; // Day of the week (e.g., "Monday")
    startDate: string; // Start date in YYYY-MM-DD format
    time: string; // Time in HH:mm format
}

export interface IActivity extends Document {
    name: string;
    location: string;
    description: string;
    imageUrl: string;
    ageGroup: {
        min: number;
        max: number;
    };
    numOfMeetings: number;
    price: number;
    schedule: Schedule[];
    createdBy: Types.ObjectId;
}

const ActivitySchema = new Schema<IActivity>(
    {
        name: {
            type: String,
            required: [true, 'Please provide an activity name'],
            maxlength: 50,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: false,
        },
        ageGroup: {
            min: {
                type: Number,
                required: true,
            },
            max: {
                type: Number,
                required: true,
            },
        },
        location: {
            type: String,
            required: true,
        },
        schedule: [
            {
                day: { type: String, required: true },
                startDate: { type: String, required: true },
                time: { type: String, required: true },
            },
        ],
        numOfMeetings: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IActivity>('Activity', ActivitySchema);
