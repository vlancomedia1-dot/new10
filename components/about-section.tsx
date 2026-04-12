"use client"

import { useEffect, useRef, useState } from "react"
import { Target, Lightbulb, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAbout } from "@/lib/home"
import { useLanguage } from "@/lib/i18n/language-context"

type LocalizedString = { ar: string; en: string }

type VisionValue = {
  title: LocalizedString
  description: LocalizedString
}

type AboutData = {
  title: LocalizedString
  subtitle: LocalizedString
  story: LocalizedString
  vision_and_values: VisionValue[]
  founded_year: string
  team_size: string
  projects_count: string
}

export function AboutSection() {
  const [visible, setVisible] = useState(false)
  const [about, setAbout] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const isRTL = language === "ar"
  const t = (field: LocalizedString) => field[language as keyof LocalizedString] || field.en

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    getAbout()
      .then((res: any) => res.success && setAbout(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !about) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">{isRTL ? "جاري التحميل..." : "Loading..."}</p>
        </div>
      </section>
    )
  }

  // Get vision, mission, and values from the array
  const vision = about.vision_and_values[0]
  const mission = about.vision_and_values[1]
  const values = about.vision_and_values[2]

  return (
    <section id="about" ref={ref} className="py-16 md:py-24 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Content */}
          <div
            className={cn(
              "space-y-6 md:space-y-8 transition-all duration-700",
             )}
          >
            <div>
              <span className="text-blue-600 font-semibold text-xs md:text-sm uppercase tracking-wider">
                {t(about.title)}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 md:mb-6 text-balance">
                {t(about.subtitle)}
              </h2>
              <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">
                {t(about.story)}
              </p>
            </div>

            {/* Values */}
            {values && (
              <div className="space-y-3">
                <h3 className="font-bold text-foreground mb-4 text-base md:text-lg">{t(values.title)}</h3>
                <p className="text-muted-foreground text-sm md:text-base flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{t(values.description)}</span>
                </p>
              </div>
            )}
          </div>

          {/* Visual */}
          <div
            className={cn(
              "transition-all duration-700 delay-300",
            )}
          >
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {/* Vision Card */}
              {vision && (
                <div className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-lg">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{t(vision.title)}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">{t(vision.description)}</p>
                </div>
              )}

              {/* Mission Card */}
              {mission && (
                <div className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-lg mt-6 md:mt-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{t(mission.title)}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">{t(mission.description)}</p>
                </div>
              )}

              {/* Stats Card */}
              <div className="col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 md:p-6 text-white">
                <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">{about.founded_year}</div>
                    <div className="text-xs md:text-sm opacity-80">
                      {isRTL ? "سنة التأسيس" : "Founded"}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">{about.team_size}</div>
                    <div className="text-xs md:text-sm opacity-80">
                      {isRTL ? "خبير تقني" : "Experts"}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">{about.projects_count}</div>
                    <div className="text-xs md:text-sm opacity-80">
                      {isRTL ? "مشروع" : "Projects"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}