"use client";

import { useEffect, useState } from "react";
import {
  GUEST_COUNT_OPTIONS,
  HOTEL_CHECK_IN_DATE_OPTIONS,
} from "@/lib/wedding";
import type { RSVPFormData, RSVPResponse } from "@/lib/types";

function responseToForm(response: RSVPResponse): RSVPFormData {
  return {
    full_name: response.full_name,
    attending: response.attending,
    num_guests: response.num_guests,
    hotel_needed: response.hotel_needed,
    hotel_check_in_dates: [...response.hotel_check_in_dates],
    hotel_num_guests: response.hotel_num_guests ?? 1,
    arrival_time: response.arrival_time ?? "",
    flight_number: response.flight_number ?? "",
    flight_arrival_time: response.flight_arrival_time ?? "",
    arriving_airport: response.arriving_airport ?? "",
    dietary_requirements: response.dietary_requirements ?? "",
    note_to_couple: response.note_to_couple ?? "",
  };
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block font-body text-[10px] font-light tracking-[0.12em] text-charcoal/65 uppercase">
      {children}
      {required && <span className="ml-1 text-blush">*</span>}
    </label>
  );
}

function inputClassName() {
  return "w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 font-body text-sm text-charcoal shadow-sm outline-none placeholder:text-charcoal/35 focus:border-champagne/70 focus:ring-2 focus:ring-champagne/20";
}

function toggleClassName(active: boolean) {
  return active
    ? "border-champagne bg-linen text-charcoal"
    : "border-charcoal/15 bg-white text-charcoal/70 hover:border-champagne/50";
}

export function RsvpEditPanel({
  response,
  onClose,
  onSaved,
  onDeleted,
}: {
  response: RSVPResponse;
  onClose: () => void;
  onSaved: (updated: RSVPResponse) => void;
  onDeleted: (id: string) => void;
}) {
  const [form, setForm] = useState<RSVPFormData>(() => responseToForm(response));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setForm(responseToForm(response));
    setError("");
    setConfirmDelete(false);
  }, [response]);

  function updateField<K extends keyof RSVPFormData>(
    key: K,
    value: RSVPFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/responses/${response.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save");
        return;
      }
      onSaved(data.response as RSVPResponse);
      onClose();
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/responses/${response.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to delete");
        setConfirmDelete(false);
        return;
      }
      onDeleted(response.id);
      onClose();
    } catch {
      setError("Failed to delete");
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-charcoal/10 bg-pearl shadow-2xl">
        <div className="flex items-start justify-between border-b border-charcoal/10 bg-linen/40 px-5 py-4">
          <div>
            <p className="font-body text-[10px] tracking-[0.15em] text-charcoal/55 uppercase">
              Edit RSVP
            </p>
            <h2 className="mt-1 font-heading text-2xl text-charcoal italic">
              {response.full_name}
            </h2>
            <p className="mt-1 font-body text-xs text-charcoal/55">
              Submitted {new Date(response.created_at).toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-charcoal/15 bg-white px-3 py-1 font-body text-xs text-charcoal/70 hover:border-charcoal/30"
          >
            Close
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <div>
              <FieldLabel required>Full name</FieldLabel>
              <input
                className={inputClassName()}
                value={form.full_name}
                onChange={(e) => updateField("full_name", e.target.value)}
              />
            </div>

            <div>
              <FieldLabel required>Attending</FieldLabel>
              <div className="flex gap-2">
                {[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => updateField("attending", opt.value)}
                    className={`flex-1 rounded-full border px-4 py-2 font-body text-sm transition-colors ${toggleClassName(form.attending === opt.value)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Number of guests</FieldLabel>
              <select
                className={inputClassName()}
                value={form.num_guests}
                onChange={(e) =>
                  updateField("num_guests", Number(e.target.value))
                }
              >
                {GUEST_COUNT_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel>Hotel needed</FieldLabel>
              <div className="flex gap-2">
                {[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => updateField("hotel_needed", opt.value)}
                    className={`flex-1 rounded-full border px-4 py-2 font-body text-sm transition-colors ${toggleClassName(form.hotel_needed === opt.value)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {form.hotel_needed && (
              <div className="space-y-4 rounded-xl border border-charcoal/10 bg-linen/50 p-4">
                <div>
                  <FieldLabel>Check-in dates</FieldLabel>
                  <p className="mb-3 font-body text-xs text-charcoal/55">
                    Select the night(s) needed. If staying both nights, select
                    both dates.
                  </p>
                  <div className="flex gap-2">
                    {HOTEL_CHECK_IN_DATE_OPTIONS.map((opt) => {
                      const selected = form.hotel_check_in_dates.includes(
                        opt.value,
                      );
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            const next = selected
                              ? form.hotel_check_in_dates.filter(
                                  (value) => value !== opt.value,
                                )
                              : [...form.hotel_check_in_dates, opt.value];
                            updateField("hotel_check_in_dates", next);
                          }}
                          className={`flex-1 rounded-full border px-4 py-2 font-body text-sm transition-colors ${toggleClassName(selected)}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <FieldLabel>Hotel guests</FieldLabel>
                  <select
                    className={inputClassName()}
                    value={form.hotel_num_guests}
                    onChange={(e) =>
                      updateField("hotel_num_guests", Number(e.target.value))
                    }
                  >
                    {GUEST_COUNT_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="font-body text-xs text-charcoal/55">
                  Nights to book:{" "}
                  <span className="font-medium text-charcoal">
                    {form.hotel_check_in_dates.length || 0}
                  </span>
                  {form.hotel_check_in_dates.length > 0
                    ? ` (${form.hotel_check_in_dates
                        .map(
                          (d) =>
                            HOTEL_CHECK_IN_DATE_OPTIONS.find((o) => o.value === d)
                              ?.label ?? d,
                        )
                        .join(", ")})`
                    : ""}
                </p>
              </div>
            )}

            <div>
              <FieldLabel>Arrival time</FieldLabel>
              <input
                className={inputClassName()}
                value={form.arrival_time}
                onChange={(e) => updateField("arrival_time", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Flight number</FieldLabel>
                <input
                  className={inputClassName()}
                  value={form.flight_number}
                  onChange={(e) =>
                    updateField("flight_number", e.target.value)
                  }
                />
              </div>
              <div>
                <FieldLabel>Flight arrival</FieldLabel>
                <input
                  className={inputClassName()}
                  value={form.flight_arrival_time}
                  onChange={(e) =>
                    updateField("flight_arrival_time", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <FieldLabel>Arriving airport</FieldLabel>
              <input
                className={inputClassName()}
                value={form.arriving_airport}
                onChange={(e) =>
                  updateField("arriving_airport", e.target.value)
                }
              />
            </div>

            <div>
              <FieldLabel>Dietary requirements</FieldLabel>
              <textarea
                className={`${inputClassName()} min-h-[72px] resize-y`}
                value={form.dietary_requirements}
                onChange={(e) =>
                  updateField("dietary_requirements", e.target.value)
                }
              />
            </div>

            <div>
              <FieldLabel>Note to couple</FieldLabel>
              <textarea
                className={`${inputClassName()} min-h-[72px] resize-y`}
                value={form.note_to_couple}
                onChange={(e) => updateField("note_to_couple", e.target.value)}
              />
            </div>

            {error && (
              <p className="font-body text-sm text-blush">{error}</p>
            )}
          </div>

          <div className="flex gap-3 border-t border-charcoal/10 bg-linen/30 px-5 py-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || deleting}
              className={`rounded-full border px-4 py-2.5 font-body text-xs tracking-wide uppercase ${
                confirmDelete
                  ? "border-blush bg-blush/10 text-blush"
                  : "border-charcoal/20 bg-white text-charcoal/60"
              }`}
            >
              {deleting
                ? "Deleting..."
                : confirmDelete
                  ? "Confirm delete"
                  : "Delete"}
            </button>
            <div className="ml-auto flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-charcoal/20 bg-white px-5 py-2.5 font-body text-xs tracking-wide text-charcoal/70 uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || deleting}
                className="rounded-full bg-charcoal px-5 py-2.5 font-body text-xs tracking-wide text-pearl uppercase disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </aside>
    </div>
  );
}
