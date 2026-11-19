"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Project } from "@/lib/content";
import { MediaImage } from "./media-image";

export function ProjectGallery({ images }: { images: Project["images"] }) {
  const [index, setIndex] = useState(0);
  const item = images[index];

  return <div>
    <div className="project-gallery" aria-live="polite"><MediaImage src={item.src} alt={item.alt} sizes="(max-width: 850px) 100vw, 61vw" /></div>
    <div className="gallery-controls">
      <span className="small-note">{item.alt} · {index + 1} / {images.length}</span>
      {images.length > 1 && <div>
        <button className="icon-button" type="button" aria-label="Previous image" onClick={() => setIndex((index + images.length - 1) % images.length)}><ChevronLeft size={18} /></button>
        <button className="icon-button" type="button" aria-label="Next image" onClick={() => setIndex((index + 1) % images.length)}><ChevronRight size={18} /></button>
      </div>}
    </div>
  </div>;
}
