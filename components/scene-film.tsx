"use client";

import { Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Scene } from "@/lib/content";
import { currentTourVariant, getSceneMedia, type TourVariant } from "@/lib/tour-media";

export function SceneFilm({ scene }: { scene: Scene }) {
  const [variant, setVariant] = useState<TourVariant | null>(null);
  const open = variant !== null;
  const { poster, video, aspect } = getSceneMedia(scene, variant ?? "wide");
  const title = scene.label;
  const dialog = useRef<HTMLDialogElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = dialog.current;
    const trigger = button.current;
    const previous = document.body.style.overflow;
    panel?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      panel?.close();
      document.body.style.overflow = previous;
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  return <>
    <button className="text-link film-toggle" type="button" aria-haspopup="dialog" ref={button} onClick={() => setVariant(currentTourVariant())}>
      <Play size={15} /> Play film
    </button>
    {open && <dialog className="film-dialog" ref={dialog} aria-label={title + " film"}
      onCancel={(event) => { event.preventDefault(); setVariant(null); }}
      onClick={(event) => { if (event.target === event.currentTarget) setVariant(null); }}>
      <div className="film-inner">
        <div className="dialog-top"><span className="eyebrow">{title} / AI concept</span>
          <button type="button" autoFocus className="icon-button" onClick={() => setVariant(null)} aria-label="Close film"><X size={19} /></button></div>
        <video src={video} style={{ aspectRatio: aspect }} poster={poster} muted controls playsInline autoPlay aria-label={title + " film (silent)"} />
      </div>
    </dialog>}
  </>;
}
