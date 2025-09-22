import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type tokenProps = {
  id: number;
};

export const getDataFromToken = (request: NextRequest) => {
  try {
    // Retrieve the token from cookies
    const token = request.cookies.get("token")?.value || "";

    // Decode the token
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as tokenProps;

    return decodedToken.id;
  } catch (error: any) {
    // Handle errors
    console.error("Token verification failed:", error.message);
    throw new Error("Invalid token");
  }
};
