import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FeePackage from "@/models/FeePackage";
import { z } from "zod";

const feePackageSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    amount: z.number().positive(),
    durationInMonths: z.number().int().positive(),
});

export async function GET(req: Request) {
    try {
        await dbConnect();
        const packages = await FeePackage.find({ isActive: true });
        return NextResponse.json(packages);
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const result = feePackageSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: (result.error as any).errors[0].message }, { status: 400 });
        }

        const newPackage = await FeePackage.create(result.data);
        return NextResponse.json(newPackage, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
