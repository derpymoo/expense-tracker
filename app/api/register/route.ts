import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1).optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const email = parsed.data.email.toLowerCase().trim();
        const password = parsed.data.password;
        const name = parsed.data.name?.trim() || null;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "Email already used" }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: { email, name, passwordHash },
        });

        return NextResponse.json({ ok: true });
    } catch (error: unknown) {
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json({ error: "Email already used" }, { status: 409 });
            }
            if (error.code === "P2021") {
                return NextResponse.json(
                    { error: "Database schema is not deployed. Run Prisma migrations." },
                    { status: 500 }
                );
            }
        }

        if (error instanceof Prisma.PrismaClientInitializationError) {
            return NextResponse.json(
                { error: "Database connection failed. Check DATABASE_URL in Vercel." },
                { status: 500 }
            );
        }

        console.error("Register API failed", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
