import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'provider' | 'admin';
    activitiesEnrolled: mongoose.Types.ObjectId[];
    createJWT(): string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'provider', 'admin'],
        default: 'user',
    },
    activitiesEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity',
        },
    ],
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Generate JWT
UserSchema.methods.createJWT = function (): string {
    const jwtSecret: Secret = process.env.JWT_SECRET as string;
    const jwtLifetime = process.env.JWT_LIFETIME as SignOptions["expiresIn"] || "30d";

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    return jwt.sign(
        { userId: this._id, name: this.name, role: this.role }, // Include role in JWT
        jwtSecret,
        { expiresIn: jwtLifetime }
    );
};

// Compare hashed password
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
