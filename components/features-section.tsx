"use client"

import { useEffect, useRef, useState } from "react"
import { Zap, Shield, TrendingUp, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { getBenefits } from "@/lib/home"
import { useLanguage } from "@/lib/i18n/language-context"

// Icon mapping based on benefit icons
const iconMap: Record<string, any> = {
  "⚡": Zap,
  "🔒": Shield,
  "📈": TrendingUp,
  "🎯": Target,
}

type LocalizedString = {
  ar: string
  en: string
}

type Benefit = {
  id: number
  icon: string
  title: LocalizedString
  description: LocalizedString
}

type BenefitsResponse = {
  success: boolean
  data: Benefit[]
}

export function FeaturesSection() {
  const [visible, setVisible] = useState(false)
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { language } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          // Auto-play video when visible
          if (videoRef.current) {
            videoRef.current.play().catch(console.error)
          }
        }
      },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    getBenefits()
      .then((response: BenefitsResponse) => {
        if (response.success) {
          setBenefits(response.data)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Helper function to get localized text
  const t = (field: LocalizedString) => {
    return field[language as keyof LocalizedString] || field.en || field.ar || ""
  }

  // Get icon component based on benefit icon
  const getIcon = (benefit: Benefit) => {
    return iconMap[benefit.icon] || Zap
  }

  const isRTL = language === "ar"

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="py-16 md:py-24 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = getIcon(benefit)
              return (
                <div
                  key={benefit.id}
                  className={cn(
                    "p-5 md:p-6 bg-card rounded-xl border border-border hover:border-blue-500/50 transition-all duration-300",
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-5 md:w-6 h-5 md:h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-base md:text-lg">
                    {t(benefit.title)}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t(benefit.description)}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Right Video */}
          <div
            className={cn(
              "relative h-72 md:h-96 rounded-2xl overflow-hidden transition-all duration-700",
            )}
            style={{ transitionDelay: "400ms" }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-2xl"
              autoPlay
              muted
              loop
              playsInline
              poster="/placeholder.svg?height=500&width=500"
            >
              <source src="https://admin.zynqor.org/public/vid.mp4" type="video/mp4" />
              {isRTL 
                ? "متصفحك لا يدعم تشغيل الفيديو" 
                : "Your browser does not support the video tag."}
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
