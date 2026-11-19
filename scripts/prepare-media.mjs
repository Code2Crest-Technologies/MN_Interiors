import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error("Usage: npm run media:prepare -- <exterior.mp4> <living-room.mp4>");
  process.exit(1);
}

const output = fileURLToPath(new URL("../public/media/", import.meta.url));
mkdirSync(output, { recursive: true });
function ffmpeg(...args) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

for (const [index, name] of ["exterior", "living"].entries()) {
  const source = resolve(args[index]);
  const video = join(output, name + ".mp4");
  ffmpeg("-i", source, "-map", "0:v:0", "-vf",
    "fps=24,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1",
    "-an", "-c:v", "libx264", "-threads", "4", "-preset", "slow", "-crf", "22",
    "-pix_fmt", "yuv420p", "-g", "8", "-keyint_min", "8", "-sc_threshold", "0",
    "-movflags", "+faststart", video);
  ffmpeg("-i", video, "-frames:v", "1", "-c:v", "libwebp", "-quality", "88",
    join(output, name + "-start.webp"));
  ffmpeg("-sseof", "-0.12", "-i", video, "-frames:v", "1", "-c:v", "libwebp", "-quality", "90",
    join(output, name + "-end.webp"));
}

ffmpeg("-i", join(output, "living-end.webp"), "-vf", "crop=600:430:385:115,scale=640:-2",
  "-frames:v", "1", "-c:v", "libwebp", "-quality", "88", join(output, "living-tv.webp"));
ffmpeg("-i", join(output, "living-end.webp"), "-vf", "crop=410:550:640:90,scale=560:-2",
  "-frames:v", "1", "-c:v", "libwebp", "-quality", "88", join(output, "living-panels.webp"));
console.log("Wrote scroll-friendly videos, posters and living-room detail images.");
