import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeePackage extends Document {
    name: string;
    description?: string;
    amount: number;
    durationInMonths: number; // 1, 3, 6, 12
    isActive: boolean;
}

const FeePackageSchema: Schema<IFeePackage> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: String,
        amount: {
            type: Number,
            required: true,
        },
        durationInMonths: {
            type: Number,
            required: true,
            enum: [1, 3, 6, 12], // Standard packages
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const FeePackage: Model<IFeePackage> =
    mongoose.models.FeePackage || mongoose.model<IFeePackage>("FeePackage", FeePackageSchema);

export default FeePackage;
