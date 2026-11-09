import { ArrowDown, ShieldCheck } from "lucide-react"
import { MotionReveal, MotionItem } from "@/components/MotionReveal"
import { Button } from "@/components/ui/button"
import { useShop } from "@/lib/shop"
import { useTranslation } from "react-i18next"

export default function Hero() {
  const { t } = useTranslation()
  const { settings } = useShop()
  const img = settings.hero_image || "/assets/hero-orchard.webp"
  return <section id="top" className="relative flex min-h-[88svh] items-end overflow-hidden pb-14 pt-32 md:min-h-[90svh] md:items-center md:pb-16 md:pt-36">
    {settings.hero_video ? <video src={settings.hero_video} poster={img} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" /> : <img src={img} alt={t("Argan orchard in Morocco")} width="1600" height="1000" className="absolute inset-0 h-full w-full object-cover object-[center_60%]" />}
    <div className="absolute inset-0 bg-gradient-to-t from-[#10281e]/80 via-[#10281e]/35 to-[#10281e]/15" aria-hidden="true" />
    <div className="absolute inset-0 bg-gradient-to-l from-[#10281e]/60 via-transparent to-transparent" aria-hidden="true" />
    <div className="on-media relative mx-auto w-full max-w-6xl px-5">
      <MotionReveal delay={0} className="max-w-3xl">
        <MotionItem><p className="text-xs font-semibold tracking-[0.2em] text-[#D7BF8B]">{t("TAFOKT N ODRAR · MOROCCO")}</p></MotionItem>
        <MotionItem><h1 className="mt-4 max-w-2xl text-[clamp(2.9rem,8vw,6rem)] leading-[1.08] tracking-[-0.03em]">{t("Liquid gold from the Atlas.")}</h1></MotionItem>
        <MotionItem><p className="mt-5 max-w-xl text-base leading-7 text-white/90 md:text-lg">{t("A considered collection of argan care for face and hair, rooted in Moroccan nature.")}</p></MotionItem>
        <MotionItem><div className="mt-7 flex flex-wrap gap-3">
          <Button size="lg" className="h-12 rounded-full bg-[#F7F3EA] px-6 text-[#173D2B] hover:bg-white" asChild><a href="#products">{t("Shop now")}</a></Button>
          <Button size="lg" variant="outline" className="h-12 rounded-full border-white/70 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white" asChild><a href="#products-bundles">{t("Discover the bundles")}</a></Button>
        </div></MotionItem>
        <MotionItem><div className="mt-7 flex items-center gap-2 text-sm text-white/85"><ShieldCheck className="h-4 w-4 text-[#D7BF8B]" />{t("Cash on delivery available")}</div></MotionItem>
      </MotionReveal>
    </div>
    <a href="#products" aria-label={t("Scroll to products")} className="absolute bottom-5 start-1/2 hidden -translate-x-1/2 rounded-full border border-white/45 p-2 text-white/90 transition hover:bg-white/10 md:block"><ArrowDown className="h-4 w-4" /></a>
  </section>
}
