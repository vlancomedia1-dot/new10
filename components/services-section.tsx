"use client"

import { useEffect, useRef, useState } from "react"
import { Smartphone, Monitor, Brain, ShoppingCart, Cloud, Wifi, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { getServices } from "@/lib/home"
import { useLanguage } from "@/lib/i18n/language-context"

// Icon mapping based on service names or icons
const iconMap: Record<string, any> = {
  "تطوير المواقع": Monitor,
  "Web Development": Monitor,
  "تطبيقات الجوال": Smartphone,
  "Mobile Applications": Smartphone,
  "الذكاء الاصطناعي": Brain,
  "Artificial Intelligence": Brain,
  "التجارة الإلكترونية": ShoppingCart,
  "E-Commerce": ShoppingCart,
  "الحوسبة السحابية": Cloud,
  "Cloud Computing": Cloud,
  "إنترنت الأشياء": Wifi,
  "Internet of Things": Wifi,
  // Emoji to icon mapping
  "🌐": Monitor,
  "📱": Smartphone,
  "🤖": Brain,
  "🛒": ShoppingCart,
  "☁️": Cloud,
  "🌍": Wifi,
}

type LocalizedString = {
  ar: string
  en: string
  ru?: string
}

type Service = {
  id: number
  name: LocalizedString
  description: LocalizedString
  icon: string
  color: string
  start_price: string
  slug: string
  url: string
  image: string | null
  technology: string[]
  metadata: {
    subtitle: LocalizedString
  }
}

type ServicesResponse = {
  success: boolean
  data: Service[]
}

export function ServicesSection() {
  const [visible, setVisible] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    getServices(6)
      .then((response: ServicesResponse) => {
        if (response.success) {
          setServices(response.data)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Helper function to get localized text
  const t = (field: LocalizedString) => {
    return field[language as keyof LocalizedString] || field.en || field.ar || ""
  }

  // Get icon component based on service name or icon field
  const getIcon = (service: Service) => {
    const nameAr = service.name.ar
    const nameEn = service.name.en
    const iconEmoji = service.icon
    return iconMap[iconEmoji] || iconMap[nameAr] || iconMap[nameEn] || Monitor
  }

  const isRTL = language === "ar"

  if (loading) {
    return (
      <section id="services" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="services" ref={ref} className="py-16 md:py-24 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-blue-600 font-semibold text-xs md:text-sm uppercase tracking-wider">
            {isRTL ? "خدماتنا" : "Our Services"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 text-balance">
            {isRTL ? "خدمات تقنية متميزة لتحقيق أهدافك" : "Distinguished Technical Services to Achieve Your Goals"}
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            {isRTL
              ? "نقدم مجموعة شاملة من الخدمات التقنية المتكاملة لتعزيز نمو أعمالك وتحقيق التميز الرقمي"
              : "We offer a comprehensive range of integrated technical services to enhance your business growth and achieve digital excellence"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          
          {services.map((service, index) => {
            const IconComponent = getIcon(service)
             return (
              <div
                key={service.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="h-48 md:h-40 lg:h-48 relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-700/10 group-hover:from-blue-500/20 group-hover:to-blue-700/20 transition-colors">
                  {service.image ? (
                   <img
                          src={service.image || "/placeholder.svg"}
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconComponent className="w-16 h-16 text-blue-500/30" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-blue-700 transition-all duration-300"
                    style={{ backgroundColor: `${service.color}15` }}
                  >
                    <IconComponent className="w-6 md:w-7 h-6 md:h-7 group-hover:text-white transition-colors" style={{ color: service.color }} />
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{t(service.name)}</h3>
                  <p className="text-muted-foreground text-sm md:text-base mb-4 flex-1">{t(service.description)}</p>

                  {/* Technology tags */}
                  <ul className="space-y-2 mb-4 text-xs md:text-sm">
                    {service.technology.slice(0, 3).map((tech, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: service.color }} />
                        {tech}
                      </li>
                    ))}
                  </ul>

                  {/* Price badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? "يبدأ من" : "Starting from"}
                    </span>
                    <span className="text-sm font-bold" style={{ color: service.color }}>
                      ${service.start_price}
                    </span>
                  </div>

                  <a href={`/services/${service.id}`} className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all text-sm md:text-base">
                    {isRTL ? "اعرف المزيد" : "Learn More"}
                    <ArrowLeft className={cn("w-4 h-4", !isRTL && "rotate-180")} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}