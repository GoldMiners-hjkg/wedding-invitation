import { NextResponse } from "next/server";
import { getRsvpStorage, getRsvpStorageDriver } from "@/lib/rsvp/storage";

export const runtime = "nodejs";

/** Public health check — guests in China only need this same-origin API, not Supabase */
export async function GET() {
  try {
    const storage = getRsvpStorage();
    const ok = await storage.ping();

    return NextResponse.json({
      ok,
      driver: getRsvpStorageDriver(),
      /** RSVP submits via POST /api/rsvp on your domain — no blocked third-party calls from the browser */
      guestAccess: "same-origin-api",
    });
  } catch (error) {
    console.error("RSVP health error:", error);
    return NextResponse.json(
      { ok: false, driver: getRsvpStorageDriver(), guestAccess: "same-origin-api" },
      { status: 503 },
    );
  }
}
