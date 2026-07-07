import postgres from "postgres";
import type { RSVPResponse } from "@/lib/types";
import { mapRowToRsvpResponse } from "../map-response";
import type { RsvpInsertPayload, RsvpStorage } from "../types";

const INIT_SQL = `
create table if not exists rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  attending boolean not null,
  num_guests integer not null default 1,
  hotel_needed boolean not null default false,
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
  created_at timestamptz not null default now()
);
create index if not exists rsvp_responses_created_at_idx
  on rsvp_responses (created_at desc);
`;

let sql: ReturnType<typeof postgres> | null = null;
let initialized = false;

function getSql() {
  if (!sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    sql = postgres(url, {
      ssl: process.env.DATABASE_SSL === "false" ? false : "prefer",
      max: 5,
      idle_timeout: 20,
    });
  }
  return sql;
}

async function ensureSchema() {
  if (initialized) return;
  const db = getSql();
  await db.unsafe(INIT_SQL);
  initialized = true;
}

export function createPostgresStorage(): RsvpStorage {
  return {
    driver: "postgres",

    async insert(payload: RsvpInsertPayload) {
      await ensureSchema();
      const db = getSql();
      const [row] = await db<{ id: string }[]>`
        insert into rsvp_responses ${db(payload)}
        returning id
      `;
      return { id: row.id };
    },

    async getById(id: string) {
      await ensureSchema();
      const db = getSql();
      const rows = await db<Record<string, unknown>[]>`
        select * from rsvp_responses where id = ${id} limit 1
      `;
      return rows[0] ? mapRowToRsvpResponse(rows[0] as never) : null;
    },

    async update(id: string, payload: RsvpInsertPayload) {
      await ensureSchema();
      const db = getSql();
      const rows = await db<Record<string, unknown>[]>`
        update rsvp_responses set ${db(payload)}
        where id = ${id}
        returning *
      `;
      return rows[0] ? mapRowToRsvpResponse(rows[0] as never) : null;
    },

    async delete(id: string) {
      await ensureSchema();
      const db = getSql();
      const rows = await db<{ id: string }[]>`
        delete from rsvp_responses where id = ${id} returning id
      `;
      return rows.length > 0;
    },

    async list(): Promise<RSVPResponse[]> {
      await ensureSchema();
      const db = getSql();
      const rows = await db<Record<string, unknown>[]>`
        select * from rsvp_responses
        order by created_at desc
      `;
      return rows.map((row) => mapRowToRsvpResponse(row as never));
    },

    async ping() {
      try {
        await ensureSchema();
        const db = getSql();
        await db`select 1 as ok`;
        return true;
      } catch {
        return false;
      }
    },
  };
}
