import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISupplement extends Document {
    name: string;
    brand: string;
    description?: string;
    price: number;
    stock: number;
    category: string; // e.g., Protein, Vitamin, Gear
    image?: string;
}

const SupplementSchema: Schema<ISupplement> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        description: String,
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            default: 0,
        },
        category: {
            type: String,
            required: true,
        },
        image: String,
    },
    {
        timestamps: true,
    }
);

const Supplement: Model<ISupplement> =
    mongoose.models.Supplement || mongoose.model<ISupplement>("Supplement", SupplementSchema);

export default Supplement;
