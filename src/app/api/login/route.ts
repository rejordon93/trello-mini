// /api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.TOKEN_SECRET!,
      { expiresIn: "1h" }
    );

    const res = NextResponse.json({ message: "Login successful" });
    // Set cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
