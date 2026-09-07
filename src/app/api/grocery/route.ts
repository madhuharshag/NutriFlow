import { NextResponse } from "next/server";
import { requireAuthAPI, handleApiError, checkRateLimit } from "@/lib/api-helpers";
import { addGroceryItemSchema, updateGroceryItemSchema } from "@/lib/validations/api";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    // Find or create default grocery list for user
    let list = await prisma.groceryList.findFirst({
      where: { userId: auth.dbUser.id },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!list) {
      list = await prisma.groceryList.create({
        data: {
          userId: auth.dbUser.id,
          name: "My Grocery List",
        },
        include: { items: true },
      });
    }

    return NextResponse.json({
      listId: list.id,
      items: list.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        isChecked: item.isChecked,
        isManual: item.isManual,
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

    if (!checkRateLimit(`grocery:${auth.dbUser.id}`, 30)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();

    // Check if bulk add (e.g. from recipe or missing ingredients)
    if (Array.isArray(body.items)) {
      let list = await prisma.groceryList.findFirst({
        where: { userId: auth.dbUser.id },
      });

      if (!list) {
        list = await prisma.groceryList.create({
          data: { userId: auth.dbUser.id, name: "My Grocery List" },
        });
      }

      const createdItems = await prisma.$transaction(
        body.items.map((item: any) =>
          prisma.groceryItem.create({
            data: {
              groceryListId: list!.id,
              name: item.name,
              quantity: item.quantity || "1",
              unit: item.unit || "",
              category: item.category || "OTHER",
              recipeId: item.recipeId,
              isManual: true,
            },
          })
        )
      );

      return NextResponse.json({ success: true, count: createdItems.length });
    }

    // Single item
    const validated = addGroceryItemSchema.parse(body);

    let list = await prisma.groceryList.findFirst({
      where: { userId: auth.dbUser.id },
    });

    if (!list) {
      list = await prisma.groceryList.create({
        data: { userId: auth.dbUser.id, name: "My Grocery List" },
      });
    }

    const item = await prisma.groceryItem.create({
      data: {
        groceryListId: list.id,
        name: validated.name,
        quantity: validated.quantity,
        unit: validated.unit,
        category: validated.category,
        recipeId: validated.recipeId,
        isManual: true,
      },
    });

    return NextResponse.json({
      item: {
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        isChecked: item.isChecked,
        isManual: item.isManual,
      },
    });
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
    const validated = updateGroceryItemSchema.parse(body);

    // Ensure item belongs to user's list
    const item = await prisma.groceryItem.findFirst({
      where: {
        id,
        groceryList: { userId: auth.dbUser.id },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const updated = await prisma.groceryItem.update({
      where: { id },
      data: {
        ...(validated.isChecked !== undefined && { isChecked: validated.isChecked }),
        ...(validated.quantity !== undefined && { quantity: validated.quantity }),
        ...(validated.unit !== undefined && { unit: validated.unit }),
      },
    });

    return NextResponse.json({ success: true, item: updated });
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
    const clearChecked = searchParams.get("clearChecked") === "true";

    if (clearChecked) {
      // Clear all checked items for user
      await prisma.groceryItem.deleteMany({
        where: {
          groceryList: { userId: auth.dbUser.id },
          isChecked: true,
        },
      });
      return NextResponse.json({ success: true });
    }

    if (!id) {
      return NextResponse.json({ error: "Item ID or clearChecked is required" }, { status: 400 });
    }

    await prisma.groceryItem.deleteMany({
      where: {
        id,
        groceryList: { userId: auth.dbUser.id },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
