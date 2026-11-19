import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return <section className="about-section not-found"><h1>This page is unavailable.</h1>
    <Link className="button gold" href="/">Return to the walkthrough <ArrowUpRight size={17} /></Link></section>;
}
