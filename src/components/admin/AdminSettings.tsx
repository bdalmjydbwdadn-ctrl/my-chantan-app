import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { supabase, chantanDB } from "@/lib/chantan-db"
import { useShop } from "@/lib/shop"
import { useTranslation } from "react-i18next"
import { SocialIcons } from "@/components/home/SocialButtons"

const CONTACT: [string, string, string][] = [
  ["whatsapp", "WhatsApp number (international format, no +)", "212673503800"], ["instagram", "Instagram URL", "https://www.instagram.com/..."],
  ["facebook", "Facebook URL", "https://www.facebook.com/..."], ["tiktok", "TikTok URL", "https://www.tiktok.com/@..."],
]

const MEDIA: [string, string, string][] = [
  ["hero_image", "Hero photo", "image/*"], ["hero_video", "Hero video (background)", "video/*"], ["argan_branch_image", "Argan branch photo", "image/*"],
  ["process_gather_image", "Gathering process photo", "image/*"], ["process_crack_image", "Cracking process photo", "image/*"], ["process_press_image", "Pressing process photo", "image/*"], ["process_bottle_image", "Bottling process photo", "image/*"],
  ["serum30_gallery_2", "Face serum gallery photo 2", "image/*"], ["serum30_gallery_3", "Face serum gallery photo 3", "image/*"], ["serum30_gallery_4", "Face serum gallery photo 4", "image/*"],
  ["serum60_gallery_2", "Hair serum gallery photo 2", "image/*"], ["serum60_gallery_3", "Hair serum gallery photo 3", "image/*"], ["serum60_gallery_4", "Hair serum gallery photo 4", "image/*"],
  ["shampoo_gallery_2", "Shampoo gallery photo 2", "image/*"], ["shampoo_gallery_3", "Shampoo gallery photo 3", "image/*"], ["shampoo_gallery_4", "Shampoo gallery photo 4", "image/*"],
  ["results_before", "Real results: before photo", "image/*"], ["results_after", "Real results: after photo", "image/*"], ["customer_photo_1", "Customer photo 1 (with permission)", "image/*"], ["customer_photo_2", "Customer photo 2 (with permission)", "image/*"], ["customer_photo_3", "Customer photo 3 (with permission)", "image/*"],
]
const FIELDS: [string, string][] = [
  ["pixel_id", "Meta Pixel ID"], ["tiktok_pixel_id", "TikTok Pixel ID"], ["ga_id", "Google Analytics measurement ID"],
  ["cooperative_name", "Cooperative name (only if confirmed)"], ["region", "Region (only if confirmed)"],
  ["certificate_1", "ONSSA certificate label (only after verified)"], ["certificate_2", "Organic certificate label (only after verified)"], ["certificate_3", "Laboratory test label (only after verified)"],
]
export default function AdminSettings() {
  const { t } = useTranslation()
  const { settings, reload } = useShop()
  const [v, setV] = useState<Record<string, string>>({})
  const [up, setUp] = useState("")
  useEffect(() => setV(settings), [settings])
  const save = async (entries: Record<string, string>) => {
    const rows = Object.entries(entries).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" })
    if (error) { toast.error(t("Could not save")); return false }
    toast.success(t("Saved")); reload(); return true
  }
  const upload = async (key: string, file?: File) => {
    if (!file) return
    setUp(key)
    try { const result = await chantanDB.storage.upload(file); await save({ [key]: result.url }) }
    catch { toast.error(t("Upload failed")) }
    finally { setUp("") }
  }
  const endLocal = v.offer_ends_at ? new Date(v.offer_ends_at).toISOString().slice(0, 16) : ""
  return <div className="space-y-8">
    <section className="space-y-3 border border-border p-5"><h3 className="text-2xl">{t("Monthly offer")}</h3><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v.offer_active === "true"} onChange={(event) => setV({ ...v, offer_active: String(event.target.checked) })}/>{t("Offer active (applies to all products and at checkout)")}</label><div className="grid gap-3 md:grid-cols-2"><Input type="number" min={0} max={90} placeholder={t("Discount %")} value={v.discount_percent || ""} onChange={(event) => setV({ ...v, discount_percent: event.target.value })}/><Input type="datetime-local" value={endLocal} onChange={(event) => setV({ ...v, offer_ends_at: event.target.value ? new Date(event.target.value).toISOString() : "" })}/></div><p className="text-xs text-muted-foreground">{t("Leave the end date empty to end the offer on the last day of each month automatically.")}</p><Button onClick={() => save({ offer_active: v.offer_active || "false", discount_percent: v.discount_percent || "0", offer_ends_at: v.offer_ends_at || "" })}>{t("Save offer")}</Button></section>
    <section className="space-y-3 border border-border p-5"><h3 className="text-2xl">{t("Media manager")}</h3><p className="text-sm text-muted-foreground">{t("Upload only original brand photography you have permission to use. Product packaging remains unchanged.")}</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{MEDIA.map(([key, label, accept]) => <div key={key} className="space-y-2 border border-border p-3 text-sm"><b>{t(label)}</b>{v[key] && (accept.startsWith("video") ? <video src={v[key]} className="h-28 w-full rounded-lg object-cover" muted playsInline/> : <img src={v[key]} alt="" loading="lazy" className="h-28 w-full rounded-lg object-cover"/>)}<Input type="file" accept={accept} disabled={up === key} onChange={(event) => upload(key, event.target.files?.[0])}/>{up === key && <p>{t("Uploading…")}</p>}{v[key] && <Button size="sm" variant="outline" onClick={() => save({ [key]: "" })}>{t("Remove")}</Button>}</div>)}</div></section>
    <section className="space-y-3 border border-border p-5"><h3 className="text-2xl">{t("Contact and social links")}</h3><p className="text-sm text-muted-foreground">{t("Every link on the site reads from these fields. An empty link hides its icon.")}</p><div className="grid gap-3 md:grid-cols-2">{CONTACT.map(([key, label, ph]) => <label key={key} className="space-y-1 text-sm">{t(label)}<Input dir="ltr" placeholder={t(ph)} value={v[key] || ""} onChange={(event) => setV({ ...v, [key]: event.target.value })}/></label>)}</div><div className="pt-1"><SocialIcons values={v}/></div><Button onClick={() => save(Object.fromEntries(CONTACT.map(([key]) => [key, (v[key] || "").trim()])))}>{t("Save contact links")}</Button></section>
    <section className="space-y-3 border border-border p-5"><h3 className="text-2xl">{t("Tracking, cooperative & certificates")}</h3><p className="text-sm text-muted-foreground">{t("Add tracking identifiers only with the relevant consent and privacy setup. Certificate labels appear only after you provide verified information.")}</p><div className="grid gap-3 md:grid-cols-2">{FIELDS.map(([key, label]) => <label key={key} className="space-y-1 text-sm">{t(label)}<Input placeholder={key === "whatsapp" ? "06 73 50 38 00" : undefined} value={v[key] || ""} onChange={(event) => setV({ ...v, [key]: event.target.value })}/></label>)}</div><Button onClick={() => save(Object.fromEntries(FIELDS.map(([key]) => [key, v[key] || ""])))}>{t("Save settings")}</Button></section>
  </div>
}
