import { useShop } from "@/lib/shop"
import { useTranslation } from "react-i18next"

const certificateSlots = ["ONSSA certificate", "Organic certificate", "Laboratory test"]
export default function Cooperative() {
  const { t } = useTranslation()
  const { settings } = useShop()
  const name = settings.cooperative_name?.trim()
  const region = settings.region?.trim()
  const filled = certificateSlots.map((label, i) => ({ label, value: settings[`certificate_${i + 1}`]?.trim() })).filter((item) => item.value)
  return <section className="px-5 py-12 md:py-20"><div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-3xl border border-[#173D2B]/10 bg-[#F7F3EA] p-6 md:flex-row md:items-center md:justify-between md:p-8">
    <div><p className="text-xs font-semibold tracking-[0.18em] text-[#B69759]">{t("FROM THE COOPERATIVE")}</p><h2 className="mt-2 text-2xl text-[#173D2B]">{name || t("Cooperative details to be added")}</h2><p className="mt-1 text-sm text-muted-foreground">{region || t("Region details to be added")}</p></div>
    <div className="flex flex-wrap gap-2">{filled.length ? filled.map(({ label, value }) => <span key={label} className="rounded-full border border-[#173D2B]/20 bg-background px-3 py-1.5 text-xs font-medium text-[#173D2B]">{t(value || label)}</span>) : certificateSlots.map((label) => <span key={label} className="rounded-full border border-dashed border-[#173D2B]/25 px-3 py-1.5 text-xs text-muted-foreground">{t(label)} · {t("slot")}</span>)}</div>
  </div></section>
}