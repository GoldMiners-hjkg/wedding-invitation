import { mkdirSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { DatabaseSync } from "node:sqlite";
import type { RSVPResponse } from "@/lib/types";
import { mapRowToRsvpResponse } from "../map-response";
import type { RsvpInsertPayload, RsvpStorage } from "../types";

const INIT_SQL = `
create table if not exists rsvp_responses (
  id text primary key,
  full_name text not null,
  attending integer not null,
  num_guests integer not null default 1,
  hotel_needed integer not null default 0,
  hotel_check_in_time text,
  hotel_check_out_time text,
  hotel_num_guests integer,
  hotel_num_nights integer,
  arrival_time text,
  flight_number text,
  flight_arrival_time text,
  arriving_airport text,
  dietary_requirements text,
  note_to_couple text,
  created_at text not null default (datetime('now'))
);
create index if not exists rsvp_responses_created_at_idx
  on rsvp_responses (created_at desc);
`;

let db: DatabaseSync | null = null;

function getDb() {
  if (!db) {
    const fileName = process.env.SQLITE_PATH || "rsvp.db";
    const path = join(/* turbopackIgnore: true */ process.cwd(), "data", fileName);
    mkdirSync(join(process.cwd(), "data"), { recursive: true });
    db = new DatabaseSync(path);
    db.exec(INIT_SQL);
  }
  return db;
}

function rowToResponse(row: Record<string, unknown>): RSVPResponse {
  return mapRowToRsvpResponse({
    id: row.id as string,
    full_name: row.full_name as string,
    attending: Boolean(row.attending),
    num_guests: row.num_guests as number,
    hotel_needed: Boolean(row.hotel_needed),
    hotel_check_in_time: row.hotel_check_in_time as string | null,
    hotel_num_guests: row.hotel_num_guests as number | null,
    arrival_time: row.arrival_time as string | null,
    flight_number: row.flight_number as string | null,
    flight_arrival_time: row.flight_arrival_time as string | null,
    arriving_airport: row.arriving_airport as string | null,
    dietary_requirements: row.dietary_requirements as string | null,
    note_to_couple: row.note_to_couple as string | null,
    created_at: row.created_at as string,
  });
}

export function createSqliteStorage(): RsvpStorage {
  return {
    driver: "sqlite",

    async insert(payload: RsvpInsertPayload) {
      const id = randomUUID();
      const database = getDb();
      database
        .prepare(
          `insert into rsvp_responses (
            id, full_name, attending, num_guests, hotel_needed,
            hotel_check_in_time, hotel_num_guests,
            arrival_time, flight_number, flight_arrival_time, arriving_airport,
            dietary_requirements, note_to_couple
          ) values (
            ?, ?, ?, ?, ?,
            ?, ?,
            ?, ?, ?, ?,
            ?, ?
          )`,
        )
        .run(
          id,
          payload.full_name,
          payload.attending ? 1 : 0,
          payload.num_guests,
          payload.hotel_needed ? 1 : 0,
          payload.hotel_check_in_time,
          payload.hotel_num_guests,
          payload.arrival_time,
          payload.flight_number,
          payload.flight_arrival_time,
          payload.arriving_airport,
          payload.dietary_requirements,
          payload.note_to_couple,
        );
      return { id };
    },

    async getById(id: string) {
      const database = getDb();
      const row = database
        .prepare("select * from rsvp_responses where id = ?")
        .get(id);
      return row
        ? rowToResponse(row as unknown as Record<string, unknown>)
        : null;
    },

    async update(id: string, payload: RsvpInsertPayload) {
      const database = getDb();
      const result = database
        .prepare(
          `update rsvp_responses set
            full_name = ?, attending = ?, num_guests = ?, hotel_needed = ?,
            hotel_check_in_time = ?,
            hotel_num_guests = ?,
            arrival_time = ?, flight_number = ?, flight_arrival_time = ?,
            arriving_airport = ?, dietary_requirements = ?, note_to_couple = ?
          where id = ?`,
        )
        .run(
          payload.full_name,
          payload.attending ? 1 : 0,
          payload.num_guests,
          payload.hotel_needed ? 1 : 0,
          payload.hotel_check_in_time,
          payload.hotel_num_guests,
          payload.arrival_time,
          payload.flight_number,
          payload.flight_arrival_time,
          payload.arriving_airport,
          payload.dietary_requirements,
          payload.note_to_couple,
          id,
        );
      if (result.changes === 0) return null;
      return this.getById(id);
    },

    async delete(id: string) {
      const database = getDb();
      const result = database
        .prepare("delete from rsvp_responses where id = ?")
        .run(id);
      return result.changes > 0;
    },

    async list(): Promise<RSVPResponse[]> {
      const database = getDb();
      const rows = database
        .prepare("select * from rsvp_responses order by created_at desc")
        .all();
      return rows.map((row) =>
        rowToResponse(row as unknown as Record<string, unknown>),
      );
    },

    async ping() {
      try {
        getDb().prepare("select 1").get();
        return true;
      } catch {
        return false;
      }
    },
  };
}
