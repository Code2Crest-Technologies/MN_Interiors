"use client";

import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Feature, Scene } from "@/lib/content";
import { currentTourVariant, getSceneMedia, hotspotCoordinates, phonePortrait, tabletPortrait } from "@/lib/tour-media";
import { FeatureDialog } from "./feature-dialog";
import { MediaImage } from "./media-image";
import { SceneFilm } from "./scene-film";

gsap.registerPlugin(ScrollTrigger);

type FeatureView = "Materials" | "Finishes" | "Gallery";
type OpenFeature = (item: Feature, trigger: HTMLElement, view?: FeatureView) => void;

function ScenePicture({ scene, end = false, eager = false }: { scene: Scene; end?: boolean; eager?: boolean }) {
  const key = end ? "endPoster" : "poster";
  const wide = getSceneMedia(scene, "wide")[key];
  const phone = getSceneMedia(scene, "phone")[key];
  const tablet = getSceneMedia(scene, "tablet")[key];
  if (!wide) return null;

  return <picture className={end ? "scene-end" : "scene-photo"}>
    {phone && phone !== wide && <source media={phonePortrait} srcSet={phone} />}
    {tablet && tablet !== wide && <source media={tabletPortrait} srcSet={tablet} />}
    <MediaImage src={wide} alt="" eager={eager} />
  </picture>;
}

function SceneDetails({ scene, layout, show }: { scene: Scene; layout: "wide" | "compact"; show: OpenFeature }) {
  const first = scene.features[0];
  return <aside className={`scene-details scene-details-${layout}`} aria-label={`${scene.label} details`}>
    <span className="eyebrow">Explore the details</span>
    {scene.features.map((item) => <button type="button" onClick={(event) => show(item, event.currentTarget)}
      key={item.id} aria-haspopup="dialog"><span>{item.title}</span><ArrowUpRight size={16} /></button>)}
    {first && <div className="detail-shortcuts">
      <button type="button" onClick={(event) => show(first, event.currentTarget, "Finishes")} aria-haspopup="dialog">Finishes</button>
      <button type="button" onClick={(event) => show(first, event.currentTarget, "Gallery")} aria-haspopup="dialog">Gallery</button>
    </div>}
  </aside>;
}

export function TourScene({ scene, nextId, onEnquire }: {
  scene: Scene; nextId: string; onEnquire: (interest: string) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const space = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [motion, setMotion] = useState(false);
  const [settled, setSettled] = useState(false);
  const [feature, setFeature] = useState<{ item: Feature; view: FeatureView } | null>(null);
  const arrival = scene.id === "arrival";
  const showFeatures = !!scene.features.length && (!motion || settled);

  useEffect(() => {
    const element = track.current;
    const pin = sticky.current;
    const distance = space.current;
    const panel = stage.current;
    const clip = video.current;
    if (!element || !pin || !distance || !panel) return;

    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", phone: phonePortrait, tablet: tabletPortrait }, (context) => {
      if (!context.conditions?.motion) return;
      const source = getSceneMedia(scene, currentTourVariant()).video;
      setMotion(true);
      let frame = 0;
      let wanted = 0;
      let sourceAssigned = false;
      let inMotion = false;
      let failed = false;

      function showFrame() {
        if (!clip || !inMotion || failed || !Number.isFinite(clip.duration) || clip.seeking) return;
        const target = wanted * Math.max(0, clip.duration - 0.08);
        if (Math.abs(clip.currentTime - target) > 0.036) clip.currentTime = target;
        else if (clip.readyState >= 2) panel?.classList.add("video-ready");
      }

      function loseVideo() {
        failed = true;
        panel?.classList.remove("video-ready");
      }

      function loadVideo() {
        if (!clip || !source || sourceAssigned) return;
        sourceAssigned = true;
        clip.preload = "metadata";
        clip.src = source;
        clip.load();
      }

      const nearby = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        loadVideo();
        nearby.disconnect();
      }, { rootMargin: "320px 0px" });
      if (clip) nearby.observe(element);

      function render(progress: number) {
        const travel = Math.min(1, Math.max(0, progress / (source ? 0.79 : 0.82)));
        const endpoint = !!source && travel >= 1;
        inMotion = !!source && travel > 0.002 && !endpoint;
        wanted = travel;
        panel?.classList.toggle("at-end", endpoint);
        if (!inMotion) panel?.classList.remove("video-ready");
        panel?.style.setProperty("--travel", String(travel));
        panel?.style.setProperty("--fade", String(Math.max(0, (progress - 0.93) / 0.07) * 0.5));
        setSettled(travel >= 1);
        if (inMotion) {
          loadVideo();
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(showFrame);
        }
      }

      clip?.addEventListener("loadedmetadata", showFrame);
      clip?.addEventListener("loadeddata", showFrame);
      clip?.addEventListener("seeked", showFrame);
      clip?.addEventListener("error", loseVideo);
      const trigger = ScrollTrigger.create({
        trigger: element, start: () => "top " + (parseFloat(getComputedStyle(pin).top) || 0) + "px",
        end: () => "+=" + distance.offsetHeight,
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
      });
      render(trigger.progress);

      return () => {
        trigger.kill();
        nearby.disconnect();
        cancelAnimationFrame(frame);
        clip?.removeEventListener("loadedmetadata", showFrame);
        clip?.removeEventListener("loadeddata", showFrame);
        clip?.removeEventListener("seeked", showFrame);
        clip?.removeEventListener("error", loseVideo);
        if (clip?.hasAttribute("src")) {
          clip.removeAttribute("src");
          clip.load();
        }
        panel.classList.remove("at-end", "video-ready");
        panel.style.removeProperty("--travel");
        panel.style.removeProperty("--fade");
        setMotion(false);
        setSettled(false);
      };
    });
    return () => media.revert();
  }, [scene]);

  function show(item: Feature, trigger: HTMLElement, view: FeatureView = "Materials") {
    opener.current = trigger;
    setFeature({ item, view });
  }

  function close() {
    setFeature(null);
    const button = opener.current;
    requestAnimationFrame(() => button?.focus({ preventScroll: true }));
  }

  function enquire(interest: string) {
    setFeature(null);
    onEnquire(interest);
  }

  return <section id={scene.id} className={`tour-scene ${arrival ? "arrival" : "room"} ${scene.video ? "with-clip" : "with-still"}`}
    aria-labelledby={scene.id + "-title"}>
    <div className="scene-track" ref={track}>
      <div className="scene-sticky" ref={sticky}>
        <div className="scene-stage" ref={stage}>
          <div className="scene-plane">
            <ScenePicture scene={scene} eager={arrival} />
            {scene.endPoster && <ScenePicture scene={scene} end />}
            {scene.video && <video ref={video} className="scene-video" muted playsInline preload="none" aria-hidden="true" />}
            {showFeatures && <div className="hotspots">
              {scene.features.map((item) => <button type="button" key={item.id} className="hotspot"
                style={hotspotCoordinates(scene, item) as CSSProperties}
                aria-label={`Explore ${item.title}`} aria-haspopup="dialog" onClick={(event) => show(item, event.currentTarget)}>
                <Plus size={19} /><span>{item.title}</span>
              </button>)}
            </div>}
          </div>
          <div className="scene-shade" />
          <div className="scene-out" />
          <span className="concept-tag"><span /> AI CONCEPT VISUALS</span>
        </div>

        {arrival ? <div className="arrival-content">
          <div className="eyebrow"><span className="gold-rule" /> MN INTERIORS / ERODE</div>
          <h1 id={scene.id + "-title"}>A home built<br /><em>around you.</em></h1>
          <p>{scene.description}</p>
          <div className="scene-actions"><a className="button gold" href="#living-room">Enter the home <ArrowRight size={17} /></a>
            {scene.video && <SceneFilm scene={scene} />}</div>
        </div> : <div className="room-content">
          <div className="eyebrow"><span className="gold-rule" /> {scene.number} / {scene.label}</div>
          <h2 id={scene.id + "-title"}>{scene.title}</h2>
          <p>{scene.description}</p>
          <div className="scene-actions"><a className="text-link" href={`#${nextId}`}>Continue the tour <ArrowDown size={15} /></a>
            {scene.video && <SceneFilm scene={scene} />}</div>
        </div>}

        {showFeatures && <SceneDetails scene={scene} layout="wide" show={show} />}
        {arrival && <div className="hero-footer">
          <span><span className="hero-index">01</span> / 05</span>
          <a href="#living-room"><ArrowDown size={15} /> Scroll to explore</a>
          <span>THE WALKTHROUGH</span>
        </div>}
      </div>
      <div className="scene-scroll-space" ref={space} aria-hidden="true" />
    </div>
    {scene.features.length > 0 && <SceneDetails scene={scene} layout="compact" show={show} />}
    {!arrival && <div className="scene-progress" aria-hidden="true" />}
    {feature && <FeatureDialog key={feature.item.id + feature.view} scene={scene} feature={feature.item}
      initialView={feature.view} onClose={close} onEnquire={enquire} />}
  </section>;
}
