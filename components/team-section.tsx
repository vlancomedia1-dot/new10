"use client"

import { useEffect, useRef, useState } from "react"
import { Linkedin, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { getTeam } from "@/lib/home"
import { useLanguage } from "@/lib/i18n/language-context"

type LocalizedString = { ar: string; en: string }

type TeamMember = {
  id: number
  name: LocalizedString
  position: LocalizedString
  description: LocalizedString
  image: string | null
}

const gradients = [
  "from-blue-500 to-blue-700",
  "from-sky-500 to-cyan-500",
  "from-indigo-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
]

export function TeamSection() {
  const [visible, setVisible] = useState(false)
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const isRTL = language === "ar"
  const t = (field: LocalizedString) => {
    if (!field) return ""
    return field[language as keyof LocalizedString] || field.en || ""
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    getTeam(4)
      .then((res: any) => {
        if (res && res.success && Array.isArray(res.data)) {
          setTeam(res.data)
        } else {
          setTeam([])
        }
      })
      .catch((error) => {
        console.error("Error fetching team:", error)
        setTeam([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Don't render section if loading is done and there's no team data
  if (!loading && (!team || team.length === 0)) {
    return null
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">{isRTL ? "جاري التحميل..." : "Loading..."}</p>
        </div>
      </section>
    )
  }

  return (
    <>
    <section id="team" ref={ref} className="py-16 md:py-24 bg-muted/50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-blue-600 font-semibold text-xs md:text-sm uppercase tracking-wider">
            {isRTL ? "فريقنا" : "Our Team"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 text-balance">
            {isRTL ? "فريق من الخبراء المبدعين" : "A Team of Creative Experts"}
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            {isRTL
              ? "خبراء ومطورون مبدعون يجمعون بين الخبرة التقنية والفهم الاستراتيجي"
              : "Expert and creative developers combining technical expertise with strategic understanding"}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {team.map((member, idx) => {
            const gradient = gradients[idx % gradients.length]
            return (
              <div
                key={member.id}
                className={cn(
                  "group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-500",
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Avatar Area */}
                <div className={`h-40 md:h-48 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                  {member.image ? (
                    <img src={member.image} alt={t(member.name)} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Hover Overlay with Social Links */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 md:gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href="#"
                      className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </a>
                    <a
                      href="#"
                      className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 text-center">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">{t(member.name)}</h3>
                  <p className="text-blue-600 font-medium mb-2 md:mb-3 text-sm md:text-base">{t(member.position)}</p>
                  <p className="text-muted-foreground text-xs md:text-sm">{t(member.description)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
    </>

  )
}