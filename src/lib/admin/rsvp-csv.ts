import {
  formatHotelCheckInDates,
  hotelNightCount,
} from "@/lib/wedding";
import type { RSVPResponse } from "@/lib/types";

const CSV_HEADERS = [
  "Submitted",
  "Name",
  "Attending",
  "Guests",
  "Hotel",
  "Check-in Dates",
  "Hotel Guests",
  "Nights",
  "Arrival Time",
  "Flight",
  "Flight Arrival",
  "Airport",
  "Dietary",
  "Note",
] as const;

function csvCell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function buildRsvpCsv(responses: RSVPResponse[]) {
  const rows = responses.map((response) => [
    response.created_at,
    response.full_name,
    response.attending ? "Yes" : "No",
    response.num_guests,
    response.hotel_needed ? "Yes" : "No",
    response.hotel_needed
      ? formatHotelCheckInDates(response.hotel_check_in_dates)
      : "",
    response.hotel_needed ? (response.hotel_num_guests ?? "") : "",
    response.hotel_needed ? hotelNightCount(response.hotel_check_in_dates) : "",
    response.arrival_time ?? "",
    response.flight_number ?? "",
    response.flight_arrival_time ?? "",
    response.arriving_airport ?? "",
    response.dietary_requirements ?? "",
    response.note_to_couple ?? "",
  ]);

  const csv = [CSV_HEADERS, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  return `\uFEFF${csv}`;
}

export function downloadRsvpCsv(responses: RSVPResponse[]) {
  const csv = buildRsvpCsv(responses);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `rsvp-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
