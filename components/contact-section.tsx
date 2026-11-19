import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { brand } from "@/lib/content";
import { EnquiryForm } from "./enquiry-form";
import { MediaImage } from "./media-image";

export function ContactSection({ whatsapp, emailEnabled, initialInterest, suggestedInterest, heading = "Let’s design your space." }: {
  whatsapp: string; emailEnabled: boolean; initialInterest?: string; suggestedInterest?: { name: string }; heading?: string;
}) {
  return <section className="contact-section" id="enquiry" aria-labelledby="enquiry-title">
    <div className="contact-media"><MediaImage src="/media/living-end.webp" alt="" /></div>
    <div className="contact-inner">
      <div className="contact-content">
        <div className="eyebrow"><span className="gold-rule" /> CONSULTATION</div>
        <h2 id="enquiry-title">{heading}</h2>
        <p>Tell us what you’re planning, from a single TV unit to a home with several spaces.</p>
        <div className="contact-location"><MapPin size={17} /> {brand.place}</div>
        <div className="contact-methods">
          {whatsapp && <a className="text-link" href={`tel:+${whatsapp}`}><Phone size={15} /> +{whatsapp}</a>}
          <a href={brand.instagram} className="text-link" target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={15} /></a>
        </div>
      </div>
      <EnquiryForm whatsapp={whatsapp} emailEnabled={emailEnabled} initialInterest={initialInterest} suggestedInterest={suggestedInterest} />
    </div>
  </section>;
}
