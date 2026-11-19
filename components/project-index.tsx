"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/content";
import { MediaImage } from "./media-image";

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const categories = ["All", ...new Set(projects.map((project) => project.category))];
  const [category, setCategory] = useState("All");
  const selected = category === "All" ? projects : projects.filter((project) => project.category === category);

  return <section className="portfolio-section" id="project-list" aria-labelledby="project-list-title">
    <header className="section-heading">
      <h2 id="project-list-title">Explore by room.</h2>
      <div className="filter-group" role="group" aria-label="Filter portfolio by room">
        {categories.map((label) => <button type="button" aria-pressed={label === category} onClick={() => setCategory(label)} key={label}>{label}</button>)}
      </div>
    </header>
    <div className="project-grid">{selected.map((item) => <Link key={item.slug} href={`/projects/${item.slug}`} className="project-card">
      <div className="project-image"><MediaImage src={item.images[0].src} alt={item.images[0].alt} sizes="(max-width: 700px) 100vw, 33vw" /></div>
      <div className="project-meta"><div><span className="eyebrow">{item.kind === "concept" ? "AI DESIGN CONCEPT" : "COMPLETED WORK"}</span>
        <h3>{item.title}</h3></div><ArrowUpRight size={23} /></div>
    </Link>)}</div>
  </section>;
}
