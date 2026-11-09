import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

export default function AnalyticsConsent() {
  const { t } = useTranslation()
  const [show, setShow] = useState(() => localStorage.getItem("tafokt-analytics-consent") == null)
  if (!show) return null
  const choose = (value: "accepted" | "essential") => {
    localStorage.setItem("tafokt-analytics-consent", value)
    setShow(false)
    if (value === "accepted") window.location.reload()
  }
  return <aside aria-label={t("Privacy choices")} className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-background p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
    <p className="text-sm leading-6 text-muted-foreground">{t("This store uses optional analytics only after you choose to allow them. Essential shopping features work either way.")}</p>
    <div className="flex shrink-0 gap-2"><Button variant="outline" className="rounded-full" onClick={() => choose("essential")}>{t("Essential only")}</Button><Button className="rounded-full" onClick={() => choose("accepted")}>{t("Allow analytics")}</Button></div>
  </aside>
}