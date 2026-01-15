import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDietPlan extends Document {
    member: mongoose.Types.ObjectId;
    assignedBy: mongoose.Types.ObjectId; // Trainer/Admin
    planName: string;
    description?: string;
    meals: {
        time: string; // e.g., "Breakfast", "8:00 AM"
        items: string[];
        calories?: number;
    }[];
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
}

const DietPlanSchema: Schema<IDietPlan> = new Schema(
    {
        member: {
            type: Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        planName: {
            type: String,
            required: true,
        },
        description: String,
        meals: [
            {
                time: String,
                items: [String],
                calories: Number,
            },
        ],
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: Date,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const DietPlan: Model<IDietPlan> =
    mongoose.models.DietPlan || mongoose.model<IDietPlan>("DietPlan", DietPlanSchema);

export default DietPlan;
