import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

const TOKEN_COOKIE_NAME = "helpdesk_token";

export async function POST(request: NextRequest) {
  const credentials = await request.json();

  const backendResponse = await fetch(`${env.apiUrl}/login`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  const body = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(body, { status: backendResponse.status });
  }

  const payload = body as { data: { user: unknown; token: string } };

  (await cookies()).set(TOKEN_COOKIE_NAME, payload.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ data: { user: payload.data.user } }, { status: 200 });
}