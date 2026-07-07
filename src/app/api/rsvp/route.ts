import { NextResponse } from "next/server";
import { clientIp, checkRateLimit } from "@/lib/rsvp/rate-limit";
import { getRsvpStorage } from "@/lib/rsvp/storage";
import { formToInsertPayload } from "@/lib/rsvp/types";
import { validateRsvpForm } from "@/lib/rsvp/validate";
import type { RSVPFormData } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests — please try again in a minute" },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as RSVPFormData;
    const validationError = validateRsvpForm(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const storage = getRsvpStorage();
    const payload = formToInsertPayload(body);
    const { id } = await storage.insert(payload);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("RSVP insert error:", error);
    return NextResponse.json(
      { error: "Failed to save your response" },
      { status: 500 },
    );
  }
}
