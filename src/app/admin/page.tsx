"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { RsvpEditPanel } from "@/components/admin/RsvpEditPanel";
import {
  formatHotelCheckInDates,
  hotelNightCount,
} from "@/lib/wedding";
import type { RSVPResponse } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function normalizeName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

type NameGroup = {
  key: string;
  displayName: string;
  entries: RSVPResponse[];
};

function buildNameGroups(
  responses: RSVPResponse[],
  sortAsc: boolean,
): NameGroup[] {
  const map = new Map<string, RSVPResponse[]>();

  for (const response of responses) {
    const key = normalizeName(response.full_name);
    const list = map.get(key) ?? [];
    list.push(response);
    map.set(key, list);
  }

  const groups: NameGroup[] = [];

  for (const [key, entries] of map) {
    const timeline = [...entries].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    groups.push({
      key,
      displayName: timeline[timeline.length - 1]?.full_name ?? entries[0].full_name,
      entries: timeline,
    });
  }

  groups.sort((a, b) => {
    const latestA = new Date(
      a.entries[a.entries.length - 1].created_at,
    ).getTime();
    const latestB = new Date(
      b.entries[b.entries.length - 1].created_at,
    ).getTime();
    return sortAsc ? latestA - latestB : latestB - latestA;
  });

  return groups;
}

function exportCSV(responses: RSVPResponse[]) {
  const headers = [
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
  ];

  const rows = responses.map((r) => [
    r.created_at,
    r.full_name,
    r.attending ? "Yes" : "No",
    r.num_guests,
    r.hotel_needed ? "Yes" : "No",
    r.hotel_needed
      ? formatHotelCheckInDates(r.hotel_check_in_dates)
      : "",
    r.hotel_needed ? (r.hotel_num_guests ?? "") : "",
    r.hotel_needed ? hotelNightCount(r.hotel_check_in_dates) : "",
    r.arrival_time ?? "",
    r.flight_number ?? "",
    r.flight_arrival_time ?? "",
    r.arriving_airport ?? "",
    r.dietary_requirements ?? "",
    r.note_to_couple ?? "",
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `rsvp-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [responses, setResponses] = useState<RSVPResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");
  const [attendingFilter, setAttendingFilter] = useState<
    "all" | "yes" | "no"
  >("all");
  const [editing, setEditing] = useState<RSVPResponse | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(),
  );

  const fetchResponses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/responses");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setResponses(data.responses ?? []);
      setAuthenticated(true);
    } catch {
      setLoginError("Failed to load responses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Invalid password");
      return;
    }
    setAuthenticated(true);
    fetchResponses();
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setPassword("");
    setResponses([]);
    setEditing(null);
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return responses.filter((r) => {
      if (attendingFilter === "yes" && !r.attending) return false;
      if (attendingFilter === "no" && r.attending) return false;
      if (!query) return true;
      return (
        r.full_name.toLowerCase().includes(query) ||
        r.flight_number?.toLowerCase().includes(query) ||
        r.dietary_requirements?.toLowerCase().includes(query) ||
        r.note_to_couple?.toLowerCase().includes(query)
      );
    });
  }, [responses, search, attendingFilter]);

  const exportRows = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const diff =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return sortAsc ? diff : -diff;
      }),
    [filtered, sortAsc],
  );

  const nameGroups = useMemo(
    () => buildNameGroups(filtered, sortAsc),
    [filtered, sortAsc],
  );

  function toggleGroup(key: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function renderResponseCells(
    response: RSVPResponse,
    options: { showName?: boolean; displayName?: string } = {},
  ) {
    const { showName = true, displayName } = options;

    return (
      <>
        <td className="px-4 py-3 text-ivory/60">
          {formatDate(response.created_at)}
        </td>
        <td className="px-4 py-3 text-ivory">
          {showName ? displayName ?? response.full_name : null}
        </td>
        <td className="px-4 py-3">
          <span className={response.attending ? "text-sage" : "text-blush"}>
            {response.attending ? "Yes" : "No"}
          </span>
        </td>
        <td className="px-4 py-3 text-ivory/70">{response.num_guests}</td>
        <td className="px-4 py-3 text-ivory/70">
          {response.hotel_needed ? "Yes" : "—"}
        </td>
        <td className="px-4 py-3 text-ivory/70">
          {response.arrival_time || "—"}
        </td>
        <td className="max-w-[140px] truncate px-4 py-3 text-ivory/70">
          {response.dietary_requirements || "—"}
        </td>
        <td className="max-w-[140px] truncate px-4 py-3 text-ivory/70">
          {response.note_to_couple || "—"}
        </td>
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={() => setEditing(response)}
            className="rounded-full border border-gold/30 px-3 py-1 font-body text-[10px] tracking-wide text-gold uppercase"
          >
            Edit
          </button>
        </td>
      </>
    );
  }

  const attendingCount = responses.filter((r) => r.attending).length;
  const guestCount = responses
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + r.num_guests, 0);

  if (!authenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ink px-5">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-ivory/10 bg-ivory/5 p-8"
        >
          <h1 className="font-heading text-2xl text-ivory italic">Admin</h1>
          <p className="mt-2 font-body text-sm text-ivory/50">
            Enter the admin password to view and edit RSVPs.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-6 w-full rounded-xl border border-ivory/15 bg-ink px-4 py-3 font-body text-sm text-ivory outline-none focus:border-gold/50"
            placeholder="Password"
          />
          {loginError && (
            <p className="mt-2 font-body text-xs text-blush">{loginError}</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-gold py-3 font-body text-sm tracking-wide text-ink uppercase"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-ink px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl text-ivory italic">
              RSVP Responses
            </h1>
            <p className="mt-1 font-body text-sm text-ivory/50">
              {responses.length} responses · {nameGroups.length} guests ·{" "}
              {attendingCount} attending · {guestCount} total guests
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => exportCSV(exportRows)}
              disabled={responses.length === 0}
              className="rounded-full border border-gold/40 px-5 py-2 font-body text-xs tracking-wide text-gold uppercase disabled:opacity-40"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-ivory/20 px-5 py-2 font-body text-xs tracking-wide text-ivory/60 uppercase"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, flight, notes..."
            className="min-w-[220px] flex-1 rounded-full border border-ivory/15 bg-ivory/5 px-4 py-2 font-body text-sm text-ivory outline-none focus:border-gold/40"
          />
          <div className="flex rounded-full border border-ivory/15 p-1">
            {(
              [
                ["all", "All"],
                ["yes", "Attending"],
                ["no", "Not attending"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setAttendingFilter(value)}
                className={`rounded-full px-4 py-1.5 font-body text-xs ${
                  attendingFilter === value
                    ? "bg-gold/15 text-gold"
                    : "text-ivory/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="mt-12 text-center font-body text-ivory/40">Loading...</p>
        ) : nameGroups.length === 0 ? (
          <p className="mt-12 text-center font-body text-ivory/40">
            {responses.length === 0
              ? "No responses yet."
              : "No responses match your filters."}
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-ivory/10">
            <table className="w-full min-w-[980px] text-left font-body text-sm">
              <thead>
                <tr className="border-b border-ivory/10 bg-ivory/5">
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSortAsc((v) => !v)}
                      className="text-xs tracking-wide text-gold uppercase"
                    >
                      Date {sortAsc ? "↑" : "↓"}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-xs tracking-wide text-ivory/50 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs tracking-wide text-ivory/50 uppercase">
                    Attending
                  </th>
                  <th className="px-4 py-3 text-xs tracking-wide text-ivory/50 uppercase">
                    Guests
                  </th>
                  <th className="px-4 py-3 text-xs tracking-wide text-ivory/50 uppercase">
                    Hotel
                  </th>
                  <th className="px-4 py-3 text-xs tracking-wide text-ivory/50 uppercase">
                    Arrival
                  </th>
                  <th className="px-4 py-3 text-xs tracking-wide text-ivory/50 uppercase">
                    Dietary
                  </th>
                  <th className="px-4 py-3 text-xs tracking-wide text-ivory/50 uppercase">
                    Note
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {nameGroups.map((group) => {
                  const latest = group.entries[group.entries.length - 1];
                  const isMulti = group.entries.length > 1;
                  const expanded = expandedGroups.has(group.key);

                  if (!isMulti) {
                    return (
                      <tr
                        key={latest.id}
                        className="border-b border-ivory/5 hover:bg-ivory/5"
                      >
                        {renderResponseCells(latest, {
                          displayName: group.displayName,
                        })}
                      </tr>
                    );
                  }

                  return (
                    <Fragment key={group.key}>
                      <tr
                        className={`border-b border-ivory/5 ${
                          isMulti ? "bg-ivory/[0.03]" : ""
                        } hover:bg-ivory/5`}
                      >
                        {expanded ? (
                          <>
                            <td className="px-4 py-3 text-ivory/60" colSpan={2}>
                              <button
                                type="button"
                                onClick={() => toggleGroup(group.key)}
                                className="flex items-center gap-2 text-left"
                              >
                                <span
                                  className="inline-block text-gold transition-transform"
                                  style={{ transform: "rotate(90deg)" }}
                                >
                                  ▶
                                </span>
                                <span className="text-ivory">
                                  {group.displayName}
                                </span>
                                <span className="rounded-full bg-gold/15 px-2 py-0.5 font-body text-[10px] text-gold">
                                  {group.entries.length} submissions
                                </span>
                              </button>
                            </td>
                            <td
                              className="px-4 py-3 text-xs text-ivory/40"
                              colSpan={7}
                            >
                              Timeline · oldest → newest
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-ivory/60">
                              <button
                                type="button"
                                onClick={() => toggleGroup(group.key)}
                                className="flex items-center gap-2 text-left"
                              >
                                <span className="inline-block text-gold">▶</span>
                                <span>{formatDate(latest.created_at)}</span>
                              </button>
                            </td>
                            <td className="px-4 py-3 text-ivory">
                              <button
                                type="button"
                                onClick={() => toggleGroup(group.key)}
                                className="flex items-center gap-2 text-left"
                              >
                                <span>{group.displayName}</span>
                                <span className="rounded-full bg-gold/15 px-2 py-0.5 font-body text-[10px] text-gold">
                                  {group.entries.length}×
                                </span>
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={
                                  latest.attending ? "text-sage" : "text-blush"
                                }
                              >
                                {latest.attending ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-ivory/70">
                              {latest.num_guests}
                            </td>
                            <td className="px-4 py-3 text-ivory/70">
                              {latest.hotel_needed ? "Yes" : "—"}
                            </td>
                            <td className="px-4 py-3 text-ivory/70">
                              {latest.arrival_time || "—"}
                            </td>
                            <td className="max-w-[140px] truncate px-4 py-3 text-ivory/70">
                              {latest.dietary_requirements || "—"}
                            </td>
                            <td className="max-w-[140px] truncate px-4 py-3 text-ivory/70">
                              {latest.note_to_couple || "—"}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => setEditing(latest)}
                                className="rounded-full border border-gold/30 px-3 py-1 font-body text-[10px] tracking-wide text-gold uppercase"
                              >
                                Edit
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                      {expanded &&
                        group.entries.map((response, index) => (
                          <tr
                            key={response.id}
                            className="border-b border-ivory/5 hover:bg-ivory/5"
                          >
                            <td className="relative px-4 py-3 pl-10 text-ivory/60">
                              <span
                                className="absolute top-0 bottom-0 left-5 w-px bg-gold/25"
                                aria-hidden
                              />
                              <span
                                className="absolute top-1/2 left-[18px] h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold/60"
                                aria-hidden
                              />
                              {formatDate(response.created_at)}
                              {index === group.entries.length - 1 && (
                                <span className="ml-2 font-body text-[10px] tracking-wide text-gold uppercase">
                                  Latest
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-ivory/50">—</td>
                            <td className="px-4 py-3">
                              <span
                                className={
                                  response.attending
                                    ? "text-sage"
                                    : "text-blush"
                                }
                              >
                                {response.attending ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-ivory/70">
                              {response.num_guests}
                            </td>
                            <td className="px-4 py-3 text-ivory/70">
                              {response.hotel_needed ? "Yes" : "—"}
                            </td>
                            <td className="px-4 py-3 text-ivory/70">
                              {response.arrival_time || "—"}
                            </td>
                            <td className="max-w-[140px] truncate px-4 py-3 text-ivory/70">
                              {response.dietary_requirements || "—"}
                            </td>
                            <td className="max-w-[140px] truncate px-4 py-3 text-ivory/70">
                              {response.note_to_couple || "—"}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => setEditing(response)}
                                className="rounded-full border border-gold/30 px-3 py-1 font-body text-[10px] tracking-wide text-gold uppercase"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <RsvpEditPanel
          response={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setResponses((prev) =>
              prev.map((row) => (row.id === updated.id ? updated : row)),
            );
          }}
          onDeleted={(id) => {
            setResponses((prev) => prev.filter((row) => row.id !== id));
          }}
        />
      )}
    </div>
  );
}
