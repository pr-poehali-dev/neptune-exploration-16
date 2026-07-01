import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

const API = "https://functions.poehali.dev/74b9b481-4e81-4d59-b8ae-c16b7a05c186"
const MUSIC_API = "https://functions.poehali.dev/12890d34-59c9-4824-8ac1-c948aef3a9a3"

type Track = {
  id: number
  title: string
  album: string
  year: string
  cover_url: string | null
  audio_url: string | null
  sort_order: number
}

type S3Track = { key: string; title: string; url: string }

const EMPTY: Omit<Track, "id"> = {
  title: "",
  album: "Сингл",
  year: new Date().getFullYear().toString(),
  cover_url: "",
  audio_url: "",
  sort_order: 0,
}

function authHeaders(token: string) {
  return { "Content-Type": "application/json", "X-Admin-Token": token }
}

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "")
  const [authed, setAuthed] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [editing, setEditing] = useState<Track | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<Track, "id">>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")

  const qc = useQueryClient()

  const { data, isLoading } = useQuery<{ tracks: Track[] }>({
    queryKey: ["admin-tracks"],
    queryFn: async () => {
      const res = await fetch(API)
      return res.json()
    },
    enabled: authed,
  })

  const { data: s3Data } = useQuery<{ tracks: S3Track[] }>({
    queryKey: ["music-s3"],
    queryFn: async () => {
      const res = await fetch(MUSIC_API)
      return res.json()
    },
    enabled: authed,
  })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const handleLogin = async () => {
    setLoginError("")
    const res = await fetch(API, { headers: { "X-Admin-Token": token } })
    if (res.ok) {
      localStorage.setItem("admin_token", token)
      setAuthed(true)
    } else {
      setLoginError("Неверный пароль")
    }
  }

  const handleSave = async () => {
    setSaving(true)
    const isEdit = !!editing
    const url = isEdit ? `${API}?id=${editing!.id}` : API
    const method = isEdit ? "PUT" : "POST"
    const body = isEdit ? { ...form, id: editing!.id } : form
    await fetch(url, { method, headers: authHeaders(token), body: JSON.stringify(body) })
    await qc.invalidateQueries({ queryKey: ["admin-tracks"] })
    await qc.invalidateQueries({ queryKey: ["tracks-db"] })
    setSaving(false)
    setEditing(null)
    setCreating(false)
    showToast(isEdit ? "Трек обновлён" : "Трек добавлен")
  }

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API}?id=${id}`, { method: "DELETE", headers: authHeaders(token) })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tracks"] })
      qc.invalidateQueries({ queryKey: ["tracks-db"] })
      showToast("Трек удалён")
    },
  })

  const openEdit = (t: Track) => {
    setEditing(t)
    setCreating(false)
    setForm({ title: t.title, album: t.album, year: t.year, cover_url: t.cover_url || "", audio_url: t.audio_url || "", sort_order: t.sort_order })
  }

  const openCreate = () => {
    setCreating(true)
    setEditing(null)
    setForm({ ...EMPTY, sort_order: (data?.tracks.length || 0) + 1 })
  }

  // --- Login screen ---
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-sm bg-secondary rounded-2xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Панель управления</p>
          <h1 className="font-serif text-3xl text-foreground mb-8">Вход</h1>

          <label className="block text-sm text-muted-foreground mb-2">Пароль</label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-3"
            placeholder="••••••••"
            autoFocus
          />
          {loginError && <p className="text-red-400 text-sm mb-3">{loginError}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-medium hover:bg-primary/90 transition-colors"
          >
            Войти
          </button>
        </motion.div>
      </div>
    )
  }

  const tracks = data?.tracks || []
  const s3Tracks = s3Data?.tracks || []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Панель управления</p>
          <h1 className="font-serif text-2xl text-foreground">Треки</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href="/tracks" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <Icon name="ExternalLink" size={14} />
            На сайт
          </a>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Icon name="Plus" size={16} />
            Добавить трек
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* S3 files hint */}
        {s3Tracks.length > 0 && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-foreground">
            <p className="font-medium mb-1 flex items-center gap-2"><Icon name="Music" size={14} /> Файлы в хранилище ({s3Tracks.length} шт.)</p>
            <p className="text-muted-foreground">Нажми «Добавить трек» и вставь ссылку из списка ниже в поле «Аудио»:</p>
            <div className="mt-2 space-y-1">
              {s3Tracks.map((s) => (
                <div key={s.key} className="flex items-center gap-2 text-xs">
                  <Icon name="FileAudio" size={12} className="text-primary flex-shrink-0" />
                  <span className="text-muted-foreground truncate flex-1">{s.title}</span>
                  <button
                    onClick={() => setForm((f) => ({ ...f, audio_url: s.url, title: f.title || s.title }))}
                    className="text-primary hover:underline flex-shrink-0"
                  >
                    Вставить
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Track list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-secondary rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {tracks.map((track) => (
              <motion.div
                key={track.id}
                className="flex items-center gap-4 p-4 bg-secondary rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {track.cover_url ? (
                  <img src={track.cover_url} alt={track.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-border flex items-center justify-center flex-shrink-0">
                    <Icon name="Music" size={20} className="text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-serif text-foreground truncate">{track.title}</p>
                  <p className="text-muted-foreground text-sm">{track.album} · {track.year}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {track.audio_url ? (
                      <span className="text-xs text-primary flex items-center gap-1"><Icon name="Volume2" size={11} /> Аудио есть</span>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="VolumeX" size={11} /> Нет аудио</span>
                    )}
                    <span className="text-xs text-muted-foreground">Порядок: {track.sort_order}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(track)}
                    className="w-9 h-9 rounded-lg bg-background hover:bg-border flex items-center justify-center transition-colors"
                  >
                    <Icon name="Pencil" size={15} />
                  </button>
                  <button
                    onClick={() => { if (confirm(`Удалить «${track.title}»?`)) deleteMutation.mutate(track.id) }}
                    className="w-9 h-9 rounded-lg bg-background hover:bg-red-500/20 flex items-center justify-center transition-colors"
                  >
                    <Icon name="Trash2" size={15} className="text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create drawer */}
      <AnimatePresence>
        {(editing || creating) && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex-1 bg-black/60" onClick={() => { setEditing(null); setCreating(false) }} />
            <motion.div
              className="w-full max-w-md bg-background h-full overflow-y-auto shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
                <h2 className="font-serif text-xl">{editing ? "Редактировать трек" : "Новый трек"}</h2>
                <button onClick={() => { setEditing(null); setCreating(false) }}>
                  <Icon name="X" size={20} className="text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 px-6 py-6 space-y-5">
                {(["title", "album", "year"] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-sm text-muted-foreground mb-1.5">
                      {{ title: "Название", album: "Альбом", year: "Год" }[field]}
                    </label>
                    <input
                      value={form[field]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      className="w-full bg-secondary border-0 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Обложка (URL картинки)</label>
                  <input
                    value={form.cover_url || ""}
                    onChange={(e) => setForm((f) => ({ ...f, cover_url: e.target.value }))}
                    className="w-full bg-secondary border-0 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://..."
                  />
                  {form.cover_url && (
                    <img src={form.cover_url} alt="" className="mt-2 w-20 h-20 rounded-lg object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  )}
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Аудио (URL .mp3)</label>
                  <input
                    value={form.audio_url || ""}
                    onChange={(e) => setForm((f) => ({ ...f, audio_url: e.target.value }))}
                    className="w-full bg-secondary border-0 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://cdn.poehali.dev/..."
                  />
                  {s3Tracks.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {s3Tracks.map((s) => (
                        <button
                          key={s.key}
                          onClick={() => setForm((f) => ({ ...f, audio_url: s.url }))}
                          className="w-full text-left text-xs px-3 py-2 rounded-lg bg-secondary hover:bg-border transition-colors flex items-center gap-2"
                        >
                          <Icon name="FileAudio" size={12} className="text-primary flex-shrink-0" />
                          <span className="truncate text-muted-foreground">{s.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Порядок отображения</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                    className="w-full bg-secondary border-0 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title}
                  className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Сохраняю..." : "Сохранить"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium shadow-xl z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
