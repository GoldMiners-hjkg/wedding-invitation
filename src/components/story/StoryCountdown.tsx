"use client";

import { useEffect, useState } from "react";
import { INVITE_META } from "@/lib/invite-template";
import { useLanguage } from "@/lib/i18n/context";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function StoryCountdown() {
  const { t } = useLanguage();
  const target = new Date(
    INVITE_META.year,
    INVITE_META.month - 1,
    INVITE_META.day,
    INVITE_META.ceremonyHour,
    0,
    0,
  ).getTime();

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return <div className="invite-countdown" aria-hidden />;
  }

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const cells = [
    { label: t.invite.countdownDays, value: days },
    { label: t.invite.countdownHours, value: hours },
    { label: t.invite.countdownMins, value: mins },
    { label: t.invite.countdownSecs, value: secs },
  ];

  return (
    <div className="invite-countdown" aria-live="polite">
      {cells.map((cell) => (
        <div key={cell.label} className="invite-countdown__cell">
          <span className="invite-countdown__num">{pad(cell.value)}</span>
          <span className="invite-countdown__label">{cell.label}</span>
        </div>
      ))}
    </div>
  );
}
