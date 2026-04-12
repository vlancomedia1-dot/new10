// 📄 app/who-we-are/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Target, Lightbulb, Award } from "lucide-react"
import { getAboutUsAll } from "@/lib/services"
import { useLanguage } from "@/lib/i18n/language-context"

interface AboutUsItem {
  title?: string
  subtitle?: string | null
  description?: string | null
  icon?: string | null
  image?: string | null
  value?: string | null
  unit?: string | null
  link?: string | null
}

interface AboutUsSection {
  key: string
  title: string
  subtitle?: string | null
  description?: string | null
  items: AboutUsItem[]
}

export default function WhoWeArePage() {
  const { t, language } = useLanguage()
  const [sections, setSections] = useState<AboutUsSection[]>([])
  const [loading, setLoading] = useState(true)
  const isRTL = language === "ar"

  useEffect(() => {
    fetchAboutUsData()
  }, [language])

  const fetchAboutUsData = async () => {
    try {
      setLoading(true)
      const response = await getAboutUsAll(language)
      if (response.success) {
        setSections(response.data)
      }
    } catch (error) {
      console.error("Error fetching about us data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSection = (key: string) => {
    return sections.find(section => section.key === key)
  }

  const stats = getSection("company-stats")
  const aboutUs = getSection("about-us")
  const ourStory = getSection("our-story")
  const visionValues = getSection("vision-values")
  const team = getSection("team")

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <Skeleton className="h-12 w-48 mb-6" />
            <Skeleton className="h-16 w-3/4 mb-4" />
            <Skeleton className="h-6 w-2/3 mb-12" />
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto max-w-6xl">
          <Link 
            href="/" 
            className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t("whoWeAre.backToHome")}</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {aboutUs?.title || t("whoWeAre.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
            {aboutUs?.subtitle || t("whoWeAre.subtitle")}
          </p>
        </div>
      </section>

      {/* About Story */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {ourStory?.title || t("whoWeAre.ourStory")}
              </h2>
              {ourStory?.description && (
                <div className="space-y-4">
                  {ourStory.description.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="text-muted-foreground leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/placeholder.svg?height=600&width=600" 
                alt={ourStory?.title || "فريقنا"} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Mission Values */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-card border-y border-border">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            {visionValues?.title || t("whoWeAre.visionAndValues")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {visionValues?.items?.map((item, idx) => {
              const iconMap = [
                { Icon: Target, colors: "from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600" },
                { Icon: Lightbulb, colors: "from-green-50 to-green-100/50 dark:from-green-950/40 dark:to-green-900/20 border-green-200 dark:border-green-800 text-green-600" },
                { Icon: Award, colors: "from-purple-50 to-purple-100/50 dark:from-purple-950/40 dark:to-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-600" },
              ]
              const { Icon, colors } = iconMap[idx] || iconMap[0]

              return (
                <div 
                  key={idx} 
                  className={`bg-gradient-to-br ${colors} rounded-xl p-8 border`}
                >
                  <Icon className={`w-12 h-12 ${colors.split(' ').pop()} mb-4`} />
                  <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats?.items && (
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-6 md:gap-8">
              {stats.items.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                    {stat.value}{stat.unit}
                  </div>
                  <p className="text-muted-foreground">{stat.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

  

      {/* CTA */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
            {t("whoWeAre.ctaTitle")}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t("whoWeAre.ctaDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-us">
              <Button className="bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg h-12 px-8">
                {t("whoWeAre.contactUs")}
              </Button>
            </Link>
            <Link href="/services">
              <Button
                variant="outline"
                className="rounded-lg h-12 px-8 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 bg-transparent"
              >
                {t("whoWeAre.exploreServices")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}