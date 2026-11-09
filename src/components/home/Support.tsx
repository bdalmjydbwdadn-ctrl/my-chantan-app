import { Phone } from "lucide-react"
import { SocialButtons } from "@/components/home/SocialButtons"
import SiteFooter from "@/components/SiteFooter"
import { useShop } from "@/lib/shop"
import { contactInfo } from "@/lib/contact"
import { useTranslation } from "react-i18next"

export default function Support() {
  const { t } = useTranslation()
  const { settings } = useShop()
  const phone = contactInfo(settings)
  return <>
    <section id="support" className="bg-muted px-5 py-12 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7"><p className="text-xs font-semibold tracking-[0.18em] text-primary">{t("CONTACT")}</p><h2 className="mt-3 text-3xl md:text-4xl">{t("We are one message away.")}</h2><p className="mt-3 max-w-xl leading-7 text-muted-foreground">{t("Have a question about an order or a product? Reach out and our team will help.")}</p></div>
        <div className="flex flex-col gap-4 md:col-span-5 md:items-end">
          <a href={phone.tel} className="inline-flex min-h-11 items-center gap-3 text-primary transition-colors hover:underline" dir="ltr"><Phone className="h-5 w-5"/>{phone.display}</a>
          <SocialButtons labels={false} includeWhatsApp={false} />
        </div>
      </div>
    </section>
    <SiteFooter />
  </>
}
