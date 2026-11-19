import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { CinematicHero } from "@/components/cinematic-hero";
import { ProjectGallery } from "@/components/project-gallery";
import { projects, rooms } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Project unavailable" };
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const scene = rooms.find((room) => room.id === project.sceneId);
  return <>
    <CinematicHero title={project.title + "."} subtitle={project.description} eyebrow={project.category.toUpperCase()}
      image={project.kind === "concept" ? scene?.endPoster ?? scene?.poster ?? project.images[0].src : project.images[0].src}
      label={project.kind === "concept" ? "AI CONCEPT VISUAL" : "COMPLETED WORK"} anchor="#gallery" action="View gallery" />
    <section id="gallery" className="project-detail">
      <ProjectGallery images={project.images} />
      <div>
        <div className="eyebrow">{project.kind === "concept" ? "AI DESIGN CONCEPT" : "COMPLETED WORK"}</div>
        <h2>{project.title}.</h2><p>{project.description}</p>
        {scene && <ul>{scene.features.map((feature) => <li key={feature.id}>{feature.title}</li>)}</ul>}
        <Link className="button gold" href={`/contact?interest=${encodeURIComponent(scene?.label ?? "Something else")}#enquiry`}>Enquire about this design <ArrowUpRight size={17} /></Link>
        <Link className="text-link project-back" href="/projects">Back to portfolio <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  </>;
}
