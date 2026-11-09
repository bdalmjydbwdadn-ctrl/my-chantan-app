import { ArrowUpLeft } from "lucide-react"
import { useShop } from "@/lib/shop"
import { useTranslation } from "react-i18next"

export function MoroccanRoots() {
  const { t } = useTranslation()
  const { settings } = useShop()
  return <section className="px-5 py-12 md:py-20" aria-labelledby="moroccan-roots-title"><div className="mx-auto grid max-w-6xl overflow-hidden rounded-[1.75rem] bg-[#173D2B] text-[#F7F3EA] md:grid-cols-12">
    <div className="flex flex-col justify-center px-7 py-10 sm:px-10 md:col-span-8 md:px-14 md:py-14"><p className="text-xs font-semibold tracking-[0.18em] text-[#D0B77E]">{t("ROOTED IN MOROCCO")}</p><h2 id="moroccan-roots-title" className="mt-4 text-3xl leading-tight md:text-5xl">{t("Moroccan roots, care for every day")}</h2><p className="mt-4 max-w-xl text-sm leading-7 text-white/80 md:text-base">{t("TAFOKT N ODRAR is a Moroccan skincare and haircare brand inspired by the argan tree and the beauty of Moroccan nature.")}</p><a href="#products" className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#F7F3EA] px-5 text-sm font-semibold text-[#173D2B] transition-transform hover:scale-[1.02]">{t("Discover our collection")}<ArrowUpLeft className="h-4 w-4"/></a></div>
    <div className="flex min-h-44 items-center justify-center border-t border-white/10 bg-[#123323] p-8 md:col-span-4 md:border-s md:border-t-0"><div className="branch-appear"><div className="branch-float relative h-[220px] w-[220px] md:h-[320px] md:w-[320px]"><span aria-hidden="true" className="absolute -inset-3 rounded-full border border-dashed border-[#d9b45a]/70"/><img src={settings.argan_branch_image || "/assets/argan-branch.webp"} alt="غصن شجرة الأركان بثمارها - تافوكت ن ودرار" width="320" height="320" loading="lazy" decoding="async" className="h-full w-full rounded-full border-[3px] border-[#d9b45a] object-cover object-center shadow-[0_18px_40px_rgba(0,0,0,0.35),0_0_32px_rgba(217,180,90,0.35)]"/></div></div></div>
  </div></section>
}
