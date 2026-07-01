import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { LenisProvider } from "@/components/lenis-provider"
import { CustomCursor } from "@/components/custom-cursor"
import { FooterSection } from "@/components/sections/footer-section"
import Icon from "@/components/ui/icon"

const news = [
  {
    id: 1,
    title: "Премьера нового сингла «Между строк»",
    category: "Релиз",
    date: "15 июня 2024",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/5b9d41ba-9b0a-4959-aa53-b18bfd770e78.jpg",
    excerpt: "Долгожданный новый сингл уже доступен на всех стриминговых платформах. Трек стал первым из готовящегося альбома.",
    body: `Долгожданный новый сингл «Между строк» уже доступен на всех стриминговых платформах — Spotify, Apple Music, VK Музыка и Яндекс.Музыка.

Трек стал первым из готовящегося альбома «Одиночество в сети», над которым Дмитрий работал почти год. В песне переплетаются темы одиночества в современном мире и поиска настоящих человеческих связей.

«Эта песня написалась за одну ночь. Я просто сел за рояль и слова пришли сами», — рассказывает Дмитрий.

Официальный клип на сингл выйдет в конце июня.`,
    featured: true,
  },
  {
    id: 2,
    title: "Большой сольный концерт этой осенью",
    category: "Концерт",
    date: "3 июня 2024",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/82a0c682-87f9-4330-97a5-dbcde539585b.jpg",
    excerpt: "Дмитрий Рудак объявляет о большом сольном концерте в Москве. Дата, площадка и билеты — уже скоро.",
    body: `Дмитрий Рудак объявляет о большом сольном концерте, который состоится этой осенью в Москве.

Это будет полноценное шоу с живым оркестром, видео-инсталляциями и специальными гостями. В программе — все главные хиты и премьера новых треков с готовящегося альбома.

Дата и площадка будут объявлены в ближайшее время. Подпишитесь на рассылку, чтобы получить уведомление о старте продаж билетов.`,
    featured: false,
  },
  {
    id: 3,
    title: "Новый альбом: работа в студии",
    category: "Студия",
    date: "20 мая 2024",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/f3d0088f-92c5-4b93-9c51-8ee468426f15.jpg",
    excerpt: "Дмитрий делится деталями о записи нового альбома. 12 треков, живые инструменты и много личного.",
    body: `Работа над новым альбомом «Одиночество в сети» выходит на финальную стадию. Дмитрий провёл в студии почти год, чтобы создать то, что считает самой честной работой в своей карьере.

Альбом включает 12 треков, записанных с живыми инструментами — фортепиано, виолончель, контрабас. Ни одного синтетического звука.

«Я хотел сделать альбом, который можно слушать в наушниках в темноте и чувствовать каждое слово», — говорит Дмитрий.

Релиз запланирован на осень 2024 года.`,
    featured: false,
  },
  {
    id: 4,
    title: "Съёмки клипа «Ночной город»",
    category: "Клип",
    date: "10 мая 2024",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/890e2693-04be-4f9b-8805-696ad2af3473.jpg",
    excerpt: "Завершились съёмки клипа на второй сингл. Один съёмочный день, ночная Москва и кино-атмосфера.",
    body: `Завершились съёмки клипа на второй сингл «Ночной город». Съёмочная группа провела одну ночь в центре Москвы, снимая в реальных городских локациях.

Режиссёр клипа — Антон Семёнов, известный своими работами для российских артистов. Клип выдержан в стиле нуар: дождь, отражения в лужах, неоновые вывески.

Премьера клипа запланирована на июль 2024.`,
    featured: false,
  },
  {
    id: 5,
    title: "Интервью для музыкального журнала",
    category: "Пресса",
    date: "28 апреля 2024",
    cover: "https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/99809ac6-b16b-4f5b-9aaf-cf83737169f9.jpg",
    excerpt: "Большое интервью о творческом пути, новом альбоме и о том, почему музыка — это всегда личное.",
    body: `Дмитрий Рудак дал большое интервью одному из ведущих музыкальных изданий страны. Разговор получился очень личным — о творческом пути, кризисах и том, что значит быть честным в музыке.

«Я писал стихи ещё в школе. Просто однажды понял, что их нужно петь», — рассказывает Дмитрий.

Полное интервью читайте на сайте издания.`,
    featured: false,
  },
]

type NewsItem = typeof news[0]

const categoryColors: Record<string, string> = {
  "Релиз": "bg-primary/20 text-primary",
  "Концерт": "bg-green-500/20 text-green-400",
  "Студия": "bg-amber-500/20 text-amber-400",
  "Клип": "bg-purple-500/20 text-purple-400",
  "Пресса": "bg-blue-500/20 text-blue-400",
}

function ArticleModal({ article, onClose }: { article: NewsItem; onClose: () => void }) {
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
        className="relative w-full max-w-2xl bg-background rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        initial={{ scale: 0.92, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 40 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover */}
        <div className="relative h-56 flex-shrink-0">
          <img src={article.cover} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Icon name="X" size={16} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[article.category] || "bg-secondary text-muted-foreground"}`}>
              {article.category}
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Icon name="Calendar" size={13} />
              {article.date}
            </span>
          </div>

          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">{article.title}</h2>

          <div className="text-muted-foreground leading-relaxed space-y-4">
            {article.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function NewsPage() {
  const [filter, setFilter] = useState("Все")
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null)

  const categories = ["Все", ...Array.from(new Set(news.map((n) => n.category)))]
  const filtered = filter === "Все" ? news : news.filter((n) => n.category === filter)

  const featured = filtered.find((n) => n.featured) || filtered[0]
  const rest = filtered.filter((n) => n.id !== featured?.id)

  return (
    <LenisProvider>
      <main className="custom-cursor bg-background min-h-screen">
        <CustomCursor />

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-28 pb-12">
          <motion.p
            className="text-muted-foreground text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Последние события
          </motion.p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.h1
              className="text-5xl md:text-7xl font-serif text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Новости
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

        <section className="max-w-6xl mx-auto px-6 pb-24 space-y-8">
          {/* Featured */}
          {featured && (
            <motion.div
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => setActiveArticle(featured)}
              data-clickable
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-secondary">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src={featured.cover}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[featured.category] || "bg-background text-muted-foreground"}`}>
                      {featured.category}
                    </span>
                    <span className="text-muted-foreground text-sm">{featured.date}</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors mb-4">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                  <div className="mt-6 flex items-center gap-2 text-primary text-sm font-medium">
                    Читать далее
                    <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rest */}
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article, i) => (
                <motion.div
                  key={article.id}
                  className="group cursor-pointer bg-secondary rounded-xl overflow-hidden hover:bg-secondary/80 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => setActiveArticle(article)}
                  data-clickable
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${categoryColors[article.category] || "bg-background/80 text-foreground"}`}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-muted-foreground text-xs mb-2 flex items-center gap-1.5">
                      <Icon name="Calendar" size={12} />
                      {article.date}
                    </p>
                    <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-primary text-sm">
                      Читать
                      <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </section>

        <FooterSection />

        <AnimatePresence>
          {activeArticle && (
            <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
          )}
        </AnimatePresence>
      </main>
    </LenisProvider>
  )
}