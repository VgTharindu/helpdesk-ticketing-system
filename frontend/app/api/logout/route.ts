import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/config/env";

const TOKEN_COOKIE_NAME = "helpdesk_token";

export async function POST() {
  const token = (await cookies()).get(TOKEN_COOKIE_NAME)?.value;

  if (token) {
    await fetch(`${env.apiUrl}/logout`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => null);
  }

  (await cookies()).delete(TOKEN_COOKIE_NAME);

  return NextResponse.json({ message: "Logged out successfully." }, { status: 200 });
}