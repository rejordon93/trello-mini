import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { handleError, unauthorized } from "@/app/lib/errors";
import { listSchema, ListInput } from "@/app/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const listBody = await req.json();
    const { title, position, boardId }: ListInput = listSchema.parse(listBody);

    const userId = getDataFromToken(req);
    if (!userId) return unauthorized("Invlid or missing token");

    const board = await prisma.board.findUnique({
      where: {
        id: userId,
      },
    });
    if (!board) return unauthorized("Board not found");

    const list = await prisma.list.create({
      data: { title, position, boardId },
    });

    return NextResponse.json({
      message: "List created ",
      list,
    });
  } catch (error) {
    return handleError(error);
  }
}
