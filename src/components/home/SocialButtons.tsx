import { brandIcons } from "@/lib/brand-icons"
import { useShop } from "@/lib/shop"
import { waLink, withProduct, GENERAL_MESSAGE } from "@/lib/contact"
import { useTranslation } from "react-i18next"

function Glyph({ path, className }: { path: string; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d={path} /></svg>
}

export function WhatsAppFloat({ productName }: { productName?: string }) {
  const { t } = useTranslation()
  const { settings } = useShop()
  return (
    <a
      href={waLink(settings, withProduct(productName))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("Chat on WhatsApp")}
      className="fixed bottom-5 end-5 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-105"
    >
      <Glyph path={brandIcons.whatsapp} className="h-7 w-7" />
    </a>
  )
}

const valid = (url?: string) => Boolean(url && url.trim() && !url.includes("["))

export function SocialIcons({ values }: { values: Record<string, string> }) {
  const { t } = useTranslation()
  const items = [
    { key: "instagram", label: "Instagram TAFOKT N ODRAR", path: brandIcons.instagram, href: values.instagram },
    { key: "facebook", label: "Facebook TAFOKT N ODRAR", path: brandIcons.facebook, href: values.facebook },
    { key: "tiktok", label: "TikTok TAFOKT N ODRAR", path: brandIcons.tiktok, href: values.tiktok },
    { key: "whatsapp", label: "WhatsApp TAFOKT N ODRAR", path: brandIcons.whatsapp, href: waLink(values, GENERAL_MESSAGE) },
  ].filter((item) => item.key === "whatsapp" || valid(item.href))
  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((item) => (
        <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={t(item.label)} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#EFE4D4] text-[#173D2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#173D2B] hover:text-[#B69759] md:h-10 md:w-10">
          <Glyph path={item.path} className="h-[18px] w-[18px] md:h-5 md:w-5" />
        </a>
      ))}
    </div>
  )
}

export function SocialButtons(_props: { labels?: boolean; includeWhatsApp?: boolean }) {
  const { settings } = useShop()
  return <SocialIcons values={settings} />
}
