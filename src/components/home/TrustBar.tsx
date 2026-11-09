import { BadgeCheck, Droplets, Leaf, ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

const items = [
  { title: "Cold-pressed", icon: Droplets },
  { title: "No preservatives", icon: ShieldCheck },
  { title: "Made in Morocco", icon: Leaf },
  { title: "Money-back guarantee", icon: BadgeCheck },
]
export default function TrustBar() {
  const { t } = useTranslation()
  return <section className="mx-auto max-w-6xl px-5 py-8 md:py-12" aria-label={t("Product assurances")}>
    <div className="grid grid-cols-2 border-y border-[#173D2B]/15 md:grid-cols-4">
      {items.map(({ title, icon: Icon }) => <div key={title} className="flex min-h-16 items-center justify-center gap-2 border-b border-[#173D2B]/10 px-2 py-3 text-center text-xs font-semibold text-[#173D2B] last:border-0 sm:text-sm md:border-b-0 md:border-e md:last:border-e-0">
        <Icon className="h-4 w-4 shrink-0 text-[#B69759]" strokeWidth={1.8} /><span>{t(title)}</span>
      </div>)}
    </div>
  </section>
}
