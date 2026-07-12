import { DEMO_RSVP_RESPONSES } from "@/lib/demo";
import { randomUUID } from "crypto";
import { parseHotelCheckInDates } from "@/lib/wedding";
import type { RSVPResponse } from "@/lib/types";
import type { RsvpInsertPayload, RsvpStorage } from "../types";

const demoStore: RSVPResponse[] = [...DEMO_RSVP_RESPONSES];

function payloadToResponse(id: string, payload: RsvpInsertPayload): RSVPResponse {
  const hotel_check_in_dates = parseHotelCheckInDates(payload.hotel_check_in_time);
  return {
    id,
    full_name: payload.full_name,
    attending: payload.attending,
    num_guests: payload.num_guests,
    hotel_needed: payload.hotel_needed,
    hotel_check_in_dates,
    hotel_num_guests: payload.hotel_num_guests ?? 1,
    hotel_num_nights: payload.hotel_needed
      ? (payload.hotel_num_nights ?? hotel_check_in_dates.length)
      : null,
    arrival_time: payload.arrival_time ?? "",
    flight_number: payload.flight_number ?? "",
    flight_arrival_time: payload.flight_arrival_time ?? "",
    arriving_airport: payload.arriving_airport ?? "",
    dietary_requirements: payload.dietary_requirements ?? "",
    note_to_couple: payload.note_to_couple ?? "",
    created_at: new Date().toISOString(),
  };
}

export function createDemoStorage(): RsvpStorage {
  return {
    driver: "demo",

    async insert(payload: RsvpInsertPayload) {
      const id = randomUUID();
      demoStore.unshift(payloadToResponse(id, payload));
      return { id };
    },

    async getById(id: string) {
      return demoStore.find((row) => row.id === id) ?? null;
    },

    async update(id: string, payload: RsvpInsertPayload) {
      const index = demoStore.findIndex((row) => row.id === id);
      if (index === -1) return null;

      demoStore[index] = {
        ...payloadToResponse(id, payload),
        created_at: demoStore[index].created_at,
      };
      return demoStore[index];
    },

    async delete(id: string) {
      const index = demoStore.findIndex((row) => row.id === id);
      if (index === -1) return false;
      demoStore.splice(index, 1);
      return true;
    },

    async list() {
      return [...demoStore];
    },

    async ping() {
      return true;
    },
  };
}
