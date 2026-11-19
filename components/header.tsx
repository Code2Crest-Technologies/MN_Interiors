"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Wordmark() {
  return <span className="wordmark"><span className="monogram" aria-hidden="true">MN</span>
    <span>MN <b>INTERIORS</b><small>ERODE, TAMIL NADU</small></span></span>;
}

const nav = [
  { href: "/#arrival", label: "Walkthrough" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return <header className="site-header">
    <Link className="brand-link" href="/" aria-label="MN Interiors home" onClick={() => setOpen(false)}><Wordmark /></Link>
    <button className="menu-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"}
      aria-controls="site-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
      {open ? <X size={21} /> : <Menu size={21} />}
    </button>
    <nav className={open ? "site-nav open" : "site-nav"} id="site-navigation" aria-label="Main">
      {nav.map(({ href, label }) => <Link href={href} key={href} onClick={() => setOpen(false)}
        aria-current={href === pathname || (href === "/projects" && pathname.startsWith("/projects/")) ? "page" : undefined}>{label}</Link>)}
    </nav>
    <Link href="/#enquiry" className="header-cta" onClick={() => setOpen(false)}>Enquire <ArrowUpRight size={16} /></Link>
  </header>;
}
