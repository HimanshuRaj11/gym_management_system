import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILog extends Document {
    user: mongoose.Types.ObjectId;
    action: string;
    details?: any; // Flexible object for details
    ipAddress?: string;
    createdAt: Date;
}

const LogSchema: Schema<ILog> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        details: {
            type: Schema.Types.Mixed, // Can store any JSON data
        },
        ipAddress: String,
    },
    {
        timestamps: true,
    }
);

const Log: Model<ILog> =
    mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);

export default Log;
