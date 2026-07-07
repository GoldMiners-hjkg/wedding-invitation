"use client";

import { useState } from "react";
import { VideoHero } from "@/components/VideoHero";
import { TransitionScreen } from "@/components/TransitionScreen";
import { WeddingDateSection } from "@/components/WeddingDateSection";
import { WeddingInfo } from "@/components/WeddingInfo";
import { RSVPForm } from "@/components/RSVPForm";
import { DressCode } from "@/components/DressCode";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/editorial/motifs";
import { VintageShell } from "@/components/VintageShell";
import { WEDDING } from "@/lib/wedding";

type Screen = "video" | "transition" | "main";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("video");

  if (screen === "video") {
    return (
      <VintageShell decor={false}>
        <VideoHero
          heroImage={WEDDING.heroImage}
          onEnter={() => setScreen("transition")}
        />
      </VintageShell>
    );
  }

  if (screen === "transition") {
    return (
      <TransitionScreen onContinue={() => setScreen("main")} />
    );
  }

  return (
    <VintageShell>
      <main className="relative min-h-dvh">
        <WeddingDateSection />
        <WeddingInfo />
        <SectionDivider from="sky" to="cream" />
        <RSVPForm />
        <SectionDivider from="cream" to="sky-light" />
        <DressCode />
        <SectionDivider from="sky-light" to="cream" />
        <Footer />
      </main>
    </VintageShell>
  );
}
