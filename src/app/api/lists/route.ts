import { NextRequest } from "next/server";
import prisma from "@/database/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { handleError, unauthorized, apiSuccess } from "@/app/lib/errors";
import { listSchema } from "@/app/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const { title, position, boardId } = listSchema.parse(await req.json());

    const userId = getDataFromToken(req);
    if (!userId) return unauthorized("Invalid or missing token");

    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board) return unauthorized("Board not found");

    if (board.ownerId !== userId) return unauthorized("Not allowed");

    const list = await prisma.list.create({
      data: { title, position, boardId },
    });

    return apiSuccess(list, "List created", 201);
  } catch (error) {
    return handleError(error);
  }
}
