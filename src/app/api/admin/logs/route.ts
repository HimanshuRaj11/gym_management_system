import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Log from "@/models/Log";
// Ensure User model is loaded
import "@/models/User";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const logs = await Log.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .limit(100);

        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// Helper to Create Log internally
export async function createLog(userId: string, action: string, details?: any) {
    try {
        await Log.create({ user: userId, action, details });
    } catch (e) { console.error("Log Error", e); }
}
