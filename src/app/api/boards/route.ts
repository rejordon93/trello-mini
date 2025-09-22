import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";

type BoardType = {
  title: string;
};

export async function POST(req: NextRequest) {
  try {
    const boardBody: BoardType = await req.json();
    const { title } = boardBody;

    if (!title) {
      return NextResponse.json({ error: "Missing Title" }, { status: 400 });
    }

    const userId = getDataFromToken(req);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "No User!" }, { status: 401 });
    }

    const createBoard = await prisma.board.create({
      data: {
        title,
        ownerId: user.id, // link board to user
      },
    });

    return NextResponse.json({
      message: "New Board is created",
      board: createBoard,
    });
  } catch (error) {
    console.error("Error creating board:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
