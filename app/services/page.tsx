import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CinematicHero } from "@/components/cinematic-hero";
import { MediaImage } from "@/components/media-image";
import { rooms } from "@/lib/content";

export const metadata: Metadata = {
  title: "Interior design services",
  description: "Explore modular-kitchen concepts, TV units, wall panels, wardrobes, dressing units and custom study storage.",
};

export default function ServicesPage() {
  return <>
    <CinematicHero title="Interiors, room by room." subtitle="Explore cabinetry, finishes and fitted furniture across the home."
      eyebrow="SERVICES" image="/media/kitchen.webp" anchor="#services" action="Explore the spaces" />
    <section id="services" className="services-list" aria-label="Interior design services">
      {rooms.map((room) => <article className="service-panel" key={room.id}>
        <div className="service-image"><MediaImage src={room.endPoster ?? room.poster} alt={`${room.label} AI design concept`}
          sizes="(max-width: 750px) 100vw, 55vw" /></div>
        <div className="service-copy"><div className="eyebrow"><span className="gold-rule" /> {room.number} / {room.label}</div>
          <h2>{room.title}</h2><p>{room.description}</p>
          <ul>{room.features.map((feature) => <li key={feature.id}>{feature.title}</li>)}</ul>
          <Link className="text-link" href={`/#${room.id}`}>Explore this room <ArrowUpRight size={16} /></Link>
        </div>
      </article>)}
    </section>
  </>;
}
