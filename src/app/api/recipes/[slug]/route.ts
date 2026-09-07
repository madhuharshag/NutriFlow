import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({
      where: { slug },
      include: {
        ingredients: {
          include: {
            ingredient: true,
            substitutions: {
              include: {
                substituteIngredient: true,
              },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        steps: {
          orderBy: { stepNumber: "asc" },
        },
        nutritionEstimates: {
          include: {
            nutrient: true,
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    return handleApiError(error);
  }
}
