import { ArrowUpLeft, Package, CircleDot, Droplets, ImagePlus, Leaf } from "lucide-react"
import { Link } from "react-router-dom"
import { MotionReveal, MotionItem } from "@/components/MotionReveal"
import { useShop } from "@/lib/shop"
import { useTranslation } from "react-i18next"

export function Intro() {
  const { t } = useTranslation()
  return <section className="mx-auto max-w-6xl px-5 py-12 md:py-20"><MotionReveal><MotionItem><p className="max-w-4xl font-display text-3xl leading-tight text-[#173D2B] md:text-5xl">{t("Every drop begins in the shade of a tree that grows nowhere else on Earth.")}</p></MotionItem></MotionReveal></section>
}
export function Founder() {
  const { t } = useTranslation()
  return <section id="founder" className="bg-[#F7F3EA] px-5 py-12 md:py-20"><div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[1.5rem] border border-[#173D2B]/10 bg-background p-6 md:grid-cols-12 md:p-10">
    <div className="md:col-span-8"><p className="text-xs font-semibold tracking-[0.18em] text-[#B69759]">{t("A MOROCCAN BRAND")}</p><h2 className="mt-3 text-3xl text-[#173D2B] md:text-4xl">{t("Care inspired by the argan tree.")}</h2><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{t("TAFOKT N ODRAR brings together a focused collection for face and hair, inspired by Morocco’s argan landscapes.")}</p><Link to="/about" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline">{t("About the brand")}<ArrowUpLeft className="h-4 w-4"/></Link></div>
    <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-dashed border-[#173D2B]/30 bg-[#F7F3EA] p-5 text-center text-sm text-muted-foreground md:col-span-4"><ImagePlus className="mb-3 h-7 w-7 text-[#B69759]"/><span>{t("Product or ingredient photo slot")}</span><span className="mt-1 text-xs">{t("Add an approved brand photo when ready")}</span></div>
  </div></section>
}
const steps = [{ title: "Gather", key: "process_gather_image", icon: Leaf }, { title: "Crack", key: "process_crack_image", icon: CircleDot }, { title: "Press", key: "process_press_image", icon: Droplets }, { title: "Bottle", key: "process_bottle_image", icon: Package }]
export function Process() {
  const { t } = useTranslation()
  const { settings } = useShop()
  return <section className="px-5 py-12 md:py-20"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-semibold tracking-[0.18em] text-primary">{t("FROM TREE TO BOTTLE")}</p><h2 className="mt-3 text-3xl md:text-4xl">{t("Slow by design.")}</h2><p className="mt-3 leading-7 text-muted-foreground">{t("A simple look at the stages behind argan care. Add your own verified process details and photography at any time.")}</p></div>
    <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{steps.map(({ title, key, icon: Icon }, index) => <li key={title} className="rounded-2xl border border-[#173D2B]/10 bg-[#F7F3EA] p-4"><div className="flex items-center justify-between"><span className="font-display text-2xl text-[#B69759]">0{index + 1}</span><Icon className="h-5 w-5 text-primary"/></div>{settings[key] ? <img src={settings[key]} alt={t("{{step}} process photography", { step: t(title) })} loading="lazy" className="mt-4 aspect-[4/3] w-full rounded-xl object-cover"/> : <div className="mt-4 flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-dashed border-[#173D2B]/20 bg-background text-center text-xs text-muted-foreground"><ImagePlus className="mb-2 h-5 w-5 text-[#B69759]"/>{t("Real photo slot")}</div>}<h3 className="mt-3 text-xl">{t(title)}</h3></li>)}</ol>
  </div></section>
}
export function Ingredients() {
  const { t } = useTranslation()
  return <section id="ingredients" className="bg-[#F7F3EA] px-5 py-12 md:py-20"><div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-12 md:items-end"><div className="md:col-span-8"><p className="text-xs font-semibold tracking-[0.18em] text-[#B69759]">{t("PRODUCT INFORMATION")}</p><h2 className="mt-3 text-3xl text-[#173D2B] md:text-4xl">{t("Clear details, product by product.")}</h2><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{t("Ingredients and usage information are shown on each product page only when confirmed by the brand.")}</p></div><Link to="/products/serum-30" className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline">{t("Explore product details")}<ArrowUpLeft className="h-4 w-4"/></Link></div></section>
}
