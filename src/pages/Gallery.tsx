import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { LenisProvider } from "@/components/lenis-provider"
import { CustomCursor } from "@/components/custom-cursor"
import { FooterSection } from "@/components/sections/footer-section"
import Icon from "@/components/ui/icon"

const photos = [
  {
    id: 1,
    src: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/25408162-be66-4940-af29-981ecbc8086b.jpg",
    category: "Портрет",
    title: "Студийная сессия 2024",
    span: "row-span-2",
  },
  {
    id: 2,
    src: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/0bd25a7b-76cd-4196-84ab-10e391dcac7d.jpg",
    category: "Концерт",
    title: "Большой концерт, Москва",
    span: "",
  },
  {
    id: 3,
    src: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/f1a73a74-836a-45cb-8a8e-b6ea48e8fe18.jpg",
    category: "Студия",
    title: "Запись альбома",
    span: "",
  },
  {
    id: 4,
    src: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/4561ef7a-aca8-4ff8-afc1-2afe2b7618c0.jpg",
    category: "Backstage",
    title: "Перед выходом на сцену",
    span: "",
  },
  {
    id: 5,
    src: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/cb8ffe48-e6fb-4c0e-bfa6-7dd67cd62969.jpg",
    category: "Портрет",
    title: "Ночная Москва",
    span: "row-span-2",
  },
  {
    id: 6,
    src: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/b8b92ec4-7e6b-4ef0-a5ab-e433d906a116.jpg",
    category: "Пресс",
    title: "Официальное фото 2024",
    span: "",
  },
  {
    id: 7,
    src: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/36ee897f-89d6-4665-99da-e65a2a0d2603.jpg",
    category: "Студия",
    title: "В студии с микрофоном",
    span: "",
  },
  {
    id: 8,
    src: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/3f90295c-cb30-45cb-9c60-bb4b43075670.jpg",
    category: "Концерт",
    title: "На сцене",
    span: "",
  },
]

type Photo = typeof photos[0]

const categories = ["Все", "Портрет", "Концерт", "Студия", "Backstage", "Пресс"]

function Lightbox({ photo, photos, onClose, onPrev, onNext }: {
  photo: Photo
  photos: Photo[]
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const idx = photos.findIndex((p) => p.id === photo.id)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <Icon name="X" size={18} className="text-white" />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-6 z-10 text-white/50 text-sm font-medium">
        {idx + 1} / {photos.length}
      </div>

      {/* Prev */}
      <button
        onClick={onPrev}
        className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <Icon name="ChevronLeft" size={22} className="text-white" />
      </button>

      {/* Image */}
      <motion.div
        key={photo.id}
        className="relative z-10 max-w-5xl max-h-[85vh] mx-16 md:mx-24"
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
        />
        <div className="mt-4 text-center">
          <span className="text-white/50 text-xs uppercase tracking-widest">{photo.category}</span>
          <p className="text-white font-serif text-xl mt-1">{photo.title}</p>
        </div>
      </motion.div>

      {/* Next */}
      <button
        onClick={onNext}
        className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <Icon name="ChevronRight" size={22} className="text-white" />
      </button>
    </motion.div>
  )
}

export default function GalleryPage() {
  const [filter, setFilter] = useState("Все")
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)

  const filtered = filter === "Все" ? photos : photos.filter((p) => p.category === filter)

  const openLightbox = (photo: Photo) => setLightboxPhoto(photo)
  const closeLightbox = () => setLightboxPhoto(null)

  const prevPhoto = () => {
    if (!lightboxPhoto) return
    const idx = filtered.findIndex((p) => p.id === lightboxPhoto.id)
    setLightboxPhoto(filtered[(idx - 1 + filtered.length) % filtered.length])
  }
  const nextPhoto = () => {
    if (!lightboxPhoto) return
    const idx = filtered.findIndex((p) => p.id === lightboxPhoto.id)
    setLightboxPhoto(filtered[(idx + 1) % filtered.length])
  }

  return (
    <LenisProvider>
      <main className="custom-cursor bg-background min-h-screen">
        <CustomCursor />

        {/* Header */}
        <header className="px-6 py-6 flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={18} />
            <span className="text-sm">На главную</span>
          </Link>
          <span className="font-serif text-xl text-foreground">РУДАК.</span>
        </header>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-12 pb-12">
          <motion.p
            className="text-muted-foreground text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Визуальное
          </motion.p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.h1
              className="text-5xl md:text-7xl font-serif text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Фотогалерея
            </motion.h1>

            {/* Filters */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                  data-clickable
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Masonry Grid */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <motion.div
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => openLightbox(photo)}
                  data-clickable
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                    <motion.div
                      className="p-4 w-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <span className="text-white/60 text-xs uppercase tracking-widest">{photo.category}</span>
                      <p className="text-white font-serif text-lg mt-0.5">{photo.title}</p>
                    </motion.div>
                  </div>

                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="ZoomIn" size={14} className="text-white" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <FooterSection />

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxPhoto && (
            <Lightbox
              photo={lightboxPhoto}
              photos={filtered}
              onClose={closeLightbox}
              onPrev={prevPhoto}
              onNext={nextPhoto}
            />
          )}
        </AnimatePresence>
      </main>
    </LenisProvider>
  )
}
