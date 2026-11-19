import "server-only";

export const indexable = process.env.SITE_INDEXABLE === "true";

export function siteUrl() {
  const value = process.env.SITE_URL?.trim();
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.origin;
  } catch {
    // A valid canonical URL is optional for local previews.
  }
}

export function whatsappNumber() {
  const value = process.env.WHATSAPP_NUMBER?.trim();
  return value && /^[1-9]\d{7,14}$/.test(value) ? value : "";
}

export function smtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, ENQUIRY_FROM, ENQUIRY_TO } = process.env;
  if (!SMTP_HOST || !ENQUIRY_FROM || !ENQUIRY_TO || Boolean(SMTP_USER) !== Boolean(SMTP_PASS)) return;
  const port = Number(SMTP_PORT || (SMTP_SECURE === "true" ? 465 : 587));
  if (!Number.isInteger(port) || port < 1 || port > 65535) return;
  return {
    options: {
      host: SMTP_HOST, port, secure: SMTP_SECURE === "true",
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
      connectionTimeout: 9000, greetingTimeout: 9000, socketTimeout: 13000,
      disableFileAccess: true, disableUrlAccess: true,
    },
    from: ENQUIRY_FROM,
    to: ENQUIRY_TO,
  };
}
