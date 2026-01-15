import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Member from "@/models/Member";
import User from "@/models/User";
import { z } from "zod";

const updateMemberSchema = z.object({
    phone: z.string().min(10).optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    status: z.enum(["active", "inactive", "expired"]).optional(),
    packageId: z.string().optional(), // For changing package
});

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await dbConnect();
        const member = await Member.findById(params.id)
            .populate("user", "name email")
            .populate("currentPackage", "name");

        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }
        return NextResponse.json(member);
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await dbConnect();
        const body = await req.json();
        const result = updateMemberSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: (result.error as any).errors[0].message }, { status: 400 });
        }

        const updates: any = { ...result.data };

        // If package is changing, update dates (simplified logic)
        if (updates.packageId) {
            const FeePackage = (await import("@/models/FeePackage")).default;
            const pkg = await FeePackage.findById(updates.packageId);
            if (pkg) {
                updates.currentPackage = pkg._id;
                updates.packageStartDate = new Date();
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + pkg.durationInMonths);
                updates.packageEndDate = endDate;
                delete updates.packageId;
            }
        }

        const member = await Member.findByIdAndUpdate(params.id, updates, { new: true });

        return NextResponse.json(member);
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await dbConnect();
        const member = await Member.findById(params.id);
        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        // Delete associated User? Depends on policy. Let's say soft delete or keep User.
        // For now, we'll just delete the Member record, user reverts to plain user.
        await Member.findByIdAndDelete(params.id);

        // Optional: Delete User or update role
        // await User.findByIdAndDelete(member.user); 

        return NextResponse.json({ message: "Member deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
