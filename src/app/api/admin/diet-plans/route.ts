import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DietPlan from "@/models/DietPlan";
import { z } from "zod";

const dietPlanSchema = z.object({
    memberId: z.string(),
    planName: z.string().min(2),
    description: z.string().optional(),
    meals: z.array(z.object({
        time: z.string(),
        items: z.array(z.string()),
        calories: z.number().optional()
    })),
});

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Assuming we want to fetch all plans for admin
        const plans = await DietPlan.find().populate({
            path: "member",
            populate: { path: "user", select: "name" }
        });
        return NextResponse.json(plans);
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const result = dietPlanSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: (result.error as any).errors[0].message }, { status: 400 });
        }

        // In a real app we get assignedBy from auth token
        const plan = await DietPlan.create({
            member: result.data.memberId,
            planName: result.data.planName,
            description: result.data.description,
            meals: result.data.meals
        });

        return NextResponse.json(plan, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
