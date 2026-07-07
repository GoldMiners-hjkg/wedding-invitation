import type { RSVPFormData, RSVPResponse } from "@/lib/types";
import { serializeHotelCheckInDates } from "@/lib/wedding";

export type RsvpStorageDriver = "supabase" | "postgres" | "sqlite" | "demo";

export interface RsvpInsertPayload {
  full_name: string;
  attending: boolean;
  num_guests: number;
  hotel_needed: boolean;
  hotel_check_in_time: string | null;
  hotel_num_guests: number | null;
  arrival_time: string | null;
  flight_number: string | null;
  flight_arrival_time: string | null;
  arriving_airport: string | null;
  dietary_requirements: string | null;
  note_to_couple: string | null;
}

export interface RsvpStorage {
  driver: RsvpStorageDriver;
  insert(payload: RsvpInsertPayload): Promise<{ id: string }>;
  getById(id: string): Promise<RSVPResponse | null>;
  update(id: string, payload: RsvpInsertPayload): Promise<RSVPResponse | null>;
  delete(id: string): Promise<boolean>;
  list(): Promise<RSVPResponse[]>;
  ping(): Promise<boolean>;
}

export function formToInsertPayload(body: RSVPFormData): RsvpInsertPayload {
  const hotelDates =
    body.hotel_needed && body.hotel_check_in_dates.length > 0
      ? serializeHotelCheckInDates(body.hotel_check_in_dates)
      : null;

  return {
    full_name: body.full_name.trim(),
    attending: body.attending!,
    num_guests: body.num_guests ?? 1,
    hotel_needed: body.hotel_needed ?? false,
    hotel_check_in_time: hotelDates,
    hotel_num_guests: body.hotel_needed ? (body.hotel_num_guests ?? 1) : null,
    arrival_time: body.arrival_time || null,
    flight_number: body.flight_number?.trim() || null,
    flight_arrival_time: body.flight_arrival_time?.trim() || null,
    arriving_airport: body.arriving_airport?.trim() || null,
    dietary_requirements: body.dietary_requirements?.trim() || null,
    note_to_couple: body.note_to_couple?.trim() || null,
  };
}
