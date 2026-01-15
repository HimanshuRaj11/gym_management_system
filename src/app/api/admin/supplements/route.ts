import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Supplement from "@/models/Supplement";
import { z } from "zod";

const supplementSchema = z.object({
    name: z.string().min(2),
    brand: z.string().min(2),
    description: z.string().optional(),
    price: z.number().positive(),
    stock: z.number().int().min(0),
    category: z.string(),
    image: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        await dbConnect();
        const items = await Supplement.find().sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const result = supplementSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: (result.error as any).errors[0].message }, { status: 400 });
        }

        const item = await Supplement.create(result.data);
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
