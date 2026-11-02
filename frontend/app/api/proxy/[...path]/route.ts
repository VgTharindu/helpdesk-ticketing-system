import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

const TOKEN_COOKIE_NAME = "helpdesk_token";

// Response headers passed back to the browser (needed for file downloads)
const PASS_THROUGH_HEADERS = ["content-type", "content-disposition"];

async function forward(request: NextRequest, path: string[]): Promise<NextResponse> {
  const token = (await cookies()).get(TOKEN_COOKIE_NAME)?.value;
  const targetPath = path.join("/");
  const search = request.nextUrl.search;
  const url = `${env.apiUrl}/${targetPath}${search}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  // Keep the original content type (JSON or multipart with its boundary)
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const hasBody = request.method !== "GET" && request.method !== "DELETE";
  // Raw bytes, so file uploads are not corrupted
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const backendResponse = await fetch(url, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  const responseBody = await backendResponse.arrayBuffer();

  const responseHeaders = new Headers();
  PASS_THROUGH_HEADERS.forEach((name) => {
    const value = backendResponse.headers.get(name);
    if (value) {
      responseHeaders.set(name, value);
    }
  });

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
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