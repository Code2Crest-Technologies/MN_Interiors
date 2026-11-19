export type Finish = { name: string; color: string; description: string };
export type Feature = {
  id: string;
  title: string;
  description: string;
  position: [number, number];
  materials: { name: string; detail: string }[];
  finishes: Finish[];
  image: string;
  imageAlt: string;
};
export type Scene = {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  poster: string;
  endPoster?: string;
  video?: string;
  features: Feature[];
};
export type Project = {
  slug: string;
  sceneId: string;
  title: string;
  category: string;
  description: string;
  kind: "concept" | "completed";
  images: { src: string; alt: string }[];
};

export const brand = {
  name: "MN Interiors",
  place: "Erode, Tamil Nadu",
  instagram: "https://www.instagram.com/mn_interiors_erode/",
};

const walnut = { name: "Smoked walnut", color: "#694633", description: "A deep brown woodgrain with a warm undertone." };
const oak = { name: "Natural oak", color: "#b48a61", description: "A honey-toned woodgrain with a lighter pattern." };
const champagne = { name: "Champagne", color: "#c5b39c", description: "A muted warm beige with a soft, even appearance." };
const linen = { name: "Warm ivory", color: "#ded4bf", description: "A creamy neutral that brightens darker cabinetry." };
const charcoal = { name: "Charcoal", color: "#363635", description: "A deep grey that defines edges and framing." };

const profile = { name: "Aluminium profile", detail: "Explore the frame profile, section thickness and corner detailing with the installer." };
const laminate = { name: "Laminate finish", detail: "Compare grain, sheen, edge bands and the recommended substrate using physical samples." };
const composite = { name: "Aluminium composite sheet", detail: "Ask which sheet and surface finish suit the application, and compare visible joints and edge details." };
const facedBoard = { name: "Laminate-faced board", detail: "Inspect the finish, substrate and edging together at sample scale." };
const sheet = { name: "Cabinet sheet and core", detail: "Confirm the sheet type, thickness, edge treatment and care guidance before choosing a specification." };
const stone = { name: "Stone-look surface", detail: "Review the pattern, seam placement and finish at full sample scale." };

export const exterior: Scene = {
  id: "arrival", number: "01", label: "Arrival", title: "Step inside.",
  description: "Explore the details that make a house feel like home.",
  poster: "/media/exterior-start.webp", endPoster: "/media/exterior-end.webp", video: "/media/exterior.mp4", features: [],
};

export const rooms: Scene[] = [
  {
    id: "living-room", number: "02", label: "Living room", title: "The living room.",
    description: "A composed TV wall, tactile panelling and storage that fits the room.",
    poster: "/media/living-start.webp", endPoster: "/media/living-end.webp", video: "/media/living.mp4",
    features: [
      {
        id: "tv-unit", title: "TV unit", description: "A stone-look backdrop frames the screen, with a low cabinet for everyday storage and concealed cable routes.",
        position: [58, 44], materials: [stone, composite, sheet], finishes: [walnut, champagne, charcoal],
        image: "/media/living-tv.webp", imageAlt: "Concept detail of the television and stone-look wall",
      },
      {
        id: "wall-panelling", title: "Fluted wall panels", description: "Vertical grooves bring texture to the feature wall and catch the light as you enter.",
        position: [70, 25], materials: [{ name: "Decorative fluted panel", detail: "Compare the panel core, pitch, joint finish and cleaning guidance." }, composite, facedBoard], finishes: [walnut, oak, charcoal],
        image: "/media/living-panels.webp", imageAlt: "Concept detail of dark wooden fluted panelling",
      },
      {
        id: "console-finishes", title: "Console finishes", description: "The low cabinet ties the warm wood, a pale backdrop and understated metal details together.",
        position: [64, 73], materials: [sheet, laminate, profile], finishes: [champagne, walnut, linen],
        image: "/media/living-end.webp", imageAlt: "Concept living room with low cabinetry and warm lighting",
      },
    ],
  },
  {
    id: "kitchen", number: "03", label: "Kitchen", title: "The modular kitchen.",
    description: "Cabinetry, shutters and surfaces designed around how you cook.",
    poster: "/media/kitchen.webp",
    features: [
      {
        id: "cabinet-shutters", title: "Cabinet shutters", description: "Pair a matte upper shutter with a warmer base cabinet to give the kitchen depth.",
        position: [69, 25], materials: [composite, facedBoard, profile], finishes: [champagne, linen, walnut],
        image: "/media/kitchen-shutters.webp", imageAlt: "Concept modular kitchen with warm cabinetry and task lighting",
      },
      {
        id: "island-and-storage", title: "Island & storage", description: "Plan preparation space and position deep storage near the way you use the kitchen.",
        position: [52, 69], materials: [stone, sheet], finishes: [linen, charcoal, oak],
        image: "/media/kitchen.webp", imageAlt: "Concept kitchen island and surrounding modular cabinets",
      },
    ],
  },
  {
    id: "bedroom", number: "04", label: "Bedroom", title: "The bedroom.",
    description: "Full-height storage and a dressing corner with space for daily routines.",
    poster: "/media/bedroom.webp",
    features: [
      {
        id: "wardrobe", title: "Full-height wardrobe", description: "Use the full wall height for a combination of hanging space, shelves and drawers.",
        position: [46, 38], materials: [profile, sheet, laminate], finishes: [walnut, champagne, charcoal],
        image: "/media/bedroom.webp", imageAlt: "Concept bedroom with full-height wardrobes",
      },
      {
        id: "dressing-unit", title: "Dressing unit", description: "A mirror, a lit work surface and nearby drawers bring essentials together.",
        position: [23, 47], materials: [profile, laminate, stone], finishes: [champagne, linen, walnut],
        image: "/media/bedroom-dressing.webp", imageAlt: "Concept bedroom with an integrated dressing unit",
      },
    ],
  },
  {
    id: "study", number: "05", label: "Study", title: "The study.",
    description: "A built-in desk and open shelves turn a quiet corner into a practical workspace.",
    poster: "/media/study.webp",
    features: [
      {
        id: "shelving", title: "Built-in shelving", description: "Set shelf heights around books, objects and the lighting you want to incorporate.",
        position: [49, 30], materials: [sheet, laminate], finishes: [walnut, oak, charcoal],
        image: "/media/study.webp", imageAlt: "Concept study with full-height custom shelving",
      },
      {
        id: "study-desk", title: "Study desk", description: "Build in an uncluttered work surface with room for a task light, cables and frequently used items.",
        position: [57, 64], materials: [laminate, sheet, stone], finishes: [oak, champagne, walnut],
        image: "/media/study-desk.webp", imageAlt: "Concept study with an integrated desk",
      },
    ],
  },
];

const concepts: Project[] = rooms.map((room) => ({
  slug: room.id + "-concept",
  sceneId: room.id,
  title: room.label + " concept",
  category: room.label,
  description: room.description,
  kind: "concept",
  images: Array.from(new Map([
    { src: room.endPoster ?? room.poster, alt: room.label + " wide concept view" },
    ...room.features.map((feature) => ({ src: feature.image, alt: feature.imageAlt })),
    ...(room.video ? [{ src: room.poster, alt: "Wide concept view from the living-room entrance" }] : []),
  ].map((item) => [item.src, item])).values()),
}));

// Add approved project entries and testimonial text here after client confirmation.
export const completedProjects: Project[] = [];
export const testimonials: { quote: string; attribution: string }[] = [];
export const projects = [...completedProjects, ...concepts];
export const getProjectsForScene = (id: string) => projects.filter((project) => project.sceneId === id);
