import { useState } from "react"
import { waLink } from "@/lib/contact"
import { Minus, Plus, Trash2, CheckCircle2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { supabase } from "@/lib/chantan-db"
import { useShop } from "@/lib/shop"
import { useTranslation } from 'react-i18next'

export default function CartDrawer() {
  const { t } = useTranslation()
  const { open, setOpen, cart, products, setQty, clear, fmt, pct, settings, track } = useShop()
  const [f, setF] = useState({ name: "", phone: "", city: "", address: "" })
  const [pay, setPay] = useState<"cod" | "online">("cod")
  const [busy, setBusy] = useState(false)
  const [doneRef, setDoneRef] = useState<string | null>(null)

  const lines = cart.map((c) => ({ ...c, p: products.find((p) => p.id === c.id) })).filter((l) => l.p)
  const subtotal = lines.reduce((a, l) => a + l.p!.price * l.qty, 0)
  const total = subtotal * (100 - pct) / 100

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lines.length) return
    setBusy(true)
    track("InitiateCheckout", { value: total, currency: "MAD" })
    const id = crypto.randomUUID()
    try {
      const { error } = await supabase.from("orders").insert({
        id, customer_name: f.name, phone: f.phone, city: f.city, address: f.address, payment_method: pay,
        items: lines.map((l) => ({ id: l.id, qty: l.qty })),
      })
      if (error) throw error
      track("Purchase", { value: total, currency: "MAD" })
      const ref = id.slice(0, 8).toUpperCase()
      const summary = lines.map((l) => l.qty + "x " + l.p!.name + " " + (l.p!.size || "")).join(", ")
      const payLabel = pay === "cod" ? t("cash on delivery") : t("online (please send the payment link)")
      const msg = t("Hello, my order {{ref}}: {{summary}}. Name: {{name}}, city: {{city}}. Payment: {{pay}}", { ref, summary, name: f.name, city: f.city, pay: payLabel })
      setDoneRef(ref); clear()
      window.open(waLink(settings, msg), "_blank", "noopener,noreferrer")
    } catch {
      toast.error(t("Could not place the order. Some items may be out of stock, please check your cart."))
    } finally { setBusy(false) }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) setDoneRef(null) }}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader><SheetTitle>{t("Your cart")}</SheetTitle></SheetHeader>
        {doneRef ? (
          <div className="mt-10 space-y-3 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h3 className="text-2xl">{t("Order received")}</h3>
            <p className="text-muted-foreground">{t("Your order number is")} <b dir="ltr">{doneRef}</b>{t(". We will confirm it by phone and WhatsApp.")}</p>
            <Button onClick={() => setOpen(false)}>{t("Continue shopping")}</Button>
          </div>
        ) : lines.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">{t("Your cart is empty.")}</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-5">
            <ul className="divide-y divide-border border-y border-border">
              {lines.map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-3">
                  <img src={l.p!.image_url || ""} alt="" className="h-16 w-12 object-contain" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">{l.p!.slug === "serum-30" ? t("Argan face serum") : l.p!.slug === "serum-60" ? t("Argan hair serum") : l.p!.slug === "shampoo-250" ? t("Argan shampoo") : l.p!.slug === "bundle-complete" ? t("Complete care bundle") : l.p!.slug === "bundle-serums" ? t("Serum duo") : t(l.p!.name)}</p>
                    {l.p!.slug === "bundle-complete" ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("Face serum 30 ml")} + {t("Hair serum 60 ml")} + {t("Shampoo 250 ml")}</p> : l.p!.slug === "bundle-serums" ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("Face serum 30 ml")} + {t("Hair serum 60 ml")}</p> : null}
                    <p className="mt-1 text-muted-foreground">{l.p!.size ? `${l.p!.size} · ` : ""}{fmt(l.p!.price * (100 - pct) / 100)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" aria-label={t("Less")} onClick={() => setQty(l.id, l.qty - 1)}>{l.qty === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}</button>
                    <span className="w-6 text-center text-sm">{l.qty}</span>
                    <button type="button" aria-label={t("More")} onClick={() => setQty(l.id, l.qty + 1)}><Plus className="h-4 w-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-1 text-sm">
              {pct > 0 && <div className="flex justify-between text-muted-foreground"><span>{t("Subtotal")}</span><span className="line-through">{fmt(subtotal)}</span></div>}
              {pct > 0 && <div className="flex justify-between text-primary"><span>{t("Coupon MONTHLY")}{pct} {t("applied")}</span><span>-{pct}%</span></div>}
              <div className="flex justify-between font-display text-2xl"><span>{t("Total")}</span><span>{fmt(total)}</span></div>
            </div>
            <Input placeholder={t("Full name")} required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <Input placeholder={t("Phone")} required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            <Input placeholder={t("City")} required value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
            <Input placeholder={t("Delivery address")} required value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button type="button" onClick={() => setPay("cod")} className={"border-[1.5px] p-3 " + (pay === "cod" ? "border-primary bg-accent" : "border-border")}>{t("Cash on delivery")}</button>
              <button type="button" onClick={() => setPay("online")} className={"border-[1.5px] p-3 " + (pay === "online" ? "border-primary bg-accent" : "border-border")}>{t("Pay online")}</button>
            </div>
            {pay === "online" && <p className="text-xs text-muted-foreground">{t("We will send you a secure payment link on WhatsApp right after your order.")}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? t("Sending…") : t("Place order")}</Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
