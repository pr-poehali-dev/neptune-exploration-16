import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { LenisProvider } from "@/components/lenis-provider"
import { CustomCursor } from "@/components/custom-cursor"
import { FooterSection } from "@/components/sections/footer-section"
import Icon from "@/components/ui/icon"

const API_URL = "https://functions.poehali.dev/6352618e-3008-4bce-b0c0-01c2193ef1c2"

type PoemItem = { title: string; url: string; path: string }
type PoemFull = { title: string; text: string; url: string }

function usePoemList() {
  return useQuery<{ poems: PoemItem[]; total: number }>({
    queryKey: ["poems-list"],
    queryFn: async () => {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error("Ошибка загрузки")
      return res.json()
    },
    staleTime: 1000 * 60 * 30,
  })
}

function usePoemText(url: string | null) {
  return useQuery<PoemFull>({
    queryKey: ["poem", url],
    queryFn: async () => {
      const res = await fetch(`${API_URL}?url=${encodeURIComponent(url!)}`)
      if (!res.ok) throw new Error("Ошибка загрузки")
      return res.json()
    },
    enabled: !!url,
    staleTime: 1000 * 60 * 60,
  })
}

function PoemModal({ url, onClose }: { url: string; onClose: () => void }) {
  const { data, isLoading } = usePoemText(url)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <motion.div
        className="relative w-full max-w-xl bg-background rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 30 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4 flex-shrink-0">
          {isLoading ? (
            <div className="h-7 w-48 bg-secondary rounded-lg animate-pulse" />
          ) : (
            <h2 className="font-serif text-2xl text-foreground pr-4">{data?.title}</h2>
          )}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary hover:bg-border flex items-center justify-center transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="w-16 h-px bg-primary/40 mx-8 mb-6 flex-shrink-0" />

        {/* Text */}
        <div className="overflow-y-auto px-8 pb-8">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} />
              ))}
            </div>
          ) : data?.text ? (
            <pre className="font-serif text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {data.text}
            </pre>
          ) : (
            <p className="text-muted-foreground">Не удалось загрузить текст.</p>
          )}

          {data?.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Icon name="ExternalLink" size={14} />
              Читать на Стихи.ру
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function PoemsPage() {
  const { data, isLoading, isError, refetch } = usePoemList()
  const [activeUrl, setActiveUrl] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const poems = data?.poems ?? []
  const filtered = poems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <LenisProvider>
      <main className="custom-cursor bg-background min-h-screen">
        <CustomCursor />

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-28 pb-12">
          <motion.p
            className="text-muted-foreground text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Поэзия
          </motion.p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.h1
              className="text-5xl md:text-7xl font-serif text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Стихи
            </motion.h1>
            {data?.total && (
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {data.total} стихотворений
              </motion.p>
            )}
          </div>

          {/* Search */}
          <motion.div
            className="mt-8 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию..."
              className="w-full bg-secondary border-0 rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </motion.div>
        </section>

        {/* List */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          {isLoading && (
            <div className="space-y-px">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="py-5 border-b border-border flex items-center gap-4">
                  <div className="w-6 h-4 bg-secondary rounded animate-pulse" />
                  <div className="h-5 bg-secondary rounded animate-pulse" style={{ width: `${30 + Math.random() * 40}%` }} />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">Не удалось загрузить стихи</p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="divide-y divide-border">
              <AnimatePresence>
                {filtered.map((poem, i) => (
                  <motion.button
                    key={poem.path}
                    className="w-full group flex items-center gap-5 py-5 text-left hover:pl-4 transition-all duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.5) }}
                    onClick={() => setActiveUrl(poem.url)}
                    data-clickable
                  >
                    <span className="text-muted-foreground text-sm w-8 flex-shrink-0 font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-lg text-foreground group-hover:text-primary transition-colors flex-1">
                      {poem.title}
                    </span>
                    <Icon
                      name="ArrowRight"
                      size={16}
                      className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                    />
                  </motion.button>
                ))}
              </AnimatePresence>

              {filtered.length === 0 && !isLoading && (
                <p className="py-12 text-center text-muted-foreground">Ничего не найдено</p>
              )}
            </div>
          )}

          {/* Link to stihi.ru */}
          {!isLoading && (
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href="https://stihi.ru/avtor/dimarus"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="ExternalLink" size={14} />
                Все стихи на Стихи.ру
              </a>
            </motion.div>
          )}
        </section>

        <FooterSection />

        <AnimatePresence>
          {activeUrl && (
            <PoemModal url={activeUrl} onClose={() => setActiveUrl(null)} />
          )}
        </AnimatePresence>
      </main>
    </LenisProvider>
  )
}
