import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CinematicHero } from "@/components/cinematic-hero";

export const metadata: Metadata = {
  title: "About",
  description: "Discover the MN Interiors design showcase in Erode and plan your first conversation about fitted interiors.",
};

export default function AboutPage() {
  return <>
    <CinematicHero title="Design for everyday living." subtitle="An interiors showcase for MN Interiors, Erode."
      eyebrow="ABOUT" image="/media/living-start.webp" anchor="#approach" action="See the approach" />
    <section className="about-section" id="approach" aria-labelledby="approach-title">
      <div className="eyebrow"><span className="gold-rule" /> THE APPROACH</div>
      <h2 id="approach-title">Start with how you use the room.</h2>
      <div className="approach-grid">
        <div><h3>Talk through your space.</h3><p>Bring your room dimensions, reference photos and the storage needs that matter most.</p></div>
        <div><h3>Compare the finishes.</h3><p>Review sample colours, sheet options and hardware in the light where they’ll be used.</p></div>
        <div><h3>Agree the details.</h3><p>Confirm the layout, material specifications and installation scope before work begins.</p></div>
      </div>
      <Link className="button gold" href="/contact#enquiry">Plan a consultation <ArrowUpRight size={17} /></Link>
    </section>
  </>;
}
