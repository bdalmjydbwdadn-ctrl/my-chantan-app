import { MotionReveal, MotionItem } from "@/components/MotionReveal"
import { useTranslation } from "react-i18next"

const faqs = [
  { q: "How can I place an order?", a: "Choose a product or bundle, add it to your cart, and complete the order form. The team will confirm the order with you." },
  { q: "Can I pay on delivery?", a: "Cash on delivery is available. Select it in the cart before submitting your order." },
  { q: "Where can I find product ingredients?", a: "Product details are being added only after the brand confirms the information. Contact the team if you need a detail before ordering." },
  { q: "How do I request a return?", a: "Use the Returns & Refunds page to send a request, or contact the team using the phone number shown on the site." },
]
export function Lifestyle() { return null }
export function Faq() {
  const { t } = useTranslation()
  return <section id="faq" className="px-5 py-12 md:py-20"><div className="mx-auto max-w-3xl"><MotionReveal><MotionItem><p className="text-xs font-semibold tracking-[0.18em] text-primary">{t("HELP & INFORMATION")}</p></MotionItem><MotionItem><h2 className="mt-3 text-3xl md:text-4xl">{t("Frequently asked questions")}</h2></MotionItem></MotionReveal><div className="mt-6 divide-y divide-border border-y border-border">{faqs.map((item) => <details key={item.q} className="group py-4"><summary className="cursor-pointer list-none font-display text-lg transition-colors hover:text-primary">{t(item.q)}</summary><p className="mt-3 leading-7 text-muted-foreground">{t(item.a)}</p></details>)}</div></div></section>
}
