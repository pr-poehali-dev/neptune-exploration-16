import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { LenisProvider } from "@/components/lenis-provider"
import { CustomCursor } from "@/components/custom-cursor"
import { FooterSection } from "@/components/sections/footer-section"
import Icon from "@/components/ui/icon"

const videos = [
  {
    id: 1,
    title: "Между строк",
    type: "Клип",
    year: "2024",
    duration: "3:42",
    youtubeId: "dQw4w9WgXcQ",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/9238c36d-5425-4da5-9bae-07ad75c61669.jpg",
    description: "Официальный клип на песню «Между строк» из альбома «Одиночество в сети».",
  },
  {
    id: 2,
    title: "Ночной город",
    type: "Клип",
    year: "2024",
    duration: "4:15",
    youtubeId: "dQw4w9WgXcQ",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/890e2693-04be-4f9b-8805-696ad2af3473.jpg",
    description: "Ночной клип, снятый в центре Москвы за одну ночь.",
  },
  {
    id: 3,
    title: "За кулисами: запись альбома",
    type: "Backstage",
    year: "2024",
    duration: "12:30",
    youtubeId: "dQw4w9WgXcQ",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/c8f59758-ceea-4654-846d-43c6d0874c68.jpg",
    description: "Закулисные съёмки процесса записи нового альбома в студии.",
  },
  {
    id: 4,
    title: "Последний шанс",
    type: "Лирик-видео",
    year: "2023",
    duration: "3:58",
    youtubeId: "dQw4w9WgXcQ",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/3f90295c-cb30-45cb-9c60-bb4b43075670.jpg",
    description: "Лирик-видео с текстом песни на фоне концертных съёмок.",
  },
  {
    id: 5,
    title: "Большой концерт 2023",
    type: "Концерт",
    year: "2023",
    duration: "1:24:00",
    youtubeId: "dQw4w9WgXcQ",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/a7f039c0-b9bf-45a9-b1e2-f353f8b02fea.jpg",
    description: "Полная запись сольного концерта в Москве, 2023 год.",
  },
]

type Video = typeof videos[0]

const typeColors: Record<string, string> = {
  "Клип": "bg-primary/20 text-primary",
  "Backstage": "bg-amber-500/20 text-amber-400",
  "Лирик-видео": "bg-purple-500/20 text-purple-400",
  "Концерт": "bg-green-500/20 text-green-400",
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <motion.div
        className="relative w-full max-w-4xl bg-background rounded-2xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* YouTube embed */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Info */}
        <div className="p-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[video.type] || "bg-secondary text-muted-foreground"}`}>
                {video.type}
              </span>
              <span className="text-muted-foreground text-sm">{video.year} · {video.duration}</span>
            </div>
            <h2 className="font-serif text-2xl text-foreground">{video.title}</h2>
            <p className="text-muted-foreground text-sm mt-2">{video.description}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function VideoCard({ video, index, onPlay }: { video: Video; index: number; onPlay: () => void }) {
  const isFeatured = index === 0

  if (isFeatured) {
    return (
      <motion.div
        className="col-span-1 md:col-span-2 group cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={onPlay}
        data-clickable
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={video.cover}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name="Play" size={32} className="text-white ml-1" />
            </motion.div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${typeColors[video.type] || "bg-secondary text-muted-foreground"}`}>
              {video.type}
            </span>
          </div>
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
            {video.duration}
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-white/70 text-sm mb-1">{video.year} · Премьера</p>
            <h3 className="font-serif text-3xl text-white">{video.title}</h3>
            <p className="text-white/70 text-sm mt-2 line-clamp-2">{video.description}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      onClick={onPlay}
      data-clickable
    >
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg mb-3">
        <img
          src={video.cover}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.div
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <Icon name="Play" size={22} className="text-white ml-0.5" />
          </motion.div>
        </div>

        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium backdrop-blur-sm ${typeColors[video.type] || "bg-secondary text-muted-foreground"}`}>
            {video.type}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
          {video.duration}
        </div>
      </div>

      <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
        {video.title}
      </h3>
      <p className="text-muted-foreground text-sm mt-0.5">{video.year}</p>
    </motion.div>
  )
}

export default function VideosPage() {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)
  const [filter, setFilter] = useState<string>("Все")

  const types = ["Все", ...Array.from(new Set(videos.map((v) => v.type)))]
  const filtered = filter === "Все" ? videos : videos.filter((v) => v.type === filter)

  return (
    <LenisProvider>
      <main className="custom-cursor bg-background min-h-screen">
        <CustomCursor />

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-28 pb-16">
          <motion.p
            className="text-muted-foreground text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Видеография
          </motion.p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.h1
              className="text-5xl md:text-7xl font-serif text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Видео и клипы
            </motion.h1>
            {/* Filters */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                  data-clickable
                >
                  {type}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Grid */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((video, i) => (
              <VideoCard
                key={video.id}
                video={video}
                index={i}
                onPlay={() => setActiveVideo(video)}
              />
            ))}
          </div>
        </section>

        <FooterSection />

        {/* Modal */}
        <AnimatePresence>
          {activeVideo && (
            <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
          )}
        </AnimatePresence>
      </main>
    </LenisProvider>
  )
}