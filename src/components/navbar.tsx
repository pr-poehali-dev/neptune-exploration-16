import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

const links = [
  { label: "Главная", href: "/" },
  { label: "Треки", href: "/tracks" },
  { label: "Видео", href: "/videos" },
  { label: "Галерея", href: "/gallery" },
  { label: "Новости", href: "/news" },
  { label: "Стихи", href: "/poems" },
]

export function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-serif text-xl text-foreground hover:text-primary transition-colors" data-clickable>
            РУДАК.
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-4 py-2 text-sm rounded-full transition-colors ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-clickable
                >
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      layoutId="nav-pill"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center text-foreground"
            onClick={() => setMenuOpen((o) => !o)}
            data-clickable
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-background flex flex-col"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-16" />
            <nav className="flex flex-col px-8 pt-10 gap-2">
              {links.map((link, i) => {
                const isActive = location.pathname === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.href}
                      className={`flex items-center justify-between py-4 border-b border-border text-3xl font-serif transition-colors ${
                        isActive ? "text-primary" : "text-foreground hover:text-primary"
                      }`}
                      data-clickable
                    >
                      {link.label}
                      {isActive && <Icon name="ArrowRight" size={20} className="text-primary" />}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            <div className="mt-auto px-8 pb-12 text-muted-foreground text-sm">
              © 2026 Дмитрий Рудак
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}