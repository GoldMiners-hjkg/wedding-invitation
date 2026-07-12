import {
  formatHotelCheckInDates,
  hotelNightCount,
  parseHotelCheckInDates,
} from "@/lib/wedding";
import type { RSVPResponse } from "@/lib/types";

/** Map DB row (hotel_check_in_time CSV) → API response */
export function mapRowToRsvpResponse(row: {
  id: string;
  full_name: string;
  attending: boolean;
  num_guests: number;
  hotel_needed: boolean;
  hotel_check_in_time?: string | null;
  hotel_num_guests?: number | null;
  hotel_num_nights?: number | null;
  arrival_time?: string | null;
  flight_number?: string | null;
  flight_arrival_time?: string | null;
  arriving_airport?: string | null;
  dietary_requirements?: string | null;
  note_to_couple?: string | null;
  created_at: string;
}): RSVPResponse {
  const hotel_check_in_dates = parseHotelCheckInDates(row.hotel_check_in_time);
  const nightsFromDates = hotelNightCount(hotel_check_in_dates);

  return {
    id: row.id,
    full_name: row.full_name,
    attending: row.attending,
    num_guests: row.num_guests,
    hotel_needed: row.hotel_needed,
    hotel_check_in_dates,
    hotel_num_guests: row.hotel_num_guests ?? 1,
    hotel_num_nights: row.hotel_needed
      ? (row.hotel_num_nights ?? nightsFromDates)
      : null,
    arrival_time: row.arrival_time ?? "",
    flight_number: row.flight_number ?? "",
    flight_arrival_time: row.flight_arrival_time ?? "",
    arriving_airport: row.arriving_airport ?? "",
    dietary_requirements: row.dietary_requirements ?? "",
    note_to_couple: row.note_to_couple ?? "",
    created_at: row.created_at,
  };
}

/** Compact hotel booking summary for admin tables */
export function formatHotelBookingSummary(response: RSVPResponse): string {
  if (!response.hotel_needed) return "—";
  const nights =
    response.hotel_num_nights ?? hotelNightCount(response.hotel_check_in_dates);
  const dates = formatHotelCheckInDates(response.hotel_check_in_dates);
  const guests = response.hotel_num_guests ?? 1;
  const nightLabel = nights === 1 ? "1 night" : `${nights} nights`;
  return dates
    ? `${nightLabel} · ${dates} · ${guests}p`
    : `${nightLabel} · ${guests}p`;
}
