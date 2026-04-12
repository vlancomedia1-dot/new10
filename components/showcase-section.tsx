"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, XCircle, TrendingUp, Clock, DollarSign, Zap, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSolutions } from "@/lib/home"
import { useLanguage } from "@/lib/i18n/language-context"

type LocalizedString = {
  ar: string
  en: string
  ru?: string
}

type Solution = {
  id: number
  title: LocalizedString
  overview: LocalizedString
  challenges: LocalizedString[]
  benefits: LocalizedString[]
  technologies: string[]
  duration: LocalizedString
  investment: string
  roi: string
}

type SolutionsResponse = {
  success: boolean
  data: Solution[]
}

export function ShowcaseSection() {
  const [visible, setVisible] = useState(false)
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true)
      },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    getSolutions(6)
      .then((response: SolutionsResponse) => {
        if (response.success) {
          setSolutions(response.data)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Helper function to get localized text
  const t = (field: LocalizedString) => {
    return field[language as keyof LocalizedString] || field.en || field.ar || ""
  }

  const isRTL = language === "ar"

  // Gradient backgrounds for cards
  const gradients = [
    "from-blue-500 to-blue-700",
    "from-purple-500 to-purple-700",
    "from-emerald-500 to-emerald-700",
    "from-rose-500 to-rose-700",
    "from-cyan-500 to-cyan-700",
    "from-orange-500 to-orange-700",
  ]

  if (loading) {
    return (
      <section ref={ref} className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-blue-600 font-semibold text-xs md:text-sm uppercase tracking-wider">
            {isRTL ? "عرض الحلول" : "Solutions Showcase"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 text-balance">
            {isRTL ? "حلول مبتكرة لكل تحدي" : "Innovative Solutions for Every Challenge"}
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            {isRTL
              ? "اكتشف كيف يمكن لحلولنا التقنية المتطورة أن تساعدك على تحقيق أهدافك"
              : "Discover how our advanced technical solutions can help you achieve your goals"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => {
            const gradient = gradients[index % gradients.length]
            const isHovered = hoveredIndex === index

            return (
              <div
                key={solution.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "group relative h-80 md:h-96 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500",
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                  isHovered ? "shadow-2xl scale-105" : "shadow-lg"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Background Gradient */}
                <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />

                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }} />
                </div>

                {/* Content - Default State */}
                <div className={cn(
                  "absolute inset-0 p-6 md:p-8 flex flex-col justify-between transition-opacity duration-300",
                  isHovered ? "opacity-0" : "opacity-100"
                )}>
                  <div>
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                      {t(solution.title)}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base line-clamp-2">
                      {t(solution.overview)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {solution.technologies.slice(0, 2).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs text-white font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {solution.technologies.length > 2 && (
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs text-white font-medium">
                          +{solution.technologies.length - 2}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Content - Hover State */}
                <div className={cn(
                  "absolute inset-0 p-6 md:p-8 flex flex-col justify-between transition-opacity duration-300 overflow-y-auto",
                  isHovered ? "opacity-100" : "opacity-0"
                )}>
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {t(solution.title)}
                    </h3>

                    {/* Key Benefits */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {isRTL ? "الفوائد الرئيسية" : "Key Benefits"}
                      </h4>
                      <ul className="space-y-1.5">
                        {solution.benefits.slice(0, 3).map((benefit, i) => (
                          <li key={i} className="text-white text-xs md:text-sm flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{t(benefit)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                        <Clock className="w-4 h-4 text-white mb-1" />
                        <p className="text-xs text-white/70">
                          {isRTL ? "المدة" : "Duration"}
                        </p>
                        <p className="text-sm font-bold text-white">
                          {t(solution.duration).split(' ')[0]}
                        </p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                        <TrendingUp className="w-4 h-4 text-white mb-1" />
                        <p className="text-xs text-white/70">ROI</p>
                        <p className="text-sm font-bold text-white">
                          {solution.roi}
                        </p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                        <DollarSign className="w-4 h-4 text-white mb-1" />
                        <p className="text-xs text-white/70">
                          {isRTL ? "من" : "From"}
                        </p>
                        <p className="text-xs font-bold text-white">
                          {solution.investment.split('-')[0].trim()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-2.5 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-2">
                    {isRTL ? "اعرف المزيد" : "Learn More"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}