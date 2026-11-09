import { Banknote, CreditCard, Phone, TreeDeciduous } from "lucide-react"
import { SocialIcons } from "@/components/home/SocialButtons"
import { Link } from "react-router-dom"
import { useEffect } from "react"
import { useShop } from "@/lib/shop"
import { contactInfo } from "@/lib/contact"
import { useTranslation } from "react-i18next"

export default function SiteFooter() {
  const { t } = useTranslation()
  const { settings } = useShop()
  const phone = contactInfo(settings)
  useEffect(() => {
    const schema = { "@context": "https://schema.org", "@type": "Organization", name: "TAFOKT N ODRAR", url: window.location.origin, telephone: phone.intl, contactPoint: { "@type": "ContactPoint", telephone: phone.intl, contactType: "customer service" } }
    document.getElementById("org-schema")?.remove()
    const s = document.createElement("script"); s.id = "org-schema"; s.type = "application/ld+json"; s.text = JSON.stringify(schema); document.head.appendChild(s)
    return () => document.getElementById("org-schema")?.remove()
  }, [phone.intl])
  const links = [
    ["About us", "/about"], ["Shipping policy", "/shipping"], ["Returns & Refunds", "/returns"],
    ["Terms", "/terms"], ["Privacy", "/privacy"], ["Contact", "/#support"],
  ]
  return <footer className="border-t border-border bg-primary text-primary-foreground">
    <div className="mx-auto grid max-w-6xl gap-9 px-5 py-12 md:grid-cols-4 md:py-16">
      <div className="md:col-span-1">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[hsl(var(--gold))]/60 text-[hsl(var(--gold))]"><TreeDeciduous className="h-6 w-6" /></span>
          <span><b className="font-display tracking-wide">{t("TAFOKT N ODRAR")}</b><span className="mt-1 block text-xs opacity-75">{t("Made in Morocco")}</span></span>
        </Link>
        <p className="mt-4 max-w-xs text-sm leading-7 opacity-80">{t("Moroccan argan care for face and hair.")}</p>
      </div>
      <nav aria-label={t("Store information")} className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm md:col-span-2">
        {links.map(([label, href]) => <Link key={href} to={href} className="w-fit opacity-85 transition-opacity hover:opacity-100 hover:underline">{t(label)}</Link>)}
      </nav>
      <div className="space-y-4 text-sm">
        <p className="font-semibold">{t("Contact")}</p>
        <a href={phone.tel} className="flex items-center gap-2 opacity-85" dir="ltr"><Phone className="h-4 w-4" />{phone.display}</a>
        <SocialIcons values={settings} />
        <div className="flex flex-wrap gap-3 text-xs opacity-75"><span className="inline-flex items-center gap-1.5"><Banknote className="h-4 w-4"/>{t("Cash on delivery")}</span><span className="inline-flex items-center gap-1.5"><CreditCard className="h-4 w-4"/>{t("Online payment by arrangement")}</span></div>
      </div>
    </div>
    <div className="border-t border-primary-foreground/15 px-5 py-4 text-center text-xs opacity-70">{t("© 2026 TAFOKT N ODRAR")}</div>
  </footer>
}