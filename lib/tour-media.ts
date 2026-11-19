import type { Feature, Scene } from "./content";
import crops from "./tour-crops.json";

export const phonePortrait = "(orientation: portrait) and (max-width: 599px)";
export const tabletPortrait = "(orientation: portrait) and (min-width: 600px)";

export type TourVariant = "wide" | keyof typeof crops.profiles;

type SceneMedia = {
  poster: string;
  endPoster?: string;
  video?: string;
  aspect: number;
};

function cropFor(scene: Scene) {
  return crops.scenes[scene.id as keyof typeof crops.scenes];
}

export function getSceneMedia(scene: Scene, variant: TourVariant): SceneMedia {
  const { poster, endPoster, video } = scene;
  if (variant === "wide" || !cropFor(scene)) return { poster, endPoster, video, aspect: 16 / 9 };

  const file = (path: string) => path.replace(/(\.[^.]+)$/, "-" + variant + "$1");
  return {
    poster: file(poster), endPoster: endPoster && file(endPoster), video: video && file(video),
    aspect: crops.profiles[variant].width / crops.profiles[variant].height,
  };
}

function xInCrop(scene: Scene, feature: Feature, variant: "phone" | "tablet") {
  const crop = cropFor(scene);
  if (!crop) return feature.position[0] + "%";
  const sourceX = feature.position[0] * crops.source.width / 100;
  return (100 * (sourceX - crop[variant]) / crops.profiles[variant].cropWidth) + "%";
}

export function hotspotCoordinates(scene: Scene, feature: Feature) {
  return {
    "--hotspot-x-wide": feature.position[0] + "%",
    "--hotspot-x-phone": xInCrop(scene, feature, "phone"),
    "--hotspot-x-tablet": xInCrop(scene, feature, "tablet"),
    "--hotspot-y": feature.position[1] + "%",
  };
}

export function currentTourVariant(): TourVariant {
  if (window.matchMedia(phonePortrait).matches) return "phone";
  return window.matchMedia(tabletPortrait).matches ? "tablet" : "wide";
}
