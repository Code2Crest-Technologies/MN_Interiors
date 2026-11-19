"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { completedProjects, exterior, projects, rooms, testimonials } from "@/lib/content";
import { TourScene } from "./tour-scene";
import { ContactSection } from "./contact-section";
import { MediaImage } from "./media-image";

const tour = [exterior, ...rooms];

export function HomeExperience({ whatsapp, emailEnabled }: { whatsapp: string; emailEnabled: boolean }) {
  const [interest, setInterest] = useState<{ name: string }>();
  const highlighted = (completedProjects.length ? completedProjects : projects).slice(0, 3);

  function enquire(name: string) {
    setInterest({ name });
    requestAnimationFrame(() => {
      const field = document.getElementById("enquiry-interest");
      field?.focus({ preventScroll: true });
      document.getElementById("enquiry")?.scrollIntoView();
      history.replaceState(null, "", "#enquiry");
    });
  }

  return <>
    {tour.map((scene, index) => <TourScene key={scene.id} scene={scene} nextId={tour[index + 1]?.id ?? "portfolio"}
      onEnquire={enquire} />)}
    <section id="portfolio" className="portfolio-section" aria-labelledby="portfolio-title">
      <header className="section-heading">
        <div><div className="eyebrow"><span className="gold-rule" /> PORTFOLIO</div>
          <h2 id="portfolio-title">{completedProjects.length ? "Selected work." : "Selected concepts."}</h2></div>
        <Link href="/projects" className="text-link">Explore the portfolio <ArrowUpRight size={17} /></Link>
      </header>
      <div className="project-grid">
        {highlighted.map((project) => <Link href={`/projects/${project.slug}`} className="project-card" key={project.slug}>
          <div className="project-image"><MediaImage src={project.images[0].src} alt={project.images[0].alt} sizes="(max-width: 700px) 100vw, 33vw" /></div>
          <div className="project-meta"><div><span className="eyebrow">{project.kind === "concept" ? "AI DESIGN CONCEPT" : "COMPLETED WORK"}</span>
            <h3>{project.title}</h3></div><ArrowUpRight size={23} /></div>
        </Link>)}
      </div>
      {testimonials.length > 0 && <div className="testimonials" aria-label="Client feedback">
        {testimonials.map((item) => <figure key={item.attribution + item.quote}><blockquote>{item.quote}</blockquote><figcaption>{item.attribution}</figcaption></figure>)}
      </div>}
    </section>
    <ContactSection whatsapp={whatsapp} emailEnabled={emailEnabled} suggestedInterest={interest} />
  </>;
}
