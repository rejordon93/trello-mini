import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { cardSchema } from "@/app/lib/validators";
import { apiSuccess, handleError, unauthorized } from "@/app/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, position, listId } = cardSchema.parse(body);

    const userId = getDataFromToken(req);
    if (!userId) return unauthorized("No user found");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return unauthorized("No user found");

    // Now TypeScript knows listId exists
    const createCard = await prisma.card.create({
      data: {
        title,
        description,
        position,
        listId,
      },
    });

    return apiSuccess(createCard, "Card created", 201);
  } catch (error) {
    return handleError(error);
  }
}
