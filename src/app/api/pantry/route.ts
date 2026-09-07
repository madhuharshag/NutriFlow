import { NextResponse } from "next/server";
import { requireAuthAPI, handleApiError, checkRateLimit } from "@/lib/api-helpers";
import { addPantryItemSchema, updatePantryItemSchema } from "@/lib/validations/api";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    const items = await prisma.pantryItem.findMany({
      where: { userId: auth.dbUser.id },
      include: {
        ingredient: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      items: items.map((item) => ({
        id: item.id,
        ingredientId: item.ingredientId,
        name: item.ingredient.name,
        category: item.ingredient.category,
        isLow: item.isLow,
        notes: item.notes,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    if (!checkRateLimit(`pantry:${auth.dbUser.id}`, 30)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const validated = addPantryItemSchema.parse(body);

    const name = validated.name.trim();

    // Find or create ingredient
    let ingredient = await prisma.ingredient.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (!ingredient) {
      ingredient = await prisma.ingredient.create({
        data: {
          name,
          category: "PANTRY" as any,
        },
      });
    }

    const item = await prisma.pantryItem.upsert({
      where: {
        userId_ingredientId: {
          userId: auth.dbUser.id,
          ingredientId: ingredient.id,
        },
      },
      update: {
        isLow: validated.isLow ?? false,
        notes: validated.notes,
      },
      create: {
        userId: auth.dbUser.id,
        ingredientId: ingredient.id,
        isLow: validated.isLow ?? false,
        notes: validated.notes,
      },
      include: {
        ingredient: true,
      },
    });

    return NextResponse.json({
      item: {
        id: item.id,
        ingredientId: item.ingredientId,
        name: item.ingredient.name,
        category: item.ingredient.category,
        isLow: item.isLow,
        notes: item.notes,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    await prisma.pantryItem.deleteMany({
      where: {
        id,
        userId: auth.dbUser.id, // security: only delete own item
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const validated = updatePantryItemSchema.parse(body);

    const updated = await prisma.pantryItem.updateMany({
      where: {
        id,
        userId: auth.dbUser.id,
      },
      data: {
        ...(validated.isLow !== undefined && { isLow: validated.isLow }),
        ...(validated.notes !== undefined && { notes: validated.notes }),
      },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
