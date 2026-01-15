import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
    member: mongoose.Types.ObjectId;
    package?: mongoose.Types.ObjectId;
    amount: number;
    paymentMethod: "cash" | "upi" | "card" | "bank_transfer";
    transactionId?: string; // For digital payments
    paymentDate: Date;
    status: "pending" | "completed" | "failed";
    type: "fee" | "store_purchase";
    notes?: string;
}

const PaymentSchema: Schema<IPayment> = new Schema(
    {
        member: {
            type: Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },
        package: {
            type: Schema.Types.ObjectId,
            ref: "FeePackage",
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "upi", "card", "bank_transfer"],
            required: true,
        },
        transactionId: String,
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "completed",
        },
        type: {
            type: String,
            enum: ["fee", "store_purchase"],
            default: "fee",
        },
        notes: String,
    },
    {
        timestamps: true,
    }
);

const Payment: Model<IPayment> =
    mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
