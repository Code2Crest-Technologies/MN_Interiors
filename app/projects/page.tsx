import type { Metadata } from "next";
import { CinematicHero } from "@/components/cinematic-hero";
import { ProjectIndex } from "@/components/project-index";
import { completedProjects, projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse living-room, modular-kitchen, wardrobe and study concepts and available completed work.",
};

export default function ProjectsPage() {
  return <>
    <CinematicHero title="Interior portfolio." subtitle={completedProjects.length ? "Explore completed installations and room concepts." : "Explore four room concepts and the details that define them."}
      eyebrow="PORTFOLIO" image="/media/living-end.webp" anchor="#project-list" action="Browse by room" />
    <ProjectIndex projects={projects} />
  </>;
}
