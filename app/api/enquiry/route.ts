import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { enquiryText, validateEnquiry } from "@/lib/enquiry";
import { siteUrl, smtpConfig } from "@/lib/site-config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const reply = (body: { status?: "preview" | "sent"; error?: string }, status = 200) =>
    NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin && origin !== siteUrl()) {
    return reply({ error: "Please submit the enquiry from the website." }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return reply({ error: "Please use the enquiry form." }, 415);
  }

  // Count stream bytes before parsing, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return reply({ error: "Missing enquiry." }, 400);
  const decoder = new TextDecoder();
  let length = 0;
  let raw = "";
  let payload: unknown;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 12000) {
        void reader.cancel().catch(() => undefined);
        return reply({ error: "The enquiry is too long." }, 413);
      }
      raw += decoder.decode(value, { stream: true });
    }
    payload = JSON.parse(raw + decoder.decode());
  } catch {
    return reply({ error: "Please check the enquiry and try again." }, 400);
  }

  if (typeof payload === "object" && payload && "website" in payload && payload.website) {
    return reply({ error: "Please submit the enquiry yourself." }, 400);
  }
  const enquiry = validateEnquiry(payload);
  if (!enquiry) return reply({ error: "Please check your contact details, interest and project notes." }, 400);

  const smtp = smtpConfig();
  if (!smtp) return reply({ status: "preview" });

  try {
    const transporter = nodemailer.createTransport(smtp.options);
    const delivery = await transporter.sendMail({
      from: smtp.from, to: smtp.to, subject: "Website enquiry — " + enquiry.interest,
      replyTo: enquiry.email || undefined, text: enquiryText(enquiry),
    });
    if (delivery.accepted.length === 0) return reply({ error: "Email delivery is unavailable. Please try again." }, 502);
    return reply({ status: "sent" });
  } catch {
    return reply({ error: "Email delivery is unavailable. Please try again or use WhatsApp if available." }, 502);
  }
}
