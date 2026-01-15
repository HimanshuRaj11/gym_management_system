import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMember extends Document {
    user: mongoose.Types.ObjectId;
    phone: string;
    address?: string;
    dob?: Date;
    gender?: "male" | "female" | "other";
    emergencyContact?: string;
    height?: number; // in cm
    weight?: number; // in kg
    status: "active" | "inactive" | "expired";
    joiningDate: Date;
    currentPackage?: mongoose.Types.ObjectId;
    packageStartDate?: Date;
    packageEndDate?: Date;
    profileImage?: string; // Specific profile image if different from user image
}

const MemberSchema: Schema<IMember> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: [true, "Please provide a phone number"],
        },
        address: String,
        dob: Date,
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        emergencyContact: String,
        height: Number,
        weight: Number,
        status: {
            type: String,
            enum: ["active", "inactive", "expired"],
            default: "active",
        },
        joiningDate: {
            type: Date,
            default: Date.now,
        },
        currentPackage: {
            type: Schema.Types.ObjectId,
            ref: "FeePackage",
        },
        packageStartDate: Date,
        packageEndDate: Date,
        profileImage: String,
    },
    {
        timestamps: true,
    }
);

const Member: Model<IMember> =
    mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);

export default Member;
