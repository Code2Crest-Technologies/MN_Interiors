export const interests = ["Living room", "Kitchen", "Bedroom", "Study", "Multiple spaces", "Something else"];

export type Enquiry = { name: string; phone: string; email: string; interest: string; message: string };

export function validateEnquiry(payload: unknown): Enquiry | undefined {
  if (!payload || typeof payload !== "object") return;
  const entry = payload as Record<string, unknown>;
  const read = (key: string) => typeof entry[key] === "string" ? entry[key].trim() : "";
  const name = read("name");
  const phone = read("phone");
  const email = read("email");
  const interest = read("interest");
  const message = read("message");
  if (name.length < 2 || name.length > 80 || /[\r\n]/.test(name)) return;
  if (phone.length > 24 || !/^\+?[\d ().-]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, ""))) return;
  if (email.length > 160 || (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))) return;
  if (!interests.includes(interest) || message.length < 10 || message.length > 1600) return;
  return { name, phone, email, interest, message };
}

export function enquiryText(entry: Enquiry) {
  return [
    "Hello MN Interiors, I’d like to discuss an interiors project.",
    "",
    "Name: " + entry.name,
    "Phone: " + entry.phone,
    ...(entry.email ? ["Email: " + entry.email] : []),
    "Interested in: " + entry.interest,
    "",
    entry.message,
  ].join("\n");
}
