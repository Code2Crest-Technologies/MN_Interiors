"use client";

import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getProjectsForScene, type Feature, type Scene } from "@/lib/content";
import { MediaImage } from "./media-image";

const views = ["Materials", "Finishes", "Gallery"] as const;
type View = typeof views[number];

export function FeatureDialog({ scene, feature, initialView, onClose, onEnquire }: {
  scene: Scene; feature: Feature; initialView: View; onClose: () => void; onEnquire: (interest: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<View>(initialView);
  const [finishIndex, setFinishIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const sceneProjects = getProjectsForScene(scene.id);
  const verified = sceneProjects.filter((project) => project.kind === "completed");
  const gallery = verified.length ? verified : sceneProjects.filter((project) => project.kind === "concept");
  const images = verified.length
    ? verified.flatMap((project) => project.images.map((item) => ({ ...item, project })))
    : [{ src: feature.image, alt: feature.imageAlt, project: gallery[0] },
      ...gallery.flatMap((project) => project.images.filter((item) => item.src !== feature.image).map((item) => ({ ...item, project })))];
  const image = images[imageIndex];
  const finish = feature.finishes[finishIndex];

  useEffect(() => {
    const panel = dialog.current;
    const previousOverflow = document.body.style.overflow;
    panel?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      panel?.close();
    };
  }, []);

  return <dialog ref={dialog} className="feature-dialog" aria-labelledby="feature-title"
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-inner">
      <div className="dialog-top"><span className="eyebrow">{scene.label}</span>
        <button type="button" autoFocus className="icon-button" onClick={onClose} aria-label="Close feature details"><X size={21} /></button></div>
      <h2 id="feature-title">{feature.title}</h2>
      <p>{feature.description}</p>
      <div className="view-switch" role="group" aria-label="Feature details">
        {views.map((item) => <button key={item} type="button" aria-pressed={view === item}
          onClick={() => setView(item)}>{item}</button>)}
      </div>

      {view === "Materials" && <div className="dialog-content">
        <ul className="material-list">{feature.materials.map((item) => <li key={item.name}>
          <strong>{item.name}</strong><p>{item.detail}</p></li>)}</ul>
        <p className="small-note">Concept specifications. Confirm available sheets, grades, thicknesses and care guidance with MN Interiors.</p>
      </div>}

      {view === "Finishes" && <div className="dialog-content">
        <div className="finish-chip" style={{ backgroundColor: finish.color }} aria-hidden="true" />
        <div className="finish-swatches" role="group" aria-label="Illustrative finishes">
          {feature.finishes.map((option, index) => <button key={option.name} type="button"
            style={{ backgroundColor: option.color }} aria-label={option.name} title={option.name}
            aria-pressed={finishIndex === index} onClick={() => setFinishIndex(index)} />)}
        </div>
        <div aria-live="polite"><strong>{finish.name}</strong><p>{finish.description}</p></div>
        <p className="small-note">Digital swatches are illustrative. Ask for physical samples to confirm colour and texture.</p>
      </div>}

      {view === "Gallery" && image && <div className="dialog-content">
        <div className="dialog-image" aria-live="polite"><MediaImage src={image.src} alt={image.alt} sizes="(max-width: 680px) 90vw, 400px" eager /></div>
        <div className="gallery-controls">
          <span className="small-note">{verified.length ? "Completed work" : "AI concept image"} · {imageIndex + 1} / {images.length}</span>
          {images.length > 1 && <div>
            <button type="button" className="icon-button small" aria-label="Previous image"
              onClick={() => setImageIndex((imageIndex + images.length - 1) % images.length)}><ChevronLeft size={18} /></button>
            <button type="button" className="icon-button small" aria-label="Next image"
              onClick={() => setImageIndex((imageIndex + 1) % images.length)}><ChevronRight size={18} /></button>
          </div>}
        </div>
        {image.project && <Link href={`/projects/${image.project.slug}`} className="text-link">
          {verified.length ? "View project" : "View concept"} <ArrowUpRight size={16} /></Link>}
      </div>}

      <button className="button gold dialog-cta" type="button" onClick={() => onEnquire(scene.label)}>
        Enquire about this design <ArrowRight size={17} />
      </button>
    </div>
  </dialog>;
}
