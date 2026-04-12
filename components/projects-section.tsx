"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { getProjects } from "@/lib/home"
import { useLanguage } from "@/lib/i18n/language-context"

type LocalizedString = {
  ar: string
  en: string
  ru?: string
}

type Project = {
  id: number
  title: LocalizedString
  short_description: LocalizedString
  category: LocalizedString
  duration: string
  budget: string
  team: string
  client: string
  main_image: string
  technologies: string[]
}

type ProjectsResponse = {
  success: boolean
  data: Project[]
}

export function ProjectsSection() {
  const [visible, setVisible] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
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
    getProjects(6)
      .then((response: ProjectsResponse) => {
        if (response.success) {
          setProjects(response.data)
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

  // Gradient colors for projects
  const gradients = [
    "from-blue-500 via-blue-600 to-blue-700",
    "from-indigo-500 via-purple-500 to-violet-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-rose-500 via-pink-500 to-fuchsia-500",
    "from-sky-500 via-blue-500 to-indigo-500",
    "from-cyan-500 via-teal-500 to-emerald-500",
  ]

  if (loading) {
    return (
      <section id="projects" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" ref={ref} className="py-16 md:py-24 bg-muted/50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-blue-600 font-semibold text-xs md:text-sm uppercase tracking-wider">
            {isRTL ? "أعمالنا" : "Our Work"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 text-balance">
            {isRTL ? "مشاريعنا الناجحة" : "Our Successful Projects"}
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            {isRTL
              ? "تعرف على أبرز المشاريع التي نفخر بتنفيذها لعملائنا"
              : "Discover the most prominent projects we are proud to have implemented for our clients"}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, index) => {
            const gradient = gradients[index % gradients.length]
            
            return (
              <div
                key={project.id}
                className={cn(
                  "group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-500 cursor-pointer",
                  
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image Area */}
                <div className="h-48 md:h-52 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {project.main_image ? (
                    <>
                       <img
                          src={project.main_image || "/placeholder.svg"}
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </>
                  ) : (
                    <div className={`h-full bg-gradient-to-br ${gradient}`} />
                  )}
                  
                  {/* Overlay Icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110" />
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
                      {t(project.category)}
                    </span>
                  </div>

                  {/* Technology Tags */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 flex-wrap">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                 <a href={`/projects/${project.id}`}>
                     {t(project.title)}
                 </a>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {t(project.short_description)}
                  </p>
                  
                  {/* Project Info */}
                  <div className="space-y-2 mb-4 text-xs md:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {isRTL ? "المدة" : "Duration"}
                      </span>
                      <span className="text-foreground font-semibold">{project.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {isRTL ? "الفريق" : "Team"}
                      </span>
                      <span className="text-foreground font-semibold">{project.team}</span>
                    </div>
                  </div>

                  {/* Client */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? "العميل:" : "Client:"}{" "}
                      <span className="text-blue-600 font-semibold">{project.client}</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <a href="/projects"
            variant="outline"
            size="lg"
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white rounded-full px-8 bg-transparent"
          >
            {isRTL ? "عرض جميع المشاريع" : "View All Projects"}
          </a>
        </div>
      </div>
    </section>
  )
}