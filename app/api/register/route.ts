import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1).optional(),
});

export async function POST(req: Request) {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ error: "Email already used" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    console.log("REGISTER HIT", { email, name });
    await prisma.user.create({
        data: { email, name, passwordHash },
    });

    return NextResponse.json({ ok: true });
}