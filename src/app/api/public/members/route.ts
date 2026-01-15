import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Member from "@/models/Member";
// We need to import User to ensure schema is registered if not already
import "@/models/User";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json([]);
        }

        // Find users matching name
        const User = (await import("@/models/User")).default;
        const users = await User.find({
            name: { $regex: query, $options: "i" },
            role: "member"
        }).select("_id name");

        const userIds = users.map(u => u._id);

        // Find members with those user IDs
        const members = await Member.find({
            user: { $in: userIds }
        }).populate("user", "name");

        return NextResponse.json(members);
    } catch (error) {
        console.error("Public Search Error", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
