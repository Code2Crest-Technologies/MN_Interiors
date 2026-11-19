"use client";

import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { enquiryText, interests, validateEnquiry } from "@/lib/enquiry";

export function EnquiryForm({ whatsapp, emailEnabled, initialInterest = "", suggestedInterest }: {
  whatsapp: string; emailEnabled: boolean; initialInterest?: string; suggestedInterest?: { name: string };
}) {
  const select = useRef<HTMLSelectElement>(null);
  const [working, setWorking] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [preview, setPreview] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    if (suggestedInterest && select.current) select.current.value = suggestedInterest.name;
  }, [suggestedInterest]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const entry = validateEnquiry(payload);
    setPreview("");
    setCopyStatus("");
    if (!entry) {
      setFeedback("Please check your name, phone number and project notes.");
      return;
    }
    setWorking(true);
    setFeedback("");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(20000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Your enquiry could not be submitted.");
      if (data.status === "sent") {
        form.reset();
        setFeedback("Your enquiry was sent to MN Interiors.");
      } else {
        setPreview(enquiryText(entry));
        setFeedback("Enquiry preview ready. Email delivery is disabled in this preview.");
      }
    } catch (error) {
      setFeedback(error instanceof Error && error.name !== "TimeoutError"
        ? error.message : "The request timed out. Please try again.");
    } finally {
      setWorking(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(preview);
      setCopyStatus("Enquiry copied.");
    } catch {
      setCopyStatus("Select the message above to copy it manually.");
    }
  }

  return <form id="enquiry-form" className="enquiry-form" onSubmit={submit}>
    <div className="form-grid">
      <label>Your name<input name="name" autoComplete="name" minLength={2} maxLength={80} required /></label>
      <label>Phone number<input type="tel" name="phone" autoComplete="tel" maxLength={24} required /></label>
      <label>Email <span>(optional)</span><input type="email" name="email" autoComplete="email" maxLength={160} /></label>
      <label>Interested in<select id="enquiry-interest" name="interest" ref={select} defaultValue={initialInterest} required>
        <option value="">Select a space</option>{interests.map((item) => <option key={item}>{item}</option>)}
      </select></label>
      <label className="full-row">Tell us about your space<textarea name="message" rows={3} minLength={10} maxLength={1600} required /></label>
      <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    </div>
    <div className="form-actions">
      <button className="button gold" type="submit" disabled={working}>
        {working ? "Preparing…" : emailEnabled ? "Send enquiry" : "Preview enquiry"} <ArrowRight size={17} />
      </button>
      {whatsapp && <a className="text-link" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(preview || "Hello MN Interiors, I’d like to discuss an interiors project.")}`}
        target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={16} /></a>}
    </div>
    <div role="status" className="form-status">{feedback}</div>
    {preview && <div className="enquiry-preview">
      <textarea aria-label="Enquiry message preview" readOnly value={preview} rows={7} />
      <button type="button" className="text-link" onClick={copy}>
        {copyStatus === "Enquiry copied." ? <Check size={16} /> : <Copy size={16} />} Copy message
      </button>
      <span className="small-note" role="status">{copyStatus}</span>
    </div>}
  </form>;
}
