import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { handleError, unauthorized, apiSuccess } from "@/app/lib/errors";
import { listSchema } from "@/app/lib/validators";

interface Params {
  id: string;
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const listId = parseInt(params.id);
    const userId = getDataFromToken(req);
    if (!userId) return unauthorized("Invalid token");

    const body = await req.json();
    const { title, position } = listSchema.partial().parse(body);

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list)
      return NextResponse.json({ error: "List not found" }, { status: 404 });

    // Ownership check
    const board = await prisma.board.findUnique({
      where: { id: list.boardId },
    });
    if (board?.ownerId !== userId) return unauthorized("Not allowed");

    const updateList = await prisma.list.update({
      where: { id: listId },
      data: { title, position },
    });

    return apiSuccess(updateList, "List updated");
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const listId = parseInt(params.id);
    const userId = getDataFromToken(req);
    if (!userId) return unauthorized("No token");

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list)
      return NextResponse.json({ message: "List not found" }, { status: 404 });

    const board = await prisma.board.findUnique({
      where: { id: list.boardId },
    });
    if (board?.ownerId !== userId) return unauthorized("Not allowed");

    const deleteList = await prisma.list.delete({ where: { id: listId } });
    return apiSuccess(deleteList, "List deleted");
  } catch (error) {
    return handleError(error);
  }
}
