"use client";

import Link from "next/link";
import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { EditorialSectionHeader } from "@/components/editorial/motifs";
import { useLanguage } from "@/lib/i18n/context";
import type { RecommendationItem } from "@/lib/i18n/types";

type TabId = "dining" | "culture" | "wellness";

export function Recommendations() {
  const { t } = useLanguage();
  const { recommendations } = t;
  const [activeTab, setActiveTab] = useState<TabId>("dining");

  const tabs: { id: TabId; label: string }[] = [
    { id: "dining", label: recommendations.tabs.dining },
    { id: "culture", label: recommendations.tabs.culture },
    { id: "wellness", label: recommendations.tabs.wellness },
  ];

  const items: RecommendationItem[] = recommendations.items[activeTab];

  return (
    <section className="relative bg-linen px-6 py-20 sm:px-10">
      <ScrollReveal>
        <div className="relative mx-auto max-w-lg">
          <EditorialSectionHeader>
            <p className="font-body text-[10px] font-light tracking-[0.35em] text-charcoal/50 uppercase">
              {recommendations.eyebrow}
            </p>
            <h2 className="mt-3 text-center font-heading text-3xl text-charcoal italic sm:text-4xl">
              {recommendations.title}
            </h2>
          </EditorialSectionHeader>

          <div className="mt-10 flex border border-champagne/40 bg-pearl/60 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 font-body text-[11px] font-light tracking-wide transition-all sm:text-xs ${
                  activeTab === tab.id
                    ? "bg-ivory-soft text-charcoal"
                    : "text-charcoal/40 hover:text-charcoal/65"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {items.map((item) => (
              <div
                key={item.name}
                className="border border-champagne/30 bg-pearl/70 p-5 transition-colors hover:border-mist/50"
              >
                <div className="flex items-start gap-4">
                  <span className="text-xl opacity-70" aria-hidden>
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading text-lg text-charcoal italic">
                        {item.name}
                      </h3>
                      <span className="shrink-0 border border-champagne/50 px-2.5 py-0.5 font-body text-[9px] font-light tracking-widest text-charcoal/45 uppercase">
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-2 font-body text-sm font-light leading-relaxed text-charcoal/55">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/guide"
            className="mt-10 flex w-full items-center justify-center border border-champagne py-3.5 font-body text-[11px] font-light tracking-[0.2em] text-charcoal uppercase transition-all hover:bg-pearl"
          >
            {recommendations.viewGuide}
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
