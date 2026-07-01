import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-6 py-24"
    >
      <motion.div
        className="flex flex-col items-center justify-center z-10 gap-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-center text-foreground"
          style={{ textShadow: "0 0 20px rgba(255,255,255,0.9), 0 2px 8px rgba(255,255,255,0.7)" }}
        >
          Дмитрий Рудак, <em className="italic">музыка души</em>.
        </h1>
        <motion.img
          src="https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/bucket/0a0e5198-915a-4e82-84cc-c9a9a4e23b5f.png"
          alt="Дмитрий Рудак"
          style={{ y }}
          className="w-72 md:w-96 lg:w-[480px] object-contain drop-shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1 h-2 rounded-full bg-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}