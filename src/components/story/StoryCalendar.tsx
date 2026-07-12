"use client";

import { INVITE_META } from "@/lib/invite-template";
import { useLanguage } from "@/lib/i18n/context";

export function StoryCalendar() {
  const { t } = useLanguage();
  const { year, month, day } = INVITE_META;
  const weekdays = t.invite.weekdays;
  const first = new Date(year, month - 1, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="invite-calendar">
      <p className="invite-calendar__head">
        <span className="invite-calendar__md">
          {String(month).padStart(2, "0")} / {String(day).padStart(2, "0")}
        </span>
        <span className="invite-calendar__year">{year}</span>
      </p>
      <div className="invite-calendar__week">
        {weekdays.map((w, i) => (
          <span key={`${w}-${i}`}>{w}</span>
        ))}
      </div>
      <div className="invite-calendar__grid">
        {cells.map((d, i) => (
          <span
            key={i}
            className={
              d === day
                ? "invite-calendar__day invite-calendar__day--active"
                : "invite-calendar__day"
            }
          >
            {d ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
