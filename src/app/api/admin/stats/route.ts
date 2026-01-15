import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Member from "@/models/Member";
import Payment from "@/models/Payment";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET(req: Request) {
    try {
        await dbConnect();

        // 1. Total Active Members
        const activeMembersCount = await Member.countDocuments({ status: "active" });

        // 2. Revenue this month
        const startOfCurrentMonth = startOfMonth(new Date());
        const endOfCurrentMonth = endOfMonth(new Date());

        const revenueResult = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
                    status: "completed",
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]);
        const monthlyRevenue = revenueResult[0]?.total || 0;

        // 3. Pending Payments (Expired members)
        // Assuming 'expired' status means pending renewal or just query those whose package ended
        const pendingPaymentsCount = await Member.countDocuments({ status: "expired" });

        // 4. New Members this month
        const newMembersCount = await Member.countDocuments({
            joiningDate: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        });

        return NextResponse.json({
            activeMembers: activeMembersCount,
            monthlyRevenue,
            pendingPayments: pendingPaymentsCount,
            newMembers: newMembersCount,
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
