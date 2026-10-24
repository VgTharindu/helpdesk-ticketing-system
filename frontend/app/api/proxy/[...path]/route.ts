import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

const TOKEN_COOKIE_NAME = "helpdesk_token";

async function forward(request: NextRequest, path: string[]): Promise<NextResponse> {
  const token = (await cookies()).get(TOKEN_COOKIE_NAME)?.value;
  const targetPath = path.join("/");
  const search = request.nextUrl.search;
  const url = `${env.apiUrl}/${targetPath}${search}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const hasBody = request.method !== "GET" && request.method !== "DELETE";
  const body = hasBody ? await request.text() : undefined;

  const backendResponse = await fetch(url, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  const responseBody = await backendResponse.text();

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path);
}