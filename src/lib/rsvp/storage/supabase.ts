import { createAdminSupabase } from "@/lib/supabase-admin";
import type { RSVPResponse } from "@/lib/types";
import { mapRowToRsvpResponse } from "../map-response";
import type { RsvpInsertPayload, RsvpStorage } from "../types";

export function createSupabaseStorage(): RsvpStorage {
  return {
    driver: "supabase",

    async insert(payload: RsvpInsertPayload) {
      const supabase = createAdminSupabase();
      const { data, error } = await supabase
        .from("rsvp_responses")
        .insert(payload)
        .select("id")
        .single();

      if (error) throw error;
      return { id: data.id as string };
    },

    async getById(id: string) {
      const supabase = createAdminSupabase();
      const { data, error } = await supabase
        .from("rsvp_responses")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapRowToRsvpResponse(data as never) : null;
    },

    async update(id: string, payload: RsvpInsertPayload) {
      const supabase = createAdminSupabase();
      const { data, error } = await supabase
        .from("rsvp_responses")
        .update(payload)
        .eq("id", id)
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data ? mapRowToRsvpResponse(data as never) : null;
    },

    async delete(id: string) {
      const supabase = createAdminSupabase();
      const { error, count } = await supabase
        .from("rsvp_responses")
        .delete({ count: "exact" })
        .eq("id", id);

      if (error) throw error;
      return (count ?? 0) > 0;
    },

    async list(): Promise<RSVPResponse[]> {
      const supabase = createAdminSupabase();
      const { data, error } = await supabase
        .from("rsvp_responses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map((row) => mapRowToRsvpResponse(row as never));
    },

    async ping() {
      try {
        const supabase = createAdminSupabase();
        const { error } = await supabase.from("rsvp_responses").select("id").limit(1);
        return !error;
      } catch {
        return false;
      }
    },
  };
}
