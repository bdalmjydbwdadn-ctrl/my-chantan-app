import { ShoppingBag, TreeDeciduous } from "lucide-react"
import { Link } from "react-router-dom"
import { useShop } from "@/lib/shop"
import { useTranslation } from "react-i18next"
import { LanguageToggle } from "./LanguageToggle"

export default function Navbar() {
  const { t } = useTranslation()
  const { count, setOpen } = useShop()
  return <div className="fixed inset-x-0 top-0 z-40">
    <div className="bg-[#173D2B] px-3 py-1.5 text-center text-[11px] font-medium text-[#F7F3EA] sm:text-xs">{t("Free delivery from 300 MAD · Cash on delivery")}</div>
    <header className="border-b border-[#173D2B]/10 bg-[#F7F3EA]/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-5">
        <Link to="/" aria-label={t("TAFOKT N ODRAR home")} className="flex min-w-0 items-center gap-2.5 leading-none">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#173D2B] text-[#B69759]"><TreeDeciduous className="h-6 w-6" /></span>
          <span className="flex min-w-0 flex-col gap-1"><span className="truncate font-display text-sm font-bold tracking-wide text-[#173D2B] sm:text-base">{t("TAFOKT N ODRAR")}</span><span className="truncate text-[10px] text-[#52645A]"><span className="tifinagh-wordmark">{t("ⵜⴰⴼⵓⴽⵜ ⵏ ⵓⴷⵔⴰⵔ")}</span> · {t("Made in Morocco")}</span></span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm lg:flex">
          <a className="transition-colors hover:text-primary" href="/#products">{t("Products")}</a>
          <a className="transition-colors hover:text-primary" href="/#founder">{t("Our story")}</a>
          <a className="transition-colors hover:text-primary" href="/#support">{t("Contact")}</a>
          <LanguageToggle />
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <div className="lg:hidden"><LanguageToggle /></div>
          <button type="button" onClick={() => setOpen(true)} aria-label={t("Cart")} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#173D2B]/20 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ShoppingBag className="h-4 w-4" />{count > 0 && <span className="absolute -top-1.5 -end-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B69759] px-1 text-[11px] text-[#173D2B]">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  </div>
}
