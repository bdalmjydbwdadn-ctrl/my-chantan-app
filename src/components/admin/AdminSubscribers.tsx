import { useCallback, useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { supabase } from "@/lib/chantan-db"
import { useTranslation } from "react-i18next"

type Subscriber = { id: string; email: string; created_at: string }
export default function AdminSubscribers() {
  const { t } = useTranslation()
  const [rows, setRows] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const load = useCallback(async () => {
    const { data, error } = await supabase.from("newsletter_signups").select("id,email,created_at").order("created_at", { ascending: false })
    if (error) toast.error(t("Could not load subscribers"))
    else setRows((data || []) as Subscriber[])
    setLoading(false)
  }, [t])
  useEffect(() => { void load() }, [load])
  const remove = async (id: string) => {
    const { error } = await supabase.from("newsletter_signups").delete().eq("id", id)
    if (error) toast.error(t("Could not remove the subscriber"))
    else setRows((current) => current.filter((row) => row.id !== id))
  }
  if (loading) return <p className="p-5 text-sm text-muted-foreground">{t("Loading…")}</p>
  return <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
    {rows.length === 0 ? <p className="p-5 text-sm text-muted-foreground">{t("No subscribers yet.")}</p> : rows.map((row) => <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><div><a href={`mailto:${row.email}`} className="font-semibold text-primary underline">{row.email}</a><p className="mt-1 text-xs text-muted-foreground">{new Date(row.created_at).toLocaleDateString()}</p></div><Button variant="outline" size="sm" aria-label={t("Remove subscriber")} onClick={() => remove(row.id)}><Trash2 className="h-4 w-4"/></Button></div>)}
  </div>
}