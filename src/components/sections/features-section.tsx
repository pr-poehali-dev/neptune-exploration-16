import { useState, useEffect } from "react"
import { motion } from "framer-motion"

function AudioWave() {
  const [bars, setBars] = useState([0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4])

  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prev) => prev.map(() => 0.2 + Math.random() * 0.8))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-end justify-center gap-2 h-full py-8">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-3 md:w-4 bg-primary rounded-full"
          animate={{ height: `${h * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}

function LayoutAnimation() {
  const [layout, setLayout] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLayout((prev) => (prev + 1) % 3)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const layouts = ["grid-cols-2 grid-rows-2", "grid-cols-3 grid-rows-1", "grid-cols-1 grid-rows-3"]

  return (
    <div className="h-full p-4 flex items-center justify-center">
      <motion.div className={`grid ${layouts[layout]} gap-2 w-full max-w-[140px]`} layout>
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="bg-primary/20 rounded-md min-h-[30px]"
            layout
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </motion.div>
    </div>
  )
}

function VinylSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-foreground flex items-center justify-center relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-2 rounded-full border border-background/20" />
        <div className="absolute inset-5 rounded-full border border-background/20" />
        <div className="w-8 h-8 rounded-full bg-primary" />
      </motion.div>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section className="bg-background px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-muted-foreground text-sm uppercase tracking-widest mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Возможности
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Typography Card */}
          <motion.div
            className="bg-secondary rounded-xl p-8 min-h-[280px] flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2 }}
            data-clickable
          >
            <div className="flex-1">
              <AudioWave />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-foreground">Треки</h3>
              <p className="text-muted-foreground text-sm mt-1">Авторские песни и аранжировки в высоком качестве.</p>
            </div>
          </motion.div>

          {/* Layouts Card */}
          <motion.div
            className="bg-secondary rounded-xl p-8 min-h-[280px] flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            data-clickable
          >
            <div className="flex-1">
              <LayoutAnimation />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-foreground">Видео и клипы</h3>
              <p className="text-muted-foreground text-sm mt-1">Атмосферные видеоработы и премьеры новых клипов.</p>
            </div>
          </motion.div>

          {/* Speed Card */}
          <motion.div
            className="bg-secondary rounded-xl p-8 min-h-[280px] flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            data-clickable
          >
            <div className="flex-1">
              <VinylSpinner />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-foreground">Продюсирование</h3>
              <p className="text-muted-foreground text-sm mt-1">Полный цикл создания музыки — от идеи до релиза.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}