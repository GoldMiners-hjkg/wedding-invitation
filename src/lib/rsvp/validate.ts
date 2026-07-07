import type { RSVPFormData } from "@/lib/types";

export function validateRsvpForm(body: RSVPFormData): string | null {
  if (!body.full_name?.trim()) {
    return "Full name is required";
  }

  if (body.attending === null || body.attending === undefined) {
    return "Please indicate whether you are attending";
  }

  if (body.num_guests != null && (body.num_guests < 1 || body.num_guests > 10)) {
    return "Invalid guest count";
  }

  if (body.full_name.trim().length > 200) {
    return "Name is too long";
  }

  if (
    body.hotel_needed &&
    body.attending &&
    (!body.hotel_check_in_dates || body.hotel_check_in_dates.length === 0)
  ) {
    return "Please select a check-in date";
  }

  return null;
}
