import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { getRsvpStorage } from "@/lib/rsvp/storage";

export const runtime = "nodejs";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const storage = getRsvpStorage();
    const responses = await storage.list();
    return NextResponse.json({ responses });
  } catch (error) {
    console.error("Admin fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 },
    );
  }
}
