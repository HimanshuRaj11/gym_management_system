import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Member from "@/models/Member";
import User from "@/models/User";

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Middleware sets 'x-user-id' header
        const userId = req.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const member = await Member.findOne({ user: userId })
            .populate("user", "name email image")
            .populate("currentPackage", "name amount");

        if (!member) {
            return NextResponse.json({ error: "Member profile not found" }, { status: 404 });
        }

        return NextResponse.json(member);
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
