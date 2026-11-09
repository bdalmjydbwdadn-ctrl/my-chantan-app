import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { supabase } from "@/lib/chantan-db"
import { useShop } from "@/lib/shop"
import AdminCatalog from "@/components/admin/AdminCatalog"
import AdminSettings from "@/components/admin/AdminSettings"
import AdminSubscribers from "@/components/admin/AdminSubscribers"
import { useTranslation } from 'react-i18next'

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"]

function Orders() {
  const { t } = useTranslation()
  const { fmt } = useShop()
  const [rows, setRows] = useState<any[]>([])
  const load = useCallback(() => { void supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200).then(({ data }) => setRows(data || [])) }, [])
  useEffect(() => { load(); const i = setInterval(load, 15000); return () => clearInterval(i) }, [load])
  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id)
    if (error) toast.error(t("Could not update the status")); else load()
  }
  const live = rows.filter((r) => r.status !== "cancelled")
  const revenue = live.reduce((a, r) => a + Number(r.total), 0)
  const stats: [string, string][] = [
    ["Orders", String(rows.length)],
    ["Pending", String(rows.filter((r) => r.status === "pending").length)],
    ["Revenue", fmt(revenue)],
    ["COD share", rows.length ? Math.round(rows.filter((r) => r.payment_method === "cod").length / rows.length * 100) + "%" : "0%"],
  ]
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:grid-cols-4">
        {stats.map(([l, v]) => <div key={l} className="border-border p-4 md:border-e"><div className="text-xs text-muted-foreground">{t(l)}</div><div className="font-display text-2xl">{t(v)}</div></div>)}
      </div>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border shadow-sm">
        {rows.length === 0 && <p className="p-6 text-muted-foreground">{t("No orders yet.")}</p>}
        {rows.map((r) => (
          <div key={r.id} className="grid gap-3 p-4 text-sm md:grid-cols-12">
            <div className="md:col-span-3"><b>{r.customer_name}</b><div dir="ltr">{r.phone}</div><div className="text-muted-foreground">{r.city} · {r.address}</div></div>
            <div className="md:col-span-4">{(r.items || []).map((i: any) => <div key={i.id}>{i.qty}x {i.name}</div>)}<div className="text-xs text-muted-foreground">#{String(r.id).slice(0, 8).toUpperCase()} · {new Date(r.created_at).toLocaleString()}</div></div>
            <div className="md:col-span-2"><b>{fmt(Number(r.total))}</b><div className="text-xs">{r.payment_method === "cod" ? t("Cash on delivery") : t("Online")}{r.coupon ? " · " + r.coupon : ""}</div></div>
            <div className="flex gap-2 md:col-span-3">
              <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="h-9 flex-1 border border-input bg-background px-2">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <Button size="sm" variant="outline" asChild><a href={"https://wa.me/" + String(r.phone).replace(/\D/g, "").replace(/^0/, "212")} target="_blank" rel="noreferrer">{t("WhatsApp")}</a></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewsAdmin() {
  const { t } = useTranslation()
  const [rows, setRows] = useState<any[]>([])
  const load = useCallback(() => { void supabase.from("reviews").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data || [])) }, [])
  useEffect(load, [load])
  const del = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id)
    if (error) toast.error(t("Could not delete the review")); else load()
  }
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border shadow-sm">
      {rows.length === 0 && <p className="p-6 text-muted-foreground">{t("No reviews yet.")}</p>}
      {rows.map((r) => (
        <div key={r.id} className="flex items-start justify-between gap-3 p-4 text-sm">
          <div><b>{r.author_name}</b> · {"★".repeat(r.rating)}{r.verified ? " · " + t("Verified buyer") : ""}<div className="mt-1 text-muted-foreground">{r.comment}</div></div>
          <Button size="sm" variant="outline" onClick={() => del(r.id)}>{t("Delete")}</Button>
        </div>
      ))}
    </div>
  )
}

function Returns() {
  const { t } = useTranslation()
  const [rows, setRows] = useState<any[]>([])
  const load = useCallback(() => { void supabase.from("return_requests").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data || [])) }, [])
  useEffect(load, [load])
  const setStatus = async (id: string, status: string) => { await supabase.from("return_requests").update({ status }).eq("id", id); load() }
  return (
    <div className="divide-y divide-border border border-border">
      {rows.length === 0 && <p className="p-6 text-muted-foreground">{t("No return requests.")}</p>}
      {rows.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
          <div><b>{r.customer_name}</b> · <span dir="ltr">{r.phone}</span><div className="text-muted-foreground">{t("Order")} {r.order_ref || "-"} · {r.reason}</div></div>
          <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="h-9 border border-input bg-background px-2">
            {["new", "in progress", "refunded", "closed"].map((s) => <option key={s}>{t(s)}</option>)}
          </select>
        </div>
      ))}
    </div>
  )
}

export default function Admin() {
  const { t } = useTranslation()
  const [state, setState] = useState<"loading" | "out" | "denied" | "ok">("loading")
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [busy, setBusy] = useState(false)

  const apply = (u: any) => setState(!u ? "out" : ["admin", "owner"].includes(u.app_metadata?.role) ? "ok" : "denied")
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => apply(data.session?.user))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => apply(s?.user))
    return () => data.subscription.unsubscribe()
  }, [])

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
      if (error) toast.error(t("Wrong email or password"))
    } finally { setBusy(false) }
  }

  if (state === "loading") return <div className="p-10 text-center">{t("Loading…")}</div>
  if (state !== "ok") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-5">
        <form onSubmit={login} className="w-full max-w-sm space-y-4 border-[1.5px] border-border bg-background p-8">
          <h1 className="text-3xl">{t("Admin sign in")}</h1>
          {state === "denied" && <p className="text-sm text-destructive">{t("This account is not an administrator.")}</p>}
          <Input type="email" placeholder={t("Email")} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder={t("Password")} value={pw} onChange={(e) => setPw(e.target.value)} required />
          <Button type="submit" className="w-full" disabled={busy}>{busy ? t("Signing in…") : t("Sign in")}</Button>
          {state === "denied" && <Button type="button" variant="outline" className="w-full" onClick={() => supabase.auth.signOut()}>{t("Sign out")}</Button>}
          <Link to="/" className="block text-center text-sm text-muted-foreground">{t("Back to the store")}</Link>
        </form>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <h1 className="text-2xl text-primary">{t("TAFOKT N ODRAR · Admin")}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild><Link to="/">{t("View store")}</Link></Button>
          <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>{t("Sign out")}</Button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl p-5">
        <Tabs defaultValue="orders">
          <TabsList className="flex-wrap">
            <TabsTrigger value="orders">{t("Orders")}</TabsTrigger>
            <TabsTrigger value="products">{t("Products")}</TabsTrigger>
            <TabsTrigger value="offers">{t("Offers & media")}</TabsTrigger>
            <TabsTrigger value="returns">{t("Returns")}</TabsTrigger>
            <TabsTrigger value="reviews">{t("Reviews")}</TabsTrigger>
            <TabsTrigger value="subscribers">{t("Email subscribers")}</TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="mt-6"><Orders /></TabsContent>
          <TabsContent value="products" className="mt-6"><AdminCatalog /></TabsContent>
          <TabsContent value="offers" className="mt-6"><AdminSettings /></TabsContent>
          <TabsContent value="returns" className="mt-6"><Returns /></TabsContent>
          <TabsContent value="reviews" className="mt-6"><ReviewsAdmin /></TabsContent>
          <TabsContent value="subscribers" className="mt-6"><AdminSubscribers /></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
