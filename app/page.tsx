import { HomeExperience } from "@/components/home-experience";
import { smtpConfig, whatsappNumber } from "@/lib/site-config";

export default function HomePage() {
  return <HomeExperience whatsapp={whatsappNumber()} emailEnabled={Boolean(smtpConfig())} />;
}
