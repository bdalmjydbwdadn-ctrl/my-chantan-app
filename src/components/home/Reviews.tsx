import { useEffect, useState } from "react"
import { BadgeCheck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { supabase } from "@/lib/chantan-db"
import { useShop } from "@/lib/shop"
import { useTranslation } from 'react-i18next'

interface Review { id: string; author_name: string; rating: number; comment: string; verified: boolean; created_at: string }

export default function Reviews() {
  const { t } = useTranslation()
  const { products } = useShop()
  const [list, setList] = useState<Review[]>([])
  const [rating, setRating] = useState(5)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [comment, setComment] = useState("")
  const [slug, setSlug] = useState("")
  const [busy, setBusy] = useState(false)

  const load = () => { void supabase.from("reviews").select("id,author_name,rating,comment,verified,created_at").order("created_at", { ascending: false }).limit(30).then(({ data }) => setList((data as Review[]) || [])) }
  useEffect(load, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !comment.trim()) return
    setBusy(true)
    try {
      const { error } = await supabase.from("reviews").insert({ author_name: name.trim(), rating, comment: comment.trim(), buyer_phone: phone.trim() || null, product_slug: slug || null })
      if (error) throw error
      toast.success(t("Thank you! Your review is live."))
      setName(""); setComment(""); setPhone(""); load()
    } catch {
      toast.error(t("Could not send your review. Please try again."))
    } finally { setBusy(false) }
  }

  const avg = list.length ? (list.reduce((a, b) => a + b.rating, 0) / list.length).toFixed(1) : null
  return (
    <section id="reviews" className="py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7">
          <p className="text-sm font-semibold tracking-widest text-primary">{t("REAL CUSTOMERS")}</p>
          <h2 className="mt-3 text-5xl md:text-6xl">{t("What people say.")}</h2>
          {avg && <p className="mt-3 flex items-center gap-2 text-muted-foreground"><Star className="h-4 w-4 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />{avg} / 5 · {list.length} {t("reviews")}</p>}
          <div className="mt-8 divide-y divide-border border-y border-border">
            {list.length === 0 && <p className="py-8 text-muted-foreground">{t("No reviews yet. Be the first to share your experience.")}</p>}
            {list.map((r) => (
              <article key={r.id} className="py-6">
                <div className="flex items-center gap-1">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={"h-4 w-4 " + (i < r.rating ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" : "text-border")} />)}</div>
                <p className="mt-2 font-display text-xl">{r.comment}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">{r.author_name}
                  {r.verified && <span className="flex items-center gap-1 text-primary"><BadgeCheck className="h-4 w-4" />{t("Verified buyer")}</span>}
                </p>
              </article>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4 border-[1.5px] border-border p-6 transition-colors hover:border-primary md:col-span-5 md:self-start">
          <h3 className="text-2xl">{t("Share your experience")}</h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} aria-label={n + " stars"} onClick={() => setRating(n)}>
                <Star className={"h-7 w-7 transition-colors " + (n <= rating ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" : "text-border")} />
              </button>
            ))}
          </div>
          <Input placeholder={t("Your name")} value={name} onChange={(e) => setName(e.target.value)} required />
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className="h-10 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm">
            <option value="">{t("Which product?")}</option>
            {products.map((p) => <option key={p.id} value={p.slug}>{t(p.name)} {p.size}</option>)}
          </select>
          <Textarea placeholder={t("Your review")} value={comment} onChange={(e) => setComment(e.target.value)} required />
          <Input placeholder={t("Phone used for your order (to get the Verified badge)")} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Button type="submit" disabled={busy} className="w-full">{busy ? t("Sending…") : t("Publish my review")}</Button>
          <p className="text-xs text-muted-foreground">{t("The Verified badge appears only when your phone matches a delivered order.")}</p>
        </form>
      </div>
    </section>
  )
}
