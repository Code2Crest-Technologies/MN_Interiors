# MN Interiors cinematic portfolio

A client preview for MN Interiors in Erode, built by Code2Crest Technologies. The homepage moves through Arrival, Living Room, Kitchen, Bedroom and Study, then opens into the portfolio and consultation form. The project uses Next.js App Router, TypeScript, Tailwind CSS and GSAP ScrollTrigger. The included media is ready to run locally.

## Run locally

Install Node.js 20.9 or newer. From the extracted `mn-interiors` folder:

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To check and serve a production build:

```sh
npm run lint
npm run build
npm run typecheck
npm run start
```

Use the same commands in Windows PowerShell. FFmpeg is needed only to prepare replacement clips.

## What is included

- Scroll-controlled exterior and living-room footage from the supplied Google Flow clips. The videos are muted and optimized for forward and reverse seeking on desktop, phones and tablets. Each chapter holds its final view so visitors can explore its hotspots.
- Kitchen, bedroom and study scenes with an animated push-in over AI stills, plus an enquiry scene with the interior backdrop. Portrait phones get dedicated 9:16 media. Portrait tablets get 3:4 media, and landscape keeps the 16:9 framing. Reduced-motion visitors get stable room views. The optional Play film control remains available on compact and reduced-motion layouts.
- Clickable hotspots and side panels with material examples, sheet options, finish swatches and galleries. On portrait phones and tablet-sized portrait screens, the details open in a bottom sheet. Compact layouts also list every hotspot below the room image. Swatches update the displayed sample and description.
- Services, filterable portfolio, project galleries, About and Contact pages. The data model supports approved installation photos and testimonials.
- An enquiry form with demo preview and copy, optional SMTP delivery, and optional WhatsApp and telephone links. Project pages and hotspots can preselect the room.
- Page metadata, a sitemap route and indexing controls. Indexing defaults to disabled for the preview.

## Replace content and media

| File or directory | What to edit |
| --- | --- |
| `lib/content.ts` | Room copy, hotspot locations, example materials and finishes, completed projects, testimonials and Instagram |
| `public/media/` | Videos, portrait crops, posters, project photos and room close-ups |
| `lib/tour-crops.json` | Framing offsets shared by the portrait asset script and projected hotspot coordinates |
| `components/tour-scene.tsx` | Scroll timing, hold position, fallback and video-seeking behavior |
| `app/globals.css` | Theme, typography, cinematic layout and responsive styling |
| `.env.example` | All deployment and enquiry settings |

Set a hotspot's `position` to an `[x, y]` percentage measured from the top-left of the full 16:9 hold image. For a moving room, use its end poster as the reference. Phone and tablet coordinates are projected from that position using the same crop offsets applied to the media. After changing a crop, check that all marker buttons fit inside the portrait images. Every `completedProjects` entry should use a unique slug, an existing room ID, and at least one approved image under `public/media/`. Once a room has completed work, its hotspot gallery shows those installation photos. Add approved testimonial copy to `testimonials` to display the feedback section. The temporary text wordmark can be replaced in `components/header.tsx` with the client's approved logo.

Both supplied Flow clips are already bundled in a web-friendly format. To regenerate those assets with FFmpeg:

```sh
npm run media:prepare -- "path/to/exterior.mp4" "path/to/living-room.mp4"
npm run media:responsive
```

The first command replaces the two base clips and associated posters and living-room details. The second regenerates the bundled phone and tablet crops from the 1280 × 720 base media. It can also be run by itself after adjusting the offsets in `lib/tour-crops.json`. When you have a new kitchen, bedroom or study clip, add its file and start/end posters under `public/media`. Name the three base files using the room's stem in `lib/tour-crops.json`, for example `kitchen.mp4`, `kitchen-start.webp` and `kitchen-end.webp`. Set `video`, `poster` and `endPoster` for that room in `lib/content.ts`, then run `npm run media:responsive`. Use short keyframe intervals and 16:9 posters, then check forward and backward scrolling on the target devices.

## Enquiries and publication

Copy `.env.example` to `.env.local` and fill in the values you want to enable. In PowerShell, use `Copy-Item .env.example .env.local`. On macOS or Linux, use `cp .env.example .env.local`.

- With SMTP unset, the form validates and prepares a copyable enquiry. Demo submissions are neither stored nor emailed.
- Set `WHATSAPP_NUMBER` to the verified number with its country code and digits only. The site then offers WhatsApp at the form and a phone link in the consultation section. In preview mode, WhatsApp can open with the completed enquiry text.
- For email delivery, set the server-only `SMTP_*`, `ENQUIRY_FROM` and `ENQUIRY_TO` values. Use an authorized sender and check delivery to the intended mailbox in the deployed environment.
- Before publishing, review concept imagery, specifications, company details and projects with MN Interiors. Set `SITE_URL` to the canonical live origin and `SITE_INDEXABLE=true` if the approved website should appear in search. Rebuild after changing deployment settings. Serve the website on a Next.js-compatible host with Node.js support for the enquiry route.

## Media provenance

The exterior and living-room videos are the supplied Google Flow concept clips. The kitchen, bedroom and study stills are AI-generated visual concepts. The project and hotspot galleries label their concept imagery and accept verified installation photos later. Material examples and digital colours are illustrative until confirmed by MN Interiors.
