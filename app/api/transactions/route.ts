import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ✅ add this

const schema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]),
    amountCents: z.number().int().positive(),
    date: z.string(), // ✅ stricter
    categoryId: z.string().nullable().optional(),
    merchant: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
});

export async function GET() { 
    const session = await getServerSession(authOptions); // ✅ change
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const txns = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        include: { category: true },
        take: 50,
    });

    return NextResponse.json(txns);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions); // ✅ change
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const data = parsed.data;

    const created = await prisma.transaction.create({
        data: {
            userId,
            type: data.type,
            amountCents: data.amountCents,
            date: new Date(data.date),
            categoryId: data.categoryId,
            merchant: data.merchant,
            note: data.note,
        },
    });

    return NextResponse.json(created);
}