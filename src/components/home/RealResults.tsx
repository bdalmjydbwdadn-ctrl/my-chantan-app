import { useShop } from "@/lib/shop"
import { useTranslation } from "react-i18next"

export default function RealResults() {
  const { t } = useTranslation()
  const { settings } = useShop()
  const pairReady = Boolean(settings.results_before && settings.results_after)
  const customers = [settings.customer_photo_1, settings.customer_photo_2, settings.customer_photo_3].filter(Boolean)
  if (!pairReady && customers.length === 0) return null
  return <section className="px-5 py-12 md:py-20"><div className="mx-auto max-w-6xl"><p className="text-xs font-semibold tracking-[0.18em] text-primary">{t("REAL STORIES")}</p><h2 className="mt-3 text-3xl md:text-4xl">{t("Shared by our customers")}</h2>
    {pairReady && <div className="mt-6 grid gap-4 sm:grid-cols-2">{[[settings.results_before, "Before"], [settings.results_after, "After"]].map(([src, label]) => <figure key={label}><img src={src} alt={t("{{label}} customer result photo", { label: t(label) })} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover"/><figcaption className="mt-2 text-sm text-muted-foreground">{t(label)}</figcaption></figure>)}</div>}
    {customers.length > 0 && <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">{customers.map((src, index) => <img key={src} src={src} alt={t("Customer-submitted product photo {{number}}", { number: index + 1 })} loading="lazy" className="aspect-square w-full rounded-2xl object-cover"/>)}</div>}
  </div></section>
}