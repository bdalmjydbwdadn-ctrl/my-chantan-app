import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { ArrowUpLeft } from "lucide-react"
import Navbar from "@/components/Navbar"
import CartDrawer from "@/components/CartDrawer"
import SiteFooter from "@/components/SiteFooter"
import { WhatsAppFloat } from "@/components/home/SocialButtons"
import { contactInfo } from "@/lib/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/chantan-db"
import { useShop } from "@/lib/shop"
import { useTranslation } from "react-i18next"

const pages: Record<string, { title: string; intro: string; sections: [string, string][] }> = {
  about: { title: "About us", intro: "TAFOKT N ODRAR is a Moroccan skincare and haircare brand inspired by the argan tree and the landscapes of Morocco.", sections: [["Our approach", "We keep the collection focused and present product information clearly. Confirmed ingredients, usage details and brand updates will be added as they are approved."]] },
  shipping: { title: "Shipping policy", intro: "Orders are prepared for delivery within Morocco. The team confirms order and delivery details with you.", sections: [["Delivery", "The store's current delivery information is 24 to 48 hours from dispatch. Delivery availability and any applicable fees are confirmed with you when your order is confirmed."], ["Payment", "Cash on delivery is available. If you choose online payment, the team will contact you with the payment arrangement currently available."]] },
  returns: { title: "Returns & Refunds", intro: "If you do not love your order, you may request a return without giving a reason. Send the form and the store team will contact you about the next steps.", sections: [["Money-back guarantee", "The store offers a 100% money-back guarantee. Contact the team through the form below so they can arrange your request."]] },

  terms: { title: "Terms", intro: "These terms describe the current ordering experience on the TAFOKT N ODRAR store.", sections: [["Orders and prices", "Prices are shown in Moroccan dirhams (MAD). An order request is subject to confirmation by the store team, including item availability and delivery details."], ["Payment", "Cash on delivery is available. An online-payment request is not a completed card transaction on this site; the team will follow up to arrange payment."], ["Product information", "The product page is the source for the information currently confirmed by the brand. Contact the store before ordering if you need details that are not yet listed."]] },
  privacy: { title: "Privacy", intro: "We use the information you submit to process orders, respond to requests and send the email updates you ask to receive.", sections: [["Information collected", "Order forms request your name, phone number, city and delivery address. Return requests collect contact details and the information you choose to provide. Newsletter sign-up stores your email address."], ["Use and sharing", "Information is used to manage your order or request and communicate with you about it. Optional analytics pixels activate only when an administrator adds an ID and a visitor chooses to allow analytics. Do not submit information you do not want used for these purposes."], ["Questions", "For privacy questions or a request about your information, contact the store using the phone number listed on this site."]] },
}

function ReturnForm() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: "", phone: "", ref: "", reason: "" })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy) return
    setBusy(true); setError(false)
    try {
      const { error: insertError } = await supabase.from("return_requests").insert({ id: crypto.randomUUID(), order_ref: form.ref || null, customer_name: form.name.trim(), phone: form.phone.trim(), reason: form.reason.trim() || null })
      if (insertError) setError(true); else setDone(true)
    } catch { setError(true) } finally { setBusy(false) }
  }
  return <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
    {done ? <p role="status" className="font-semibold text-primary">{t("Your request was received. The store team will contact you.")}</p> : <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2"><Input required placeholder={t("Full name")} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })}/><Input required placeholder={t("Phone")} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })}/></div>
      <Input placeholder={t("Order number (optional)")} value={form.ref} onChange={(event) => setForm({ ...form, ref: event.target.value })}/>
      <Textarea placeholder={t("Tell us a little about your request (optional)")} value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })}/>
      {error && <p role="alert" className="text-sm text-destructive">{t("We could not send your request. Please try again.")}</p>}
      <Button type="submit" disabled={busy}>{busy ? t("Sending…") : t("Send return request")}</Button>
    </form>}
  </div>
}

export default function StoreInfo() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { settings } = useShop()
  const slug = pathname.split("/").filter(Boolean)[0] || "about"
  const page = pages[slug] || pages.about
  useEffect(() => {
    document.title = t("{{title}} | TAFOKT N ODRAR", { title: t(page.title) })
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute("content", t(page.intro))
  }, [page, t])
  const phone = contactInfo(settings)
  return <div className="min-h-screen bg-background text-foreground"><Navbar/><main className="mx-auto max-w-6xl px-5 pb-14 pt-32 md:pb-20 md:pt-36">
    <Link to="/" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowUpLeft className="h-4 w-4"/>{t("Back to the store")}</Link>
    <header className="mt-6 max-w-3xl"><p className="text-xs font-semibold tracking-[0.18em] text-[#B69759]">{t("TAFOKT N ODRAR")}</p><h1 className="mt-3 text-4xl text-[#173D2B] md:text-6xl">{t(page.title)}</h1><p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">{t(page.intro)}</p></header>
    <div className="mt-9 grid gap-5 md:grid-cols-2">{page.sections.map(([heading, body]) => <section key={heading} className="rounded-2xl border border-border bg-card p-5 md:p-7"><h2 className="text-xl">{t(heading)}</h2><p className="mt-3 leading-7 text-muted-foreground">{t(body)}</p></section>)}</div>
    {slug === "returns" && <section className="mt-8 max-w-3xl"><h2 className="mb-4 text-2xl">{t("Request a return")}</h2><p className="mb-5 leading-7 text-muted-foreground">{t("If you do not love your order, you can request a return without giving a reason. Send the form and the team will contact you about the next steps.")}</p><ReturnForm/></section>}
    {slug === "returns" && <p className="mt-5 text-sm text-muted-foreground">{t("You can also contact us at")} <a href={phone.tel} dir="ltr" className="font-semibold text-primary underline">{phone.display}</a>.</p>}
  </main><SiteFooter/><CartDrawer/><WhatsAppFloat/></div>
}