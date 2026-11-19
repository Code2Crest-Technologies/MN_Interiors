import { ArrowDown } from "lucide-react";
import { MediaImage } from "./media-image";

export function CinematicHero({ title, subtitle, eyebrow, image, label = "AI CONCEPT VISUAL", anchor, action }: {
  title: string; subtitle: string; eyebrow: string; image: string; label?: string; anchor: string; action: string;
}) {
  return <section className="sub-hero">
    <div className="sub-media"><MediaImage src={image} alt="" eager /></div>
    <div className="sub-hero-content">
      <div className="eyebrow"><span className="gold-rule" /> {eyebrow}</div>
      <h1>{title}</h1><p>{subtitle}</p>
      <a className="button gold" href={anchor}>{action} <ArrowDown size={17} /></a>
    </div>
    <span className="concept-tag"><span /> {label}</span>
  </section>;
}
