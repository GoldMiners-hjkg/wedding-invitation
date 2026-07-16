"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";
import {
  GUEST_COUNT_OPTIONS,
  HOTEL_CHECK_IN_DATE_OPTIONS,
  formatHotelCheckInDates,
  hotelNightCount,
} from "@/lib/wedding";
import { INVITE_DECOR } from "@/lib/invite-template";
import { useLanguage } from "@/lib/i18n/context";
import { interpolate } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/types";
import type { RSVPFormData } from "@/lib/types";

const RSVP_TITLE_BY_LOCALE: Record<Locale, string> = {
  "zh-CN": INVITE_DECOR.rsvpTitleZhCN,
  "zh-TW": INVITE_DECOR.rsvpTitleZhTW,
  en: INVITE_DECOR.rsvpTitleEn,
};

const initialForm: RSVPFormData = {
  full_name: "",
  attending: null,
  num_guests: 1,
  hotel_needed: true,
  hotel_check_in_dates: [],
  hotel_num_guests: 1,
  arrival_time: "",
  flight_number: "",
  flight_arrival_time: "",
  arriving_airport: "",
  dietary_requirements: "",
  note_to_couple: "",
};

function TogglePills<T extends string | boolean>({
  value,
  onChange,
  options,
}: {
  value: T | null;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-full border px-4 py-2.5 font-body text-sm font-normal transition-all vintage-text-halo ${
            value === opt.value
              ? "border-wine/45 bg-sky-light font-medium text-wine-deep"
              : "border-wine/30 text-wine-deep hover:border-wine/45"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function MultiSelectPills({
  values,
  onChange,
  options,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const selected = values.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              if (selected) {
                onChange(values.filter((value) => value !== opt.value));
              } else {
                onChange([...values, opt.value]);
              }
            }}
            className={`flex-1 rounded-full border px-4 py-2.5 font-body text-sm font-normal transition-all vintage-text-halo ${
              selected
                ? "border-wine/45 bg-sky-light font-medium text-wine-deep"
                : "border-wine/30 text-wine-deep hover:border-wine/45"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-eyebrow mb-2 block vintage-text-halo">
      {children}
      {required && <span className="ml-1 text-wine-light">*</span>}
    </label>
  );
}

export function RSVPForm() {
  const { t, locale } = useLanguage();
  const { rsvp, wedding, arrivalTimes } = t;

  const [form, setForm] = useState<RSVPFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showHotelConfirm, setShowHotelConfirm] = useState(false);
  const [submitted, setSubmitted] = useState<{
    attending: boolean;
    name: string;
  } | null>(null);

  function update<K extends keyof RSVPFormData>(key: K, value: RSVPFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.full_name.trim()) next.full_name = rsvp.errName;
    if (form.attending === null) next.attending = rsvp.errAttending;
    if (
      form.attending &&
      form.hotel_needed &&
      form.hotel_check_in_dates.length === 0
    ) {
      next.hotel_check_in_dates = rsvp.errCheckInDate;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submitForm() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ submit: data.error ?? rsvp.errSubmit });
        setShowHotelConfirm(false);
        return;
      }

      setSubmitted({
        attending: form.attending!,
        name: form.full_name.trim(),
      });
      setShowHotelConfirm(false);
    } catch {
      setErrors({ submit: rsvp.errNetwork });
      setShowHotelConfirm(false);
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (form.attending && form.hotel_needed) {
      setShowHotelConfirm(true);
      return;
    }

    void submitForm();
  }

  const inputClass =
    "w-full border border-wine/30 bg-cream/90 px-4 py-3 font-body text-sm font-normal text-wine outline-none transition-colors placeholder:text-wine-deep/50 focus:border-wine/55 vintage-text-halo";

  const firstName = submitted?.name.split(" ")[0] ?? "";
  const selectedDatesLabel = formatHotelCheckInDates(form.hotel_check_in_dates);
  const nightCount = hotelNightCount(form.hotel_check_in_dates);
  const confirmMessage =
    nightCount === 2
      ? interpolate(rsvp.confirmHotelTwoNights, { dates: selectedDatesLabel })
      : interpolate(rsvp.confirmHotelOneNight, { dates: selectedDatesLabel });

  return (
    <section className="relative px-6 py-4 sm:px-10 sm:py-5">
      <ScrollReveal>
        <div className="mx-auto max-w-lg vintage-text-halo">
          {!submitted && (
            <>
              <span className="invite-section-dot" aria-hidden />
              <div className="invite-rsvp__banner">
                <Image
                  src={INVITE_DECOR.rsvpBanner}
                  alt="RSVP"
                  width={399}
                  height={204}
                  unoptimized
                  className="invite-rsvp__banner-img"
                  draggable={false}
                />
              </div>
              <h2 className="invite-rsvp__title">
                <Image
                  src={RSVP_TITLE_BY_LOCALE[locale]}
                  alt={rsvp.title}
                  width={locale === "en" ? 964 : 872}
                  height={160}
                  unoptimized
                  className="invite-rsvp__title-img"
                  draggable={false}
                />
              </h2>
              <p className="text-body-vintage mt-6 text-center">
                {rsvp.deadline} {wedding.rsvpDeadline}
              </p>
            </>
          )}

          {submitted ? (
            <div className="invite-rsvp-success mt-8 py-10 px-5 text-center">
              <div className="invite-rsvp-success__icon mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                <span className="text-2xl">
                  {submitted.attending ? "🥂" : "💌"}
                </span>
              </div>
              {!submitted.attending && (
                <h3 className="invite-rsvp-success__title font-heading text-3xl">
                  {rsvp.thankYouDeclining}
                </h3>
              )}
              <p
                className={`invite-rsvp-success__msg ${submitted.attending ? "" : "mt-4"}`}
              >
                {interpolate(
                  submitted.attending
                    ? rsvp.thankYouAttendingMsg
                    : rsvp.thankYouDecliningMsg,
                  { name: firstName },
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="vintage-text-halo mt-10 space-y-6">
              <div>
                <FieldLabel required>{rsvp.fullName}</FieldLabel>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  className={inputClass}
                  placeholder={rsvp.fullNamePlaceholder}
                />
                {errors.full_name && (
                  <p className="mt-1 font-body text-xs text-blush">
                    {errors.full_name}
                  </p>
                )}
              </div>

              <div>
                <FieldLabel required>{rsvp.attending}</FieldLabel>
                <TogglePills
                  value={form.attending}
                  onChange={(v) => update("attending", v)}
                  options={[
                    { label: rsvp.accept, value: true },
                    { label: rsvp.decline, value: false },
                  ]}
                />
                {errors.attending && (
                  <p className="mt-1 font-body text-xs text-blush">
                    {errors.attending}
                  </p>
                )}
              </div>

              {form.attending && (
                <div>
                  <FieldLabel>{rsvp.guests}</FieldLabel>
                  <select
                    value={form.num_guests}
                    onChange={(e) =>
                      update("num_guests", Number(e.target.value))
                    }
                    className={inputClass}
                  >
                    {GUEST_COUNT_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}{" "}
                        {n === 1 ? rsvp.guest : rsvp.guestsPlural}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {form.attending && (
                <>
                  <div>
                    <FieldLabel>{rsvp.hotel}</FieldLabel>
                    <p className="text-body-vintage mb-1">
                      {rsvp.hotelVenueNote}
                    </p>
                    <p className="text-caption-vintage mb-3">
                      {wedding.venue}
                      <br />
                      {wedding.venueAddress}
                    </p>
                    <TogglePills
                      value={form.hotel_needed}
                      onChange={(v) => {
                        update("hotel_needed", v);
                        if (!v) update("hotel_check_in_dates", []);
                      }}
                      options={[
                        { label: rsvp.hotelYes, value: true },
                        { label: rsvp.hotelNo, value: false },
                      ]}
                    />
                  </div>

                  {form.hotel_needed && (
                    <div className="space-y-4 border-t border-wine/20 pt-5">
                      <div>
                        <FieldLabel required>{rsvp.checkIn}</FieldLabel>
                        <p className="text-caption-vintage mb-3">
                          {rsvp.checkInHint}
                        </p>
                        <MultiSelectPills
                          values={form.hotel_check_in_dates}
                          onChange={(values) =>
                            update("hotel_check_in_dates", values)
                          }
                          options={HOTEL_CHECK_IN_DATE_OPTIONS.map((d) => ({
                            label: d.label,
                            value: d.value,
                          }))}
                        />
                        {errors.hotel_check_in_dates && (
                          <p className="mt-1 font-body text-xs text-blush">
                            {errors.hotel_check_in_dates}
                          </p>
                        )}
                      </div>
                      <div>
                        <FieldLabel>{rsvp.hotelGuests}</FieldLabel>
                        <select
                          value={form.hotel_num_guests}
                          onChange={(e) =>
                            update("hotel_num_guests", Number(e.target.value))
                          }
                          className={inputClass}
                        >
                          {GUEST_COUNT_OPTIONS.map((n) => (
                            <option key={n} value={n}>
                              {n}{" "}
                              {n === 1 ? rsvp.guest : rsvp.guestsPlural}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <FieldLabel>{rsvp.arrival}</FieldLabel>
                    <select
                      value={form.arrival_time}
                      onChange={(e) => update("arrival_time", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">{rsvp.selectTime}</option>
                      {arrivalTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4 border-t border-wine/20 pt-5">
                    <p className="text-eyebrow">{rsvp.flightOptional}</p>
                    <div>
                      <FieldLabel>{rsvp.flightNumber}</FieldLabel>
                      <input
                        type="text"
                        value={form.flight_number}
                        onChange={(e) =>
                          update("flight_number", e.target.value)
                        }
                        className={inputClass}
                        placeholder="UA 857"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <FieldLabel>{rsvp.flightArrival}</FieldLabel>
                        <input
                          type="text"
                          value={form.flight_arrival_time}
                          onChange={(e) =>
                            update("flight_arrival_time", e.target.value)
                          }
                          className={inputClass}
                          placeholder="14:30"
                        />
                      </div>
                      <div>
                        <FieldLabel>{rsvp.airport}</FieldLabel>
                        <input
                          type="text"
                          value={form.arriving_airport}
                          onChange={(e) =>
                            update("arriving_airport", e.target.value)
                          }
                          className={inputClass}
                          placeholder="SYX"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>{rsvp.dietary}</FieldLabel>
                    <textarea
                      value={form.dietary_requirements}
                      onChange={(e) =>
                        update("dietary_requirements", e.target.value)
                      }
                      className={`${inputClass} min-h-[80px] resize-y`}
                      placeholder={rsvp.dietaryPlaceholder}
                    />
                  </div>
                </>
              )}

              <div>
                <FieldLabel>{rsvp.note}</FieldLabel>
                <textarea
                  value={form.note_to_couple}
                  onChange={(e) => update("note_to_couple", e.target.value)}
                  className={`${inputClass} min-h-[80px] resize-y`}
                  placeholder={rsvp.notePlaceholder}
                />
              </div>

              {errors.submit && (
                <p className="text-center font-body text-sm text-blush">
                  {errors.submit}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full border border-wine bg-wine py-4 font-body text-[11px] font-light tracking-[0.2em] text-cream uppercase transition-all hover:bg-wine/90 active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? rsvp.sending : rsvp.submit}
              </button>
            </form>
          )}
        </div>
      </ScrollReveal>

      {showHotelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={() => !submitting && setShowHotelConfirm(false)}
          />
          <div className="invite-rsvp-confirm relative z-10 w-full max-w-md p-6 shadow-2xl sm:p-8">
            <p className="invite-rsvp-confirm__eyebrow">{rsvp.confirmHotelTitle}</p>
            <p className="invite-rsvp-confirm__title mt-4 font-heading text-2xl leading-snug">
              {confirmMessage}
            </p>
            <p className="invite-rsvp-confirm__body mt-3">
              {rsvp.checkInHint}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowHotelConfirm(false)}
                className="invite-rsvp-confirm__back flex-1 rounded-full px-5 py-3 font-body text-xs font-medium tracking-wide uppercase"
              >
                {rsvp.confirmHotelBack}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => void submitForm()}
                className="invite-rsvp-confirm__go flex-1 rounded-full px-5 py-3 font-body text-xs tracking-wide uppercase disabled:opacity-50"
              >
                {submitting ? rsvp.sending : rsvp.confirmHotelProceed}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
