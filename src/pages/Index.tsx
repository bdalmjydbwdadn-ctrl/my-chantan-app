import { useEffect } from "react"
import Navbar from "@/components/Navbar"
import CartDrawer from "@/components/CartDrawer"
import Hero from "@/components/home/Hero"
import TrustBar from "@/components/home/TrustBar"
import Products from "@/components/home/Products"
import Support from "@/components/home/Support"
import Newsletter from "@/components/home/Newsletter"
import Cooperative from "@/components/home/Cooperative"
import RealResults from "@/components/home/RealResults"
import { WhatsAppFloat } from "@/components/home/SocialButtons"
import { Faq } from "@/components/home/Lifestyle"
import { Intro, Founder, Process, Ingredients } from "@/components/home/Story"
import { MoroccanRoots } from "@/components/home/ArganHeritage"
import { useTranslation } from "react-i18next"

const Index = () => {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = t("TAFOKT N ODRAR | Moroccan Argan Care")
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", t("Explore TAFOKT N ODRAR argan face and hair care, bundles, and cash-on-delivery ordering in Morocco."))
  }, [t])
  return <div className="min-h-screen overflow-x-clip bg-background text-foreground">
    <Navbar />
    <main>
      <Hero />
      <TrustBar />
      <Products />
      <Intro />
      <MoroccanRoots />
      <Founder />
      <Cooperative />
      <Process />
      <RealResults />
      <Ingredients />
      <Newsletter />
      <Faq />
    </main>
    <Support />
    <CartDrawer />
    <WhatsAppFloat />
  </div>
}
export default Index
