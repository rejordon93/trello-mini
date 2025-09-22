import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { handleError, unauthorized, apiSuccess } from "@/app/lib/errors";

interface Params {
  id: string;
}
export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const boardId = parseInt(params.id);
    const userId = getDataFromToken(req);

    if (!userId) return unauthorized("No Token");

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        lists: {
          orderBy: { position: "asc" },
          include: {
            cards: { orderBy: { position: "asc" } },
          },
        },
      },
    });

    if (!board)
      return NextResponse.json({ error: "Board not found" }, { status: 404 });

    if (board.ownerId != userId) return unauthorized("Not allowed");

    return apiSuccess(board, "Board fetched successfully");
  } catch (error) {
    return handleError(error);
  }
}
