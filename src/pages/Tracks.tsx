import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { LenisProvider } from "@/components/lenis-provider"
import { CustomCursor } from "@/components/custom-cursor"
import { FooterSection } from "@/components/sections/footer-section"
import Icon from "@/components/ui/icon"

const tracks = [
  {
    id: 1,
    title: "Между строк",
    album: "Одиночество в сети",
    year: "2024",
    duration: "3:42",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/5b9d41ba-9b0a-4959-aa53-b18bfd770e78.jpg",
    audio: null,
  },
  {
    id: 2,
    title: "Ночной город",
    album: "Одиночество в сети",
    year: "2024",
    duration: "4:15",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/39217df6-afc5-4024-9a1b-44359fb2971d.jpg",
    audio: null,
  },
  {
    id: 3,
    title: "Последний шанс",
    album: "Сингл",
    year: "2023",
    duration: "3:58",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/78d0219e-cb3f-4d8e-9ca4-ceae5aa45588.jpg",
    audio: null,
  },
  {
    id: 4,
    title: "Красная нить",
    album: "Сингл",
    year: "2023",
    duration: "4:30",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/258050f4-d7fa-4b9a-8f46-14e39849014c.jpg",
    audio: null,
  },
]

type Track = typeof tracks[0]

function AudioWaveVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const [bars, setBars] = useState([0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4, 0.6, 0.35])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setBars((prev) => prev.map(() => 0.2 + Math.random() * 0.8))
    }, 150)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="flex items-end gap-[3px] h-6">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] bg-primary rounded-full"
          animate={{ height: isPlaying ? `${h * 24}px` : "6px" }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}

function PlayerBar({ track, onClose }: { track: Track; onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isPlaying || isDragging) return
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.1))
    }, 100)
    return () => clearInterval(interval)
  }, [isPlaying, isDragging])

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    setProgress((x / rect.width) * 100)
  }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={progressRef}
        className="h-1 bg-border cursor-pointer relative"
        onClick={handleProgressClick}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${progress}%` }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-md"
          style={{ left: `${progress}%`, x: "-50%" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
        <img
          src={track.cover}
          alt={track.title}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p className="font-serif text-foreground truncate">{track.title}</p>
          <p className="text-muted-foreground text-sm truncate">{track.album}</p>
        </div>

        <div className="flex items-center gap-4">
          <AudioWaveVisualizer isPlaying={isPlaying} />

          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            <Icon name={isPlaying ? "Pause" : "Play"} size={20} className="text-primary-foreground" />
          </button>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function TrackCard({ track, isActive, onPlay }: { track: Track; isActive: boolean; onPlay: () => void }) {
  return (
    <motion.div
      className={`group flex items-center gap-5 p-4 rounded-xl cursor-pointer transition-colors ${
        isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary"
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onPlay}
      data-clickable
    >
      <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden shadow-lg">
        <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}>
          <Icon name={isActive ? "Pause" : "Play"} size={22} className="text-white" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-serif text-lg truncate ${isActive ? "text-primary" : "text-foreground"}`}>
          {track.title}
        </p>
        <p className="text-muted-foreground text-sm truncate">{track.album} · {track.year}</p>
      </div>

      {isActive && (
        <AudioWaveVisualizer isPlaying={true} />
      )}

      <span className="text-muted-foreground text-sm flex-shrink-0">{track.duration}</span>
    </motion.div>
  )
}

export default function TracksPage() {
  const [activeTrack, setActiveTrack] = useState<Track | null>(null)

  const handlePlay = (track: Track) => {
    if (activeTrack?.id === track.id) {
      setActiveTrack(null)
    } else {
      setActiveTrack(track)
    }
  }

  return (
    <LenisProvider>
      <main className="custom-cursor bg-background min-h-screen">
        <CustomCursor />

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-28 pb-20">
          <motion.p
            className="text-muted-foreground text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Дискография
          </motion.p>
          <motion.h1
            className="text-5xl md:text-7xl font-serif text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Треки
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Авторские песни — слова, мелодии и эмоции, рождённые в студии и на сцене.
          </motion.p>
        </section>

        {/* Featured cover */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <img
                src={activeTrack?.cover || tracks[0].cover}
                alt="Обложка"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white/70 text-sm uppercase tracking-widest">
                  {activeTrack ? "Сейчас играет" : "Последний релиз"}
                </p>
                <p className="text-white font-serif text-2xl mt-1">
                  {activeTrack?.title || tracks[0].title}
                </p>
              </div>
            </motion.div>

            {/* Track list */}
            <div className="space-y-2">
              {tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  isActive={activeTrack?.id === track.id}
                  onPlay={() => handlePlay(track)}
                />
              ))}

              {/* Streaming links */}
              <div className="pt-4 flex flex-wrap gap-3">
                <a
                  href="https://music.yandex.ru/album/39021997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-sm font-medium transition-colors"
                  data-clickable
                >
                  <Icon name="Music" size={15} />
                  Яндекс.Музыка
                </a>
                <a
                  href="https://music.vk.com/link/h7Rq9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-sm font-medium transition-colors"
                  data-clickable
                >
                  <Icon name="Music2" size={15} />
                  VK Музыка
                </a>
              </div>
            </div>
          </div>
        </section>

        <FooterSection />

        {/* Sticky player */}
        <AnimatePresence>
          {activeTrack && (
            <PlayerBar
              track={activeTrack}
              onClose={() => setActiveTrack(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </LenisProvider>
  )
}