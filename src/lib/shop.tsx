import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { supabase } from "@/lib/chantan-db"

export interface Product { id: string; slug: string; name: string; size: string | null; price: number; stock: number; image_url: string | null; description: string | null; active: boolean; sort: number }
export type Cur = "MAD"
export const CURRENCIES: Cur[] = ["MAD"]
interface Ctx {
  products: Product[]; settings: Record<string, string>; pct: number; endsAt: Date
  cart: { id: string; qty: number }[]; add: (id: string, qty?: number) => void; setQty: (id: string, qty: number) => void; clear: () => void; count: number
  currency: Cur; setCurrency: (c: Cur) => void; fmt: (n: number) => string; open: boolean; setOpen: (o: boolean) => void; reload: () => void; track: (e: string, d?: object) => void; loaded: boolean
}
const ShopCtx = createContext<Ctx | null>(null)
export const useShop = () => { const c = useContext(ShopCtx); if (!c) throw new Error("ShopProvider missing"); return c }

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const [cart, setCart] = useState<{ id: string; qty: number }[]>(() => { try { return JSON.parse(localStorage.getItem("tafokt-cart") || "[]") } catch { return [] } })
  const reload = useCallback(() => {
    void supabase.from("products").select("*").eq("active", true).order("sort").then(({ data }) => { if (data) setProducts(data as Product[]) })
    void supabase.from("site_settings").select("key,value").then(({ data }) => { if (data) setSettings(Object.fromEntries(data.map((r: any) => [r.key, r.value || ""]))); setLoaded(true) })
  }, [])
  useEffect(reload, [reload])
  useEffect(() => { localStorage.setItem("tafokt-cart", JSON.stringify(cart)) }, [cart])
  useEffect(() => {
    const id = settings.pixel_id
    if (localStorage.getItem("tafokt-analytics-consent") !== "accepted") return
    const w = window as any
    if (!id || w.fbq) return
    const n: any = (w.fbq = function (...args: any[]) { n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args) })
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = []
    const script = document.createElement("script"); script.async = true; script.src = "https://connect.facebook.net/en_US/fbevents.js"; document.head.appendChild(script)
    n("init", id); n("track", "PageView")
  }, [settings.pixel_id])
  useEffect(() => {
    if (localStorage.getItem("tafokt-analytics-consent") !== "accepted") return
    const w = window as any
    if (settings.ga_id && !w.__tafoktGA) {
      const script = document.createElement("script"); script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(settings.ga_id)}`; document.head.appendChild(script)
      w.dataLayer = w.dataLayer || []; w.gtag = function(){w.dataLayer.push(arguments)}; w.gtag("js", new Date()); w.gtag("config", settings.ga_id); w.__tafoktGA = true
    }
    if (settings.tiktok_pixel_id && !w.__tafoktTikTok) {
      const script = document.createElement("script"); script.text = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];var n=d.createElement("script");n.async=!0;n.src=i+"?sdkid="+e+"&lib="+t;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(n,s)};ttq.load('${settings.tiktok_pixel_id.replace(/[^a-zA-Z0-9_-]/g, "")}');ttq.page()}(window,document,'ttq');`; document.head.appendChild(script); w.__tafoktTikTok = true
    }
  }, [settings.ga_id, settings.tiktok_pixel_id])
  const track = useCallback((event: string, data?: object) => {
    if (localStorage.getItem("tafokt-analytics-consent") !== "accepted") return
    const w = window as any
    if (w.fbq) w.fbq("track", event, data)
    if (w.ttq) { const tikTokEvent = event === "Purchase" ? "CompletePayment" : event; w.ttq.track(tikTokEvent, data) }
    if (w.gtag) w.gtag("event", event, data)
  }, [])
  const add = (id: string, qty = 1) => {
    setCart((current) => current.some((row) => row.id === id) ? current.map((row) => row.id === id ? { ...row, qty: Math.min(99, row.qty + qty) } : row) : [...current, { id, qty }])
    track("AddToCart", { content_ids: [id] }); setOpen(true)
  }
  const setQty = (id: string, qty: number) => setCart((current) => qty <= 0 ? current.filter((row) => row.id !== id) : current.map((row) => row.id === id ? { ...row, qty: Math.min(qty, 99) } : row))
  const clear = () => setCart([])
  const fmt = (amount: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount) + " MAD"
  const pct = settings.offer_active === "true" ? Number(settings.discount_percent) || 0 : 0
  const endsAt = useMemo(() => { const d = settings.offer_ends_at ? new Date(settings.offer_ends_at) : null; if (d && !isNaN(d.getTime())) return d; const now = new Date(); return new Date(now.getFullYear(), now.getMonth() + 1, 1) }, [settings.offer_ends_at])
  const count = cart.reduce((total, row) => total + row.qty, 0)
  return <ShopCtx.Provider value={{ products, settings, pct, endsAt, cart, add, setQty, clear, count, currency: "MAD", setCurrency: () => undefined, fmt, open, setOpen, reload, track, loaded }}>{children}</ShopCtx.Provider>
}
