"use client"

import { useEffect, useRef, useState } from "react"
import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { getTestimonials } from "@/lib/home"
import { useLanguage } from "@/lib/i18n/language-context"

type LocalizedString = { ar: string; en: string }

type Testimonial = {
  id: number
  name: LocalizedString
  company: LocalizedString
  comment: LocalizedString
  rating: number
  avatar: string
  image: string | null
}

export function TestimonialsSection() {
  const [visible, setVisible] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const isRTL = language === "ar"
  const t = (field: LocalizedString) => field[language as keyof LocalizedString] || field.en

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    getTestimonials(3)
      .then((res: any) => res.success && setTestimonials(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">{isRTL ? "جاري التحميل..." : "Loading..."}</p>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="py-16 md:py-24 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-blue-600 font-semibold text-xs md:text-sm uppercase tracking-wider">
            {isRTL ? "آراء العملاء" : "Client Testimonials"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 text-balance">
            {isRTL ? "ماذا يقول عملاؤنا" : "What Our Clients Say"}
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            {isRTL
              ? "نفخر بثقة عملائنا وشراكتنا معهم في تحقيق أهدافهم"
              : "We take pride in our clients' trust and our partnership in achieving their goals"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "bg-card rounded-2xl p-6 md:p-8 border border-border relative transition-all duration-500",
              )}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <Quote className={cn("w-8 h-8 md:w-10 md:h-10 text-blue-500/20 absolute top-6", isRTL ? "right-6" : "left-6")} />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-blue-500 fill-blue-500" />
                ))}
              </div>

              <p className="text-foreground mb-6 relative z-10 text-sm md:text-base">{t(item.comment)}</p>

              <div className="flex items-center gap-3 md:gap-4">
                {item.image ? (
                  <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-full overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={t(item.name)} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm md:text-base">{item.avatar}</span>
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-foreground text-sm md:text-base">{t(item.name)}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">{t(item.company)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}