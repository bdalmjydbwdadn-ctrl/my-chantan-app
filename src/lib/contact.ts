// Single source of truth for the store's WhatsApp / phone number.
// Editable in the dashboard (setting key "whatsapp"); this default is used until it is saved.
export const DEFAULT_PHONE = "212673503800"

export function contactInfo(settings: Record<string, string>) {
  let digits = (settings.whatsapp || "").replace(/\D/g, "")
  if (digits.startsWith("00")) digits = digits.slice(2)
  if (digits.startsWith("0")) digits = "212" + digits.slice(1)
  if (digits.length < 9 || /^2120{6,}/.test(digits)) digits = DEFAULT_PHONE
  const local = digits.startsWith("212") ? "0" + digits.slice(3) : "+" + digits
  const display = digits.startsWith("212") ? local.replace(/(\d{2})(?=\d)/g, "$1 ").trim() : local
  return { digits, intl: "+" + digits, display, tel: "tel:+" + digits }
}

export const waLink = (settings: Record<string, string>, message?: string) =>
  "https://wa.me/" + contactInfo(settings).digits + (message ? "?text=" + encodeURIComponent(message) : "")

export const GENERAL_MESSAGE = "السلام عليكم، بغيت نستفسر على منتجات TAFOKT N ODRAR"
export const orderMessage = (name: string, price: string) => `السلام عليكم، بغيت نطلب ${name} بثمن ${price}`
export const withProduct = (name?: string) => (name ? GENERAL_MESSAGE + " — " + name : GENERAL_MESSAGE)
