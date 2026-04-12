// 📄 app/solutions/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Search, Filter, Zap, Shield, TrendingUp, CheckCircle } from "lucide-react"
import { getSolutions } from "@/lib/services"
import { useLanguage } from "@/lib/i18n/language-context"
import { Skeleton } from "@/components/ui/skeleton"
import type { TechSolution } from "@/lib/services"

// Technology icons mapping
const techIconMap: Record<string, any> = {
  "Cloud Computing": Zap,
  "AI & ML": Shield,
  "Big Data": TrendingUp,
  "IoT": CheckCircle,
  "Blockchain": Shield,
}

export default function SolutionsPage() {
  const { t, language } = useLanguage()
  const [solutions, setSolutions] = useState<TechSolution[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTechnology, setSelectedTechnology] = useState<string>("all")
  const [filteredSolutions, setFilteredSolutions] = useState<TechSolution[]>([])
  const [technologies, setTechnologies] = useState<string[]>([])
  const isRTL = language === "ar"

  useEffect(() => {
    fetchSolutions()
  }, [])

  useEffect(() => {
    filterSolutions()
  }, [solutions, searchQuery, selectedTechnology, language])

  const fetchSolutions = async () => {
    try {
      const response = await getSolutions()
      if (response.success) {
        setSolutions(response.data)
        // Extract unique technologies
        const allTechs = new Set<string>()
        response.data.forEach((sol: TechSolution) => {
          sol.technologies?.forEach(tech => allTechs.add(tech))
        })
        setTechnologies(Array.from(allTechs))
      }
    } catch (error) {
      console.error("Error fetching solutions:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterSolutions = () => {
    let filtered = solutions

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(solution => {
        const solutionTitle = solution.title[language as keyof typeof solution.title] || solution.title.en || ""
        const solutionOverview = solution.overview[language as keyof typeof solution.overview] || solution.overview.en || ""
        return (
          solutionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          solutionOverview.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    // Filter by technology
    if (selectedTechnology !== "all") {
      filtered = filtered.filter(solution => 
        solution.technologies?.includes(selectedTechnology)
      )
    }

    setFilteredSolutions(filtered)
  }

  const getLocalizedText = (field: { ar?: string; en?: string } | undefined) => {
    if (!field) return ""
    return field[language as keyof typeof field] || field.en || field.ar || ""
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>

        {/* Hero Section */}
        <section dir={isRTL ? "rtl" : "ltr"} className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
          <div className="container mx-auto max-w-6xl">
            {/* <Link 
              href="/" 
              className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t("solutions.backToHome")}</span>
            </Link> */}
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {t("solutions.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
              {t("solutions.description")}
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section dir={isRTL ? "rtl" : "ltr"} className="py-8 px-4 md:px-6 bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
                <Input
                  type="text"
                  placeholder={t("solutions.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} h-12`}
                />
              </div>
              
              <div className="w-full md:w-64">
                <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
                  <SelectTrigger className={`h-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder={t("solutions.allTechnologies")} />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("solutions.allTechnologies")}</SelectItem>
                    {technologies.map(tech => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section dir={isRTL ? "rtl" : "ltr"} className="py-12 md:py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredSolutions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">{t("solutions.noSolutionsFound")}</h3>
                <p className="text-muted-foreground">{t("solutions.tryDifferentSearch")}</p>
              </div>
            ) : (
              <>
                <div className="mb-8 flex justify-between items-center">
                  <p className="text-muted-foreground">
                    {t("solutions.showing")} <span className="font-semibold">{filteredSolutions.length}</span> {t("solutions.solutionsCount")}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredSolutions.map((solution) => (
                    <Link key={solution.id} href={`/solutions/${solution.id}`}>
                      <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-500/50 cursor-pointer">
                        {/* Header */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                          <div className="text-white text-center p-6">
                            <Zap className="w-12 h-12 mx-auto mb-3" />
                            <h3 className="text-xl font-bold">
                              {getLocalizedText(solution.title)}
                            </h3>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>

                        <CardContent className="p-6">
                          {/* Technologies */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {solution.technologies?.slice(0, 3).map((tech, idx) => (
                              <span 
                                key={idx}
                                className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              >
                                {tech}
                              </span>
                            ))}
                            {solution.technologies && solution.technologies.length > 3 && (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                                +{solution.technologies.length - 3}
                              </span>
                            )}
                          </div>

                          <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-3">
                            {getLocalizedText(solution.overview)}
                          </p>

                          {/* Metrics */}
                          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b">
                            <div>
                              <p className="text-xs text-muted-foreground">{t("solutions.duration")}</p>
                              <p className="text-sm font-semibold">{getLocalizedText(solution.duration)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">{t("solutions.roi")}</p>
                              <p className="text-sm font-semibold text-green-600">{solution.roi}</p>
                            </div>
                          </div>

                          <Button className="w-full bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
                            {t("solutions.viewDetails")}
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section dir={isRTL ? "rtl" : "ltr"} className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/10 dark:to-background">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center text-balance">
              {t("solutions.whyChooseUs")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8 text-blue-600" />,
                  title: t("solutions.feature1Title"),
                  description: t("solutions.feature1Desc"),
                },
                {
                  icon: <Shield className="w-8 h-8 text-blue-600" />,
                  title: t("solutions.feature2Title"),
                  description: t("solutions.feature2Desc"),
                },
                {
                  icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
                  title: t("solutions.feature3Title"),
                  description: t("solutions.feature3Desc"),
                },
                {
                  icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
                  title: t("solutions.feature4Title"),
                  description: t("solutions.feature4Desc"),
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-xl p-6 border border-border text-center hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section dir={isRTL ? "rtl" : "ltr"} className="py-16 md:py-24 px-4 md:px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              {t("solutions.ctaTitle")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              {t("solutions.ctaDescription")}
            </p>
            <Link href="/contact-us">
              <Button className="bg-gradient-to-l from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all text-lg">
                {t("solutions.ctaButton")}
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}