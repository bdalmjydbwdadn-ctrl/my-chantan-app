import { useState } from "react"
import { ArrowUpLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/chantan-db"
import { useTranslation } from "react-i18next"

export default function Newsletter() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (busy) return
    setBusy(true); setError(false)
    try {
      const { error: requestError } = await supabase.from("newsletter_signups").insert({ id: crypto.randomUUID(), email: email.trim().toLowerCase() })
      if (requestError && requestError.code !== "23505") setError(true)
      else { setDone(true); setEmail("") }
    } catch { setError(true) } finally { setBusy(false) }
  }
  return <section className="px-5 py-12 md:py-20">
    <div className="mx-auto grid max-w-6xl items-center gap-6 rounded-[1.5rem] bg-[#173D2B] p-6 text-[#F7F3EA] md:grid-cols-12 md:p-10">
      <div className="md:col-span-7"><p className="text-xs font-semibold tracking-[0.16em] text-[#B69759]">{t("A NOTE FROM TAFOKT")}</p><h2 className="mt-3 text-3xl md:text-4xl">{t("Get 10% off your first order")}</h2><p className="mt-2 max-w-xl text-sm leading-6 opacity-80">{t("Join our email list for brand updates and a first-order welcome offer. The offer will be applied once the store activates its redemption process.")}</p></div>
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row md:col-span-5">
        {done ? <p role="status" className="rounded-xl bg-white/10 px-4 py-3 text-sm">{t("Thank you for subscribing. Your first-order offer details will be confirmed by the store.")}</p> : <>
          <label className="sr-only" htmlFor="newsletter-email">{t("Email address")}</label>
          <div className="relative flex-1"><Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" /><Input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("Email address")} className="h-12 rounded-full border-white/25 bg-white/10 ps-10 text-white placeholder:text-white/65" /></div>
          <Button type="submit" disabled={busy} className="h-12 rounded-full bg-[#F7F3EA] px-5 text-[#173D2B] hover:bg-white">{busy ? t("Sending…") : t("Subscribe")}<ArrowUpLeft className="h-4 w-4" /></Button>
        </>}
        {error && <p role="alert" className="text-xs text-amber-100 sm:absolute">{t("Could not subscribe. Please try again.")}</p>}
      </form>
    </div>
  </section>
}