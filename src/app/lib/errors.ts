// lib/api.ts
import { NextResponse } from "next/server";
import { z } from "zod";

export const apiError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

export const badRequest = (message: string) => apiError(message, 400);
export const notFound = (message: string) => apiError(message, 404);
export const conflict = (message: string) => apiError(message, 409);
export const unauthorized = (message: string) => apiError(message, 401);
export const forbidden = (message: string) => apiError(message, 403);

export function handleError(error: unknown): NextResponse {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  console.error("API Error:", error);
  return apiError("Internal server error", 500);
}

export const apiSuccess = (data: unknown, message = "OK", status = 200) =>
  NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
