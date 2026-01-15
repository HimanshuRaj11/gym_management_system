import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Member from "@/models/Member";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const createMemberSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    password: z.string().min(6).optional(), // Can auto-generate
    gender: z.enum(["male", "female", "other"]).optional(),
    joiningDate: z.string().optional(),
    packageId: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Populate user info (name, email)
        const members = await Member.find()
            .populate("user", "name email image")
            .populate("currentPackage", "name");

        // Format response to include flat structure for easier table display if needed
        const formattedMembers = members.map(m => {
            const user = m.user as any;
            const pkg = m.currentPackage as any;
            return {
                _id: m._id,
                name: user.name,
                email: user.email,
                phone: m.phone,
                status: m.status,
                joiningDate: m.joiningDate,
                package: pkg?.name || "None",
            };
        });

        return NextResponse.json(formattedMembers);
    } catch (error) {
        console.error("Fetch Members Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const result = createMemberSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: (result.error as any).errors[0].message }, { status: 400 });
        }

        const { name, email, phone, password, gender, joiningDate, packageId } = result.data;

        // 1. Create User
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password || "123456"); // Default/provided password

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "member",
        });

        // 2. Prepare Member Data
        let memberData: any = {
            user: user._id,
            phone,
            gender,
            joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
            status: "active"
        };

        // 3. Handle Package Assignment
        if (packageId) {
            const FeePackage = (await import("@/models/FeePackage")).default;
            const pkg = await FeePackage.findById(packageId);
            if (pkg) {
                memberData.currentPackage = pkg._id;
                memberData.packageStartDate = new Date();
                // Calculate end date
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + pkg.durationInMonths);
                memberData.packageEndDate = endDate;
            }
        }

        // 4. Create Member Details
        const member = await Member.create(memberData);

        return NextResponse.json({ message: "Member created successfully", member }, { status: 201 });

    } catch (error) {
        console.error("Create Member Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
