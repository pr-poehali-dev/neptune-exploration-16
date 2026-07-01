import { motion } from "framer-motion"

const portfolioItems = [
  "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/a7f039c0-b9bf-45a9-b1e2-f353f8b02fea.jpg",
  "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/23056358-0bf7-49b6-8f59-51e0164ad976.jpg",
  "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/3f90295c-cb30-45cb-9c60-bb4b43075670.jpg",
  "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/50174bda-eaf5-4090-a487-2fe1d68d6879.jpg",
  "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/36ee897f-89d6-4665-99da-e65a2a0d2603.jpg",
]

export function CarouselSection() {
  // Duplicate for seamless loop
  const items = [...portfolioItems, ...portfolioItems]

  return (
    <section className="bg-primary py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <motion.h2
          className="text-3xl md:text-4xl font-serif text-primary-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Музыка, которая остаётся с тобой.
        </motion.h2>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-6"
          animate={{ x: [0, "-50%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {items.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[300px] md:w-[400px] rounded-xl overflow-hidden shadow-2xl"
              data-clickable
            >
              <img
                src={src || "/placeholder.svg"}
                alt={`Пример портфолио ${(i % portfolioItems.length) + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}