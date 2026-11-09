import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { supabase, chantanDB } from "@/lib/chantan-db"
import { useShop } from "@/lib/shop"
import { useTranslation } from 'react-i18next'

const empty = { id: "", slug: "", name: "", size: "", price: 0, stock: 0, image_url: "", description: "", active: true, sort: 0 }

export default function AdminCatalog() {
  const { t } = useTranslation()
  const { reload } = useShop()
  const [rows, setRows] = useState<any[]>([])
  const [f, setF] = useState<any>(empty)
  const [busy, setBusy] = useState(false)
  const load = useCallback(() => { void supabase.from("products").select("*").order("sort").then(({ data }) => setRows(data || [])) }, [])
  useEffect(load, [load])

  const upload = async (file?: File) => {
    if (!file) return
    try { const r = await chantanDB.storage.upload(file); setF((x: any) => ({ ...x, image_url: r.url })); toast.success(t("Image uploaded")) }
    catch { toast.error(t("Upload failed")) }
  }
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true)
    const row = { slug: f.slug || f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: f.name, size: f.size, price: Number(f.price), stock: Number(f.stock), image_url: f.image_url, description: f.description, active: f.active, sort: Number(f.sort) }
    const { error } = f.id ? await supabase.from("products").update(row).eq("id", f.id) : await supabase.from("products").insert(row)
    setBusy(false)
    if (error) return toast.error(t("Could not save the product"))
    toast.success(t("Product saved")); setF(empty); load(); reload()
  }
  const remove = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) toast.error(t("Could not delete")); else { load(); reload() }
  }
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <div className="divide-y divide-border border border-border md:col-span-7">
        {rows.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-3 text-sm">
            <img src={p.image_url || ""} alt="" className="h-14 w-12 object-contain" />
            <div className="flex-1"><b>{p.name}</b> {p.size}<div className="text-muted-foreground">{p.price} {t("MAD · stock")} {p.stock} {p.active ? "" : t("· hidden")}</div></div>
            <Button size="sm" variant="outline" onClick={() => setF({ ...empty, ...p, description: p.description || "", image_url: p.image_url || "", size: p.size || "" })}>{t("Edit")}</Button>
            <Button size="sm" variant="outline" onClick={() => remove(p.id)}>{t("Delete")}</Button>
          </div>
        ))}
      </div>
      <form onSubmit={save} className="space-y-3 border border-border p-4 md:col-span-5">
        <h3 className="text-xl">{f.id ? t("Edit product") : t("New product")}</h3>
        <Input placeholder={t("Name")} required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder={t("Size (30 ml)")} value={f.size} onChange={(e) => setF({ ...f, size: e.target.value })} />
          <Input placeholder={t("Sort order")} type="number" value={f.sort} onChange={(e) => setF({ ...f, sort: e.target.value })} />
          <Input placeholder={t("Price (MAD)")} type="number" required min={1} value={f.price || ""} onChange={(e) => setF({ ...f, price: e.target.value })} />
          <Input placeholder={t("Stock")} type="number" min={0} value={f.stock} onChange={(e) => setF({ ...f, stock: e.target.value })} />
        </div>
        <Textarea placeholder={t("Description")} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <Input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
        {f.image_url && <img src={f.image_url} alt="" className="h-24 object-contain" />}
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} />{t("Visible in the store")}</label>
        <div className="flex gap-2">
          <Button type="submit" disabled={busy}>{t("Save")}</Button>
          {f.id && <Button type="button" variant="outline" onClick={() => setF(empty)}>{t("Cancel")}</Button>}
        </div>
      </form>
    </div>
  )
}
