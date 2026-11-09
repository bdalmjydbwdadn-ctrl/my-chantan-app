import { useMemo, useState } from "react"
import { ArrowUpLeft, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MotionItem, MotionReveal } from "@/components/MotionReveal"
import { useShop, type Product } from "@/lib/shop"
import { useTranslation } from "react-i18next"

type Kind = "product" | "bundle"
type CatalogSpec = { slug: string; kind: Kind; title: string; image: string; french?: string; size?: string; detail: string; contents?: string[]; standalone?: number; saving?: number; badge?: string }
type CatalogEntry = CatalogSpec & { product: Product }
const catalog: CatalogSpec[] = [
  { slug: "serum-30", kind: "product", title: "Argan face serum", image: "/assets/p-serum30.webp", french: "SÉRUM VISAGE", size: "30 ml", detail: "A face-care serum in a 30 ml bottle." },
  { slug: "serum-60", kind: "product", title: "Argan hair serum", image: "/assets/p-serum60.webp", french: "SÉRUM CAPILLAIRE", size: "60 ml", detail: "A hair-care serum in a 60 ml bottle." },
  { slug: "shampoo-250", kind: "product", title: "Argan shampoo", image: "/assets/p-shampoo.webp", french: "SHAMPOOING", size: "250 ml", detail: "Argan shampoo in a 250 ml bottle." },
  { slug: "bundle-complete", kind: "bundle", title: "Complete care bundle", image: "/assets/bundle-complete.webp", detail: "A three-product face and hair care bundle.", contents: ["Face serum 30 ml", "Hair serum 60 ml", "Shampoo 250 ml"], standalone: 690, saving: 91, badge: "Complete care" },
  { slug: "bundle-serums", kind: "bundle", title: "Serum duo", image: "/assets/bundle-serums.webp", detail: "A face and hair serum duo.", contents: ["Face serum 30 ml", "Hair serum 60 ml"], standalone: 490, saving: 91 },
]
function Card({ entry, popular }: { entry: CatalogEntry; popular?: boolean }) {
  const { t } = useTranslation()
  const { fmt, add } = useShop()
  const bundle = entry.kind === "bundle"
  return <MotionItem className="h-full"><article className={`catalog-card group flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm transition-shadow duration-500 hover:shadow-lg ${popular ? "catalog-card-featured" : ""}`}>
    <Link to={`/products/${entry.slug}`} aria-label={`${t("Discover details")}: ${t(entry.title)}`} className={`catalog-image-frame relative block overflow-hidden ${bundle ? "aspect-[1.6/1]" : "aspect-[4/3]"}`}>
      {entry.badge && <Badge className="catalog-feature-badge absolute start-3 top-3 z-10 rounded-full px-3 py-1">{t(entry.badge)}</Badge>}
      {popular && <Badge className="absolute end-3 top-3 z-10 rounded-full bg-[#B69759] px-3 py-1 text-[#173D2B]">{t("Most popular")}</Badge>}
      <img src={entry.product.image_url || entry.image} alt={t(entry.title) + (entry.french ? ` — ${entry.french}` : "")} loading="lazy" width="700" height="520" draggable={false} className="catalog-product-image h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
    </Link>
    <div className={`flex flex-1 flex-col ${bundle ? "p-4 md:p-5" : "p-5 md:p-6"}`}>
      <div className="min-h-[5.5rem]"><h3 className={`font-display leading-tight text-foreground ${bundle ? "text-xl md:text-2xl" : "text-2xl md:text-[1.7rem]"}`}>{t(entry.title)}</h3>{entry.french && <p className="mt-1 text-xs font-semibold tracking-[0.12em] text-muted-foreground" dir="ltr">{t(entry.french)}</p>}<p className="mt-2 text-sm text-muted-foreground" dir="ltr">{bundle ? t("Bundle includes") : entry.size}</p></div>
      {bundle ? <div className="mt-2 border-t border-border/80 pt-2.5"><p className="text-xs text-muted-foreground">{entry.slug === "bundle-complete" ? t("Value of the individual products") : t("Value of the two items separately")}: <span className="line-through">{fmt(entry.standalone || 0)}</span></p><ul className="mt-2 space-y-1 text-xs leading-snug text-muted-foreground">{entry.contents?.map((item) => <li key={item}>{t(item)}</li>)}</ul></div> : <p className="mt-3 min-h-16 border-t border-border/80 pt-3 text-sm leading-relaxed text-muted-foreground">{t(entry.detail)}</p>}
      <div className="mt-auto pt-4">{bundle && entry.saving && <p className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{t("Save {{amount}} MAD", { amount: entry.saving })}</p>}<p className="font-display text-2xl font-bold text-primary">{fmt(entry.product.price)}</p><Button className="mt-3 h-11 w-full rounded-full" disabled={entry.product.stock <= 0} onClick={() => add(entry.product.id, 1)}><ShoppingBag className="h-4 w-4"/>{entry.product.stock > 0 ? t("Add to cart") : t("Out of stock")}</Button><Link to={`/products/${entry.slug}`} className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline">{t("Discover details")}<ArrowUpLeft className="h-4 w-4"/></Link></div>
    </div>
  </article></MotionItem>
}
export default function Products() {
  const { t } = useTranslation()
  const { products, loaded } = useShop()
  const [filter, setFilter] = useState<"all" | Kind>("all")
  const entries = useMemo(() => catalog.flatMap((spec) => { const product = products.find((item) => item.slug === spec.slug && item.active); return product ? [{ ...spec, product }] : [] }), [products])
  const visible = entries.filter((entry) => filter === "all" || entry.kind === filter)
  const single = visible.filter((entry) => entry.kind === "product")
  const bundles = visible.filter((entry) => entry.kind === "bundle")
  return <section id="products" className="catalog-section scroll-mt-24 px-4 py-12 sm:px-5 md:py-20"><div className="mx-auto max-w-7xl">
    <MotionReveal className="mx-auto max-w-3xl text-center"><MotionItem><p className="text-xs font-semibold tracking-[0.18em] text-primary">{t("TAFOKT N ODRAR ·")} {t("THE COLLECTION")}</p></MotionItem><MotionItem><h2 className="mt-3 text-3xl leading-tight text-foreground md:text-5xl">{t("Choose your argan care")}</h2></MotionItem><MotionItem><p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">{t("Face and hair care with a Moroccan spirit.")}</p></MotionItem></MotionReveal>
    <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label={t("Filter products and bundles")}>{([["all", "All"], ["product", "Products"], ["bundle", "Bundles"]] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${filter === value ? "border-primary bg-primary text-primary-foreground" : "border-primary/20 bg-card/60 text-foreground hover:border-primary/50"}`}>{t(label)}</button>)}</div>
    {!loaded ? <p className="py-16 text-center text-muted-foreground">{t("Loading…")}</p> : <>
      {single.length > 0 && <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">{single.map((entry) => <Card key={entry.slug} entry={entry}/>)}</div>}
      {bundles.length > 0 && <div id="products-bundles" className="mt-10 scroll-mt-24"><div className="mb-4 flex items-end justify-between gap-4"><h3 className="font-display text-2xl text-foreground md:text-3xl">{t("Curated bundles")}</h3><span className="text-xs text-muted-foreground">{t("Two considered combinations")}</span></div><div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">{bundles.map((entry) => <Card key={entry.slug} entry={entry} popular={entry.slug === "bundle-complete"}/>)}</div></div>}
      {!visible.length && <p className="py-16 text-center text-muted-foreground">{t("No products to show.")}</p>}
    </>}
  </div></section>
}
