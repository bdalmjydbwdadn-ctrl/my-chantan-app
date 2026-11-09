import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowUpLeft, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import CartDrawer from "@/components/CartDrawer"
import SiteFooter from "@/components/SiteFooter"
import { WhatsAppFloat } from "@/components/home/SocialButtons"
import { useShop } from "@/lib/shop"
import { waLink, orderMessage } from "@/lib/contact"
import { useTranslation } from "react-i18next"

const catalog: Record<string, { title: string; french?: string; image: string; detail: string; contents?: string[]; saving?: number; individual?: number }> = {
  "serum-30": { title: "Argan face serum", french: "SÉRUM VISAGE", image: "/assets/p-serum30.webp", detail: "A face-care serum in a 30 ml bottle." },
  "serum-60": { title: "Argan hair serum", french: "SÉRUM CAPILLAIRE", image: "/assets/p-serum60.webp", detail: "A hair-care serum in a 60 ml bottle." },
  "shampoo-250": { title: "Argan shampoo", french: "SHAMPOOING", image: "/assets/p-shampoo.webp", detail: "Argan shampoo in a 250 ml bottle." },
  "bundle-complete": { title: "Complete care bundle", image: "/assets/bundle-complete.webp", detail: "A three-product face and hair care bundle.", contents: ["Face serum 30 ml", "Hair serum 60 ml", "Shampoo 250 ml"], individual: 690, saving: 91 },
  "bundle-serums": { title: "Serum duo", image: "/assets/bundle-serums.webp", detail: "A face and hair serum duo.", contents: ["Face serum 30 ml", "Hair serum 60 ml"], individual: 490, saving: 91 },
}
const schemaType = (slug: string) => slug.startsWith("bundle-") ? "ProductGroup" : "Product"

export default function ProductPage() {
  const { slug = "" } = useParams()
  const { t } = useTranslation()
  const { products, loaded, fmt, add, track, settings } = useShop()
  const [qty, setQty] = useState(1)
  const spec = catalog[slug]
  const product = useMemo(() => products.find((item) => item.slug === slug), [products, slug])
  useEffect(() => { setQty(1) }, [slug])
  useEffect(() => {
    if (!product || !spec) return
    document.title = t("{{title}} · {{size}} | TAFOKT N ODRAR", { title: t(spec.title), size: t(product.size || "") })
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", t(spec.detail))
    const schema = { "@context": "https://schema.org", "@type": schemaType(slug), name: t(spec.title), image: [spec.image], description: t(spec.detail), sku: product.slug, offers: { "@type": "Offer", priceCurrency: "MAD", price: product.price, availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } }
    const old = document.getElementById("product-schema"); old?.remove()
    const script = document.createElement("script"); script.id = "product-schema"; script.type = "application/ld+json"; script.text = JSON.stringify(schema); document.head.appendChild(script)
    track("ViewContent", { content_ids: [product.id], content_name: spec.title, value: product.price, currency: "MAD" })
    return () => document.getElementById("product-schema")?.remove()
  }, [product, spec, slug, t, track])
  if (!spec || (loaded && !product)) return <div className="min-h-screen bg-background px-5 pt-36 text-center"><p className="text-xl">{t("This product is not available.")}</p><Link to="/#products" className="mt-4 inline-block text-primary underline">{t("Back to products")}</Link></div>
  if (!product) return <div className="min-h-screen px-5 pt-36 text-center">{t("Loading…")}</div>
  const addToCart = () => add(product.id, qty)
  return <div className="min-h-screen bg-background text-foreground"><Navbar/><main className="mx-auto max-w-6xl px-5 pb-24 pt-32 md:pb-16 md:pt-36">
    <Link to="/#products" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowUpLeft className="h-4 w-4"/>{t("Back to the collection")}</Link>
    <div className="mt-5 grid gap-8 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-6"><div className="grid grid-cols-2 gap-3">
        <div className="product-detail-main col-span-2 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-[#EFE4D4] p-5"><img src={product.image_url || spec.image} alt={t(spec.title)} width="800" height="650" className="h-full w-full object-contain"/></div>
        {[1, 2, 3].map((n) => { const prefix = slug === "serum-30" ? "serum30" : slug === "serum-60" ? "serum60" : slug === "shampoo-250" ? "shampoo" : slug; const src = settings[`${prefix}_gallery_${n + 1}`]; return <div key={n} className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#173D2B]/20 bg-[#F7F3EA] text-center text-xs text-muted-foreground">{src ? <img src={src} alt={t(spec.title) + ` · ${n + 1}`} loading="lazy" className="h-full w-full object-cover"/> : <div><span className="block font-semibold text-[#173D2B]">{t("Gallery image slot")}</span><span className="mt-1">{n + 1} / 4</span></div>}</div> })}
      </div></div>
      <div className="md:col-span-6"><p className="text-xs font-semibold tracking-[0.16em] text-[#B69759]">{t("TAFOKT N ODRAR")}</p><h1 className="mt-3 text-3xl text-[#173D2B] md:text-5xl">{t(spec.title)}</h1>{spec.french && <p dir="ltr" className="mt-2 text-sm font-semibold tracking-[0.12em] text-muted-foreground">{t(spec.french)}</p>}<p className="mt-4 leading-7 text-muted-foreground">{t(spec.detail)}</p>
        {product.size && <p className="mt-4 text-sm font-semibold" dir="ltr">{t("Size")}: {product.size}</p>}
        {spec.contents?.length && <div className="mt-5 rounded-2xl border border-border bg-card p-4"><h2 className="font-semibold">{t("Bundle contents")}</h2><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{spec.contents?.map((item) => <li key={item}>{t(item)}</li>)}</ul><p className="mt-3 text-xs text-muted-foreground">{slug === "bundle-complete" ? t("Value of the individual products") : t("Value of the two items separately")}: <span className="line-through">{fmt(spec.individual || 0)}</span></p><p className="mt-1 text-sm font-semibold text-primary">{t("Save {{amount}} MAD", { amount: spec.saving })}</p></div>}
        <div className="mt-6 flex items-center justify-between border-y border-border py-4"><span className="font-display text-3xl font-bold text-primary">{fmt(product.price)}</span><div className="flex items-center gap-3 rounded-full border border-border p-1"><button type="button" aria-label={t("Less")} onClick={() => setQty((n) => Math.max(1, n - 1))} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"><Minus className="h-4 w-4"/></button><span aria-live="polite" className="w-6 text-center tabular-nums">{qty}</span><button type="button" aria-label={t("More")} onClick={() => setQty((n) => Math.min(product.stock || 1, 99, n + 1))} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"><Plus className="h-4 w-4"/></button></div></div>
        <Button className="mt-5 hidden h-12 w-full rounded-full md:flex" disabled={product.stock <= 0} onClick={addToCart}><ShoppingBag className="h-4 w-4"/>{t("Add to cart")}</Button>
        <a href={waLink(settings, orderMessage(t(spec.title) + (spec.french ? " (" + spec.french + ")" : ""), fmt(product.price)))} target="_blank" rel="noopener noreferrer" className="mt-3 flex h-12 w-full items-center justify-center rounded-full border border-primary/30 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">{t("Order now via WhatsApp")}</a>
        <div className="mt-7 divide-y divide-border border-y border-border">{["Full ingredients list", "How to use", "Shelf life", "Suitable for which skin or hair type", "Shipping and returns"].map((label) => <details key={label} className="group py-4"><summary className="cursor-pointer list-none font-semibold">{t(label)}</summary><p className="mt-3 text-sm leading-6 text-muted-foreground">{label === "How to use" ? <ol className="space-y-2">{[1, 2, 3].map((step) => <li key={step} className="flex gap-2"><span className="font-semibold text-primary">{step}.</span>{t("Brand-confirmed instructions will be added here.")}</li>)}</ol> : label === "Shipping and returns" ? <>{t("See our current delivery information and return request form on the policy pages.")} <Link className="text-primary underline" to="/shipping">{t("Shipping policy")}</Link> · <Link className="text-primary underline" to="/returns">{t("Returns & Refunds")}</Link></> : t("This information will be added once confirmed by the brand.")}</p></details>)}</div>
      </div>
    </div>
  </main><div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 shadow-lg backdrop-blur md:hidden"><div className="mx-auto flex max-w-6xl items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate text-xs text-muted-foreground">{t(spec.title)}</p><p className="font-display text-lg font-bold text-primary">{fmt(product.price)}</p></div><Button disabled={product.stock <= 0} onClick={addToCart} className="h-11 rounded-full px-5"><ShoppingBag className="h-4 w-4"/>{t("Order now")}</Button></div></div><SiteFooter/><CartDrawer/><WhatsAppFloat productName={t(spec.title)}/></div>
}