import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { getRsvpStorage } from "@/lib/rsvp/storage";
import { formToInsertPayload } from "@/lib/rsvp/types";
import { validateRsvpForm } from "@/lib/rsvp/validate";
import type { RSVPFormData } from "@/lib/types";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context.params;

  try {
    const storage = getRsvpStorage();
    const response = await storage.getById(id);
    if (!response) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Admin get RSVP error:", error);
    return NextResponse.json(
      { error: "Failed to fetch response" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context.params;

  try {
    const body = (await request.json()) as RSVPFormData;
    const validationError = validateRsvpForm(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const storage = getRsvpStorage();
    const payload = formToInsertPayload(body);
    const response = await storage.update(id, payload);
    if (!response) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("Admin update RSVP error:", error);
    return NextResponse.json(
      { error: "Failed to update response" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context.params;

  try {
    const storage = getRsvpStorage();
    const deleted = await storage.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete RSVP error:", error);
    return NextResponse.json(
      { error: "Failed to delete response" },
      { status: 500 },
    );
  }
}
