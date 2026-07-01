import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"

import { LenisProvider } from "@/components/lenis-provider"
import { CustomCursor } from "@/components/custom-cursor"
import { FooterSection } from "@/components/sections/footer-section"
import Icon from "@/components/ui/icon"

const TRACKS_API = "https://functions.poehali.dev/74b9b481-4e81-4d59-b8ae-c16b7a05c186"

const FALLBACK_COVER = "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/5b9d41ba-9b0a-4959-aa53-b18bfd770e78.jpg"

type DbTrack = {
  id: number
  title: string
  album: string
  year: string
  cover_url: string | null
  audio_url: string | null
  sort_order: number
}

type Track = {
  id: number
  title: string
  album: string
  year: string
  duration: string
  cover: string
  audioUrl?: string
}

function formatTime(sec: number) {
  if (!isFinite(sec)) return "0:00"
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

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

function PlayerBar({
  track,
  onClose,
  onPrev,
  onNext,
}: {
  track: Track
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = track.audioUrl || ""
    audio.load()
    if (track.audioUrl) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
    setCurrentTime(0)
  }, [track])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onEnded = () => { setIsPlaying(false); onNext() }
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("loadedmetadata", onMeta)
    audio.addEventListener("ended", onEnded)
    return () => {
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("loadedmetadata", onMeta)
      audio.removeEventListener("ended", onEnded)
    }
  }, [onNext])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) { audio.pause(); setIsPlaying(false) }
    else { audio.play(); setIsPlaying(true) }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !duration) return
    const rect = progressRef.current.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = ratio * duration
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <audio ref={audioRef} preload="auto" />

      <div
        ref={progressRef}
        className="h-1 bg-border cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-md"
          style={{ left: `${progress}%`, transform: "translate(-50%, -50%)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4 md:gap-6">
        <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <p className="font-serif text-foreground truncate">{track.title}</p>
          <p className="text-muted-foreground text-sm truncate">{track.album}</p>
        </div>

        <span className="text-muted-foreground text-xs hidden md:block">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="flex items-center gap-2 md:gap-4">
          <AudioWaveVisualizer isPlaying={isPlaying} />

          <button onClick={onPrev} className="text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            <Icon name="SkipBack" size={18} />
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            <Icon name={isPlaying ? "Pause" : "Play"} size={20} className="text-primary-foreground" />
          </button>

          <button onClick={onNext} className="text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            <Icon name="SkipForward" size={18} />
          </button>

          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
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

      {isActive && <AudioWaveVisualizer isPlaying={true} />}

      {track.audioUrl ? (
        <Icon name="Volume2" size={14} className="text-primary flex-shrink-0" />
      ) : (
        <span className="text-muted-foreground text-sm flex-shrink-0">{track.duration}</span>
      )}
    </motion.div>
  )
}

export default function TracksPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  const { data } = useQuery<{ tracks: DbTrack[] }>({
    queryKey: ["tracks-db"],
    queryFn: async () => {
      const res = await fetch(TRACKS_API)
      if (!res.ok) throw new Error("err")
      return res.json()
    },
    staleTime: 1000 * 60 * 5,
  })

  const allTracks: Track[] = (data?.tracks || []).map((t) => ({
    id: t.id,
    title: t.title,
    album: t.album,
    year: t.year,
    duration: "",
    cover: t.cover_url || FALLBACK_COVER,
    audioUrl: t.audio_url || undefined,
  }))

  const activeTrack = activeIdx !== null ? allTracks[activeIdx] : null

  const handlePlay = (idx: number) => {
    setActiveIdx((prev) => (prev === idx ? null : idx))
  }

  const handlePrev = () => {
    setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setActiveIdx((prev) => (prev !== null && prev < allTracks.length - 1 ? prev + 1 : null))
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

        {/* Featured cover + list */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <img
                src={activeTrack?.cover || allTracks[0]?.cover || FALLBACK_COVER}
                alt="Обложка"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white/70 text-sm uppercase tracking-widest">
                  {activeTrack ? "Сейчас играет" : "Последний релиз"}
                </p>
                <p className="text-white font-serif text-2xl mt-1">
                  {activeTrack?.title || allTracks[0]?.title || ""}
                </p>
              </div>
            </motion.div>

            {/* Track list */}
            <div className="space-y-2">
              {allTracks.map((track, i) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  isActive={activeIdx === i}
                  onPlay={() => handlePlay(i)}
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
                <a
                  href="https://music.mts.ru/album/39021997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-sm font-medium transition-colors"
                  data-clickable
                >
                  <Icon name="Radio" size={15} />
                  МТС Музыка
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
              key={activeTrack.id}
              track={activeTrack}
              onClose={() => setActiveIdx(null)}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
        </AnimatePresence>
      </main>
    </LenisProvider>
  )
}