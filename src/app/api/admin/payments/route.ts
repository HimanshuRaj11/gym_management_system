import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";
import Member from "@/models/Member";
import { z } from "zod";

const paymentSchema = z.object({
    memberId: z.string(),
    amount: z.number().positive(),
    paymentMethod: z.enum(["cash", "upi", "card", "bank_transfer"]),
    transactionId: z.string().optional(),
    type: z.enum(["fee", "store_purchase"]).default("fee"),
    notes: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        await dbConnect();
        const payments = await Payment.find()
            .populate({
                path: "member",
                populate: { path: "user", select: "name email" }
            })
            .sort({ createdAt: -1 });

        return NextResponse.json(payments);
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const result = paymentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: (result.error as any).errors[0].message }, { status: 400 });
        }

        const { memberId, amount, paymentMethod, transactionId, type, notes } = result.data;

        // Create Payment
        const payment = await Payment.create({
            member: memberId,
            amount,
            paymentMethod,
            transactionId,
            type,
            notes,
            status: "completed"
        });

        // If it's a fee payment, extend member validity (Simplified logic)
        // Ideally user selects which Package they are paying for, or we auto-renew current.
        // For now, let's just log it. Real-world would be more complex.

        return NextResponse.json(payment, { status: 201 });
    } catch (error) {
        console.error("Payment Error", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
