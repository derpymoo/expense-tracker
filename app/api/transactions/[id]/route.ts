import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const paramsSchema = z.object({
    id: z.string().cuid(),
});

const patchSchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    amountCents: z.number().int().positive().optional(),
    date: z.string().optional(),
    categoryId: z.string().cuid().optional().nullable(),
    merchant: z.string().trim().min(1).optional().nullable(),
    note: z.string().trim().optional().nullable(),
});

function getUserId(session: unknown): string | null {
    const id = (session as any)?.user?.id;
    return typeof id === "string" && id.length > 0 ? id : null;
}

async function ensureOwnedTxn(userId: string, id: string) {
    return prisma.transaction.findFirst({
        where: { id, userId },
        select: { id: true },
    });
}

export async function GET(_req: Request, ctx: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsedParams = paramsSchema.safeParse(ctx.params);
    if (!parsedParams.success) {
        return NextResponse.json(
            { error: "Invalid id", details: parsedParams.error.flatten() },
            { status: 400 }
        );
    }

    const { id } = parsedParams.data;

    const txn = await prisma.transaction.findFirst({
        where: { id, userId },
        include: { category: true },
    });

    if (!txn) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(txn);
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsedParams = paramsSchema.safeParse(ctx.params);
    if (!parsedParams.success) {
        return NextResponse.json(
            { error: "Invalid id", details: parsedParams.error.flatten() },
            { status: 400 }
        );
    }
    const { id } = parsedParams.data;

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsedBody = patchSchema.safeParse(body);
    if (!parsedBody.success) {
        return NextResponse.json(
            { error: "Invalid input", details: parsedBody.error.flatten() },
            { status: 400 }
        );
    }

    const owned = await ensureOwnedTxn(userId, id);
    if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = parsedBody.data;

    // Optional: validate categoryId belongs to user
    if (data.categoryId) {
        const ok = await prisma.category.findFirst({
            where: { id: data.categoryId, userId },
            select: { id: true },
        });
        if (!ok) {
            return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
        }
    }

    const updated = await prisma.transaction.update({
        where: { id },
        data: {
            ...(data.type !== undefined ? { type: data.type } : {}),
            ...(data.amountCents !== undefined ? { amountCents: data.amountCents } : {}),
            ...(data.date !== undefined ? { date: new Date(data.date) } : {}),
            ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
            ...(data.merchant !== undefined ? { merchant: data.merchant } : {}),
            ...(data.note !== undefined ? { note: data.note } : {}),
        },
        include: { category: true },
    });

    return NextResponse.json(updated);
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsedParams = paramsSchema.safeParse(ctx.params);
    if (!parsedParams.success) {
        return NextResponse.json(
            { error: "Invalid id", details: parsedParams.error.flatten() },
            { status: 400 }
        );
    }
    const { id } = parsedParams.data;

    const owned = await ensureOwnedTxn(userId, id);
    if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}