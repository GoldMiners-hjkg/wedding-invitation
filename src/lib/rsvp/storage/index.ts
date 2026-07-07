import { DEMO_MODE } from "@/lib/demo";
import type { RsvpStorage, RsvpStorageDriver } from "../types";
import { createDemoStorage } from "./demo";
import { createPostgresStorage } from "./postgres";
import { createSqliteStorage } from "./sqlite";
import { createSupabaseStorage } from "./supabase";

function resolveDriver(): RsvpStorageDriver {
  const configured = process.env.RSVP_STORAGE?.toLowerCase();

  if (configured === "demo" || DEMO_MODE) return "demo";
  if (configured === "postgres" && process.env.DATABASE_URL) return "postgres";
  if (configured === "sqlite") return "sqlite";
  if (configured === "supabase") return "supabase";

  // auto — prefer Postgres (works with Supabase direct URL, Aliyun RDS, HK/SG hosts)
  if (process.env.DATABASE_URL) return "postgres";
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return "supabase";
  }
  if (configured === "sqlite" || process.env.SQLITE_PATH) {
    return "sqlite";
  }

  return "demo";
}

let storage: RsvpStorage | null = null;

export function getRsvpStorage(): RsvpStorage {
  if (!storage) {
    const driver = resolveDriver();
    switch (driver) {
      case "postgres":
        storage = createPostgresStorage();
        break;
      case "sqlite":
        storage = createSqliteStorage();
        break;
      case "supabase":
        storage = createSupabaseStorage();
        break;
      default:
        storage = createDemoStorage();
    }
  }
  return storage;
}

export function getRsvpStorageDriver(): RsvpStorageDriver {
  return getRsvpStorage().driver;
}
