import { useEffect, useState } from "react"
import { BadgePercent } from "lucide-react"
import { useShop } from "@/lib/shop"
import { useTranslation } from 'react-i18next'

function useCountdown(end: Date) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i) }, [])
  const s = Math.max(0, Math.floor((end.getTime() - now) / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 }
}

export default function OfferBand() {
  const { t } = useTranslation()
  const { pct, endsAt } = useShop()
  const c = useCountdown(endsAt)
  if (!pct) return null
  const cells: [number, string][] = [[c.d, "days"], [c.h, "hours"], [c.m, "min"], [c.s, "sec"]]
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-8 md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <BadgePercent className="mt-1 h-8 w-8 shrink-0 text-[hsl(var(--gold))]" />
          <div>
            <h2 className="text-2xl md:text-3xl">{t("Monthly offer:")} {pct}{t("% off everything")}</h2>
            <p className="text-sm opacity-80">{t("Your coupon MONTHLY")}{pct} {t("is applied automatically at checkout. No code to type.")}</p>
          </div>
        </div>
        <div className="flex gap-2" dir="ltr">
          {cells.map(([v, l]) => (
            <div key={l} className="min-w-16 border border-primary-foreground/30 px-3 py-2 text-center">
              <div className="font-display text-2xl tabular-nums">{String(v).padStart(2, "0")}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-70">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
