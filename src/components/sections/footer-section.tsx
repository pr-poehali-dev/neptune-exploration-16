import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const footerLinks = [
  { label: "Треки", href: "/tracks" },
  { label: "Видео", href: "/videos" },
  { label: "Галерея", href: "/gallery" },
  { label: "Новости", href: "/news" },
]

const streamingLinks = [
  {
    label: "Яндекс.Музыка",
    href: "https://music.yandex.ru/album/39021997",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.75 17.5h-1.5v-7.22l-2.47 2.47-1.06-1.06 3.53-3.53 3.53 3.53-1.06 1.06-2.47-2.47V17.5z"/>
      </svg>
    ),
  },
  {
    label: "VK Музыка",
    href: "https://music.vk.com/link/h7Rq9",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.566c0 .422-.134.677-1.252.677-1.845 0-3.896-1.12-5.334-3.202C5.014 11.276 4.48 9.148 4.48 8.68c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V10.27c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.252-1.405 2.151-3.57 2.151-3.57.118-.254.322-.491.762-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.78 1.202 1.252.745.847 1.32 1.558 1.473 2.05.17.491-.085.745-.576.745z"/>
      </svg>
    ),
  },
  {
    label: "МТС Музыка",
    href: "https://music.mts.ru/album/39021997",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      </svg>
    ),
  },
]

export function FooterSection() {
  const [email, setEmail] = useState("")

  return (
    <footer className="relative bg-background px-6 py-24 overflow-hidden">
      {/* Gradient blob */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-300 via-purple-200 to-lime-200 opacity-40 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
          {/* Logo */}
          <div className="md:col-span-1">
            <motion.h2
              className="text-6xl md:text-7xl font-serif text-foreground"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              РУДАК.
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-sm mt-4 max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Автор песен, стихов, исполнитель и продюсер. Музыкальный продюсерский центр.
            </motion.p>

            {/* Streaming */}
            <motion.div
              className="flex gap-3 mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              {streamingLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-muted-foreground flex items-center justify-center transition-colors"
                  data-clickable
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Nav links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-5">Разделы</p>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className="text-foreground hover:text-primary transition-colors"
                  data-clickable
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Email signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-5">Рассылка</p>
            <p className="text-muted-foreground text-sm mb-4">Новости, релизы и анонсы концертов — первым.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                className="flex-1 bg-secondary border-0 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-foreground text-background p-3 rounded-lg hover:bg-foreground/90 transition-colors"
                data-clickable
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© 2026 Дмитрий Рудак. Все права защищены.</p>
          <div className="flex gap-4">
            {streamingLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                data-clickable
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}