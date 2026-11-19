import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const crops = JSON.parse(readFileSync(new URL("../lib/tour-crops.json", import.meta.url), "utf8"));
const output = fileURLToPath(new URL("../public/media/", import.meta.url));

function transcode(input, filter, args, destination) {
  execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y", "-i", join(output, input),
    "-vf", filter, ...args, join(output, destination),
  ], { stdio: "inherit" });
}

for (const scene of Object.values(crops.scenes)) {
  const hasClip = existsSync(join(output, scene.stem + ".mp4"));
  for (const [variant, profile] of Object.entries(crops.profiles)) {
    const filter = [
      `scale=${crops.source.width}:${crops.source.height}`,
      `crop=${profile.cropWidth}:${crops.source.height}:${scene[variant]}:0:exact=1`,
      `scale=${profile.width}:${profile.height}:flags=lanczos`,
      "setsar=1",
    ].join(",");
    for (const suffix of hasClip ? ["-start", "-end"] : [""]) {
      const stem = scene.stem + suffix;
      transcode(stem + ".webp", filter, ["-frames:v", "1", "-c:v", "libwebp", "-quality", "87"],
        stem + "-" + variant + ".webp");
    }
    if (hasClip) {
      transcode(scene.stem + ".mp4", filter, [
        "-an", "-c:v", "libx264", "-threads", "3", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
        "-g", "6", "-keyint_min", "6", "-sc_threshold", "0", "-movflags", "+faststart",
      ], scene.stem + "-" + variant + ".mp4");
    }
  }
}
console.log("Prepared 9:16 phone and 3:4 tablet walkthrough media.");
