import type { Metadata } from "next";
import { CinematicHero } from "@/components/cinematic-hero";
import { ContactSection } from "@/components/contact-section";
import { interests } from "@/lib/enquiry";
import { smtpConfig, whatsappNumber } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ask MN Interiors in Erode about an interiors consultation or share details of your space.",
};

export default async function ContactPage({ searchParams }: {
  searchParams: Promise<{ interest?: string | string[] }>;
}) {
  const { interest } = await searchParams;
  const initialInterest = typeof interest === "string" && interests.includes(interest) ? interest : "";
  return <>
    <CinematicHero title="A conversation starts here." subtitle="Tell us what you’d like to build, update or rethink."
      eyebrow="CONTACT" image="/media/study.webp" anchor="#enquiry" action="Open the enquiry form" />
    <ContactSection whatsapp={whatsappNumber()} emailEnabled={Boolean(smtpConfig())} initialInterest={initialInterest} heading="Share your plans." />
  </>;
}
