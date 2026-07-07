import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, adminCookieOptions } from "@/lib/admin-auth";

function isValidPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  return Boolean(adminPassword && password === adminPassword);
}

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };

  if (!password || !isValidPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "authenticated", adminCookieOptions());

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
