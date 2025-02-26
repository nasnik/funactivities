import mongoose, { Schema, Document, Types } from "mongoose";

interface Schedule {
    date: Date;
    time: {
        start: string;
        end: string;
    };
}

export interface IActivity extends Document {
    name: string;
    description?: string;
    ageGroup: {
        min: number;
        max: number;
    };
    location: string;
    schedule: Schedule[];
    price: number;
    createdBy: Types.ObjectId;
    enrolledUsers: mongoose.Types.ObjectId[];
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
                date: {
                    type: Date,
                    required: true,
                },
                time: {
                    start: { type: String, required: true },
                    end: { type: String, required: true },
                },
            },
        ],
        price: {
            type: Number,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        enrolledUsers: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<IActivity>('Activity', ActivitySchema);
