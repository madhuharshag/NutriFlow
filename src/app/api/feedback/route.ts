import { NextResponse } from "next/server";
import { requireAuthAPI, handleApiError, checkRateLimit } from "@/lib/api-helpers";
import { feedbackSchema } from "@/lib/validations/api";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    if (!checkRateLimit(`feedback:${auth.dbUser.id}`, 30)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const validated = feedbackSchema.parse(body);

    const event = await prisma.mealEvent.create({
      data: {
        userId: auth.dbUser.id,
        recipeId: validated.recipeId,
        eventType: validated.action === "like" ? "saved" : "rejected",
        rejectedReason: validated.reason,
      },
    });

    return NextResponse.json({ success: true, id: event.id });
  } catch (error) {
    return handleApiError(error);
  }
}
