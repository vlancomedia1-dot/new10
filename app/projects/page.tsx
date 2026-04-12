// 📄 app/projects/page.tsx (Complete with API Integration)
"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Search, Filter, Calendar, DollarSign } from "lucide-react"
import { getProjects, filterProjects } from "@/lib/services"
import { useLanguage } from "@/lib/i18n/language-context"
import { Skeleton } from "@/components/ui/skeleton"
import type { TechProject } from "@/lib/services"

export default function ProjectsPage() {
  const { t, language } = useLanguage()
  const isRTL = language === "ar"
  
  const [projects, setProjects] = useState<TechProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  
  // Extract unique categories and years from projects
  const [categories, setCategories] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await getProjects()
      
      if (response.success && response.data) {
        setProjects(response.data)
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(
            response.data
              .map((p: TechProject) => getLocalizedText(p.category))
              .filter(Boolean)
          )
        )
        setCategories(uniqueCategories as string[])
        
        // Extract unique years from created_at
        const uniqueYears = Array.from(
          new Set(
            response.data
              .map((p: TechProject) => new Date(p.created_at).getFullYear().toString())
              .filter(Boolean)
          )
        ).sort((a, b) => Number(b) - Number(a))
        setYears(uniqueYears as string[])
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async () => {
    try {
      setLoading(true)
      
      const params: any = {}
      if (selectedCategory !== "all") params.category = selectedCategory
      if (selectedYear !== "all") params.year = Number(selectedYear)
      
      const response = await filterProjects(params)
      
      if (response.success && response.data) {
        setProjects(response.data)
      }
    } catch (error) {
      console.error("Error filtering projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedYear("all")
    fetchProjects()
  }

  const getLocalizedText = (field: any): string => {
    if (!field) return ""
    
    if (typeof field === 'object' && !Array.isArray(field)) {
      return field[language as keyof typeof field] || field.en || field.ar || ""
    }
    
    return String(field)
  }

  // Filter projects by search term (client-side)
  const filteredProjects = projects.filter(project => {
    if (!searchTerm) return true
    
    const title = getLocalizedText(project.title).toLowerCase()
    const description = getLocalizedText(project.short_description).toLowerCase()
    const client = (project.client || "").toLowerCase()
    const search = searchTerm.toLowerCase()
    
    return title.includes(search) || description.includes(search) || client.includes(search)
  })

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        {/* Hero Section */}
        <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
          <div className="container mx-auto max-w-6xl">
            <Link 
              href="/" 
              className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t("projects.backToHome") || "Back to Home"}</span>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {t("projects.title") || "Our Successful Projects"}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
              {t("projects.subtitle") || "Explore our portfolio of amazing projects that achieved exceptional results for our clients"}
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 px-4 md:px-6 bg-card border-b border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    type="text"
                    placeholder={t("projects.searchPlaceholder") || "Search projects..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${isRTL ? 'pr-10' : 'pl-10'} h-11`}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px] h-11">
                  <SelectValue placeholder={t("projects.category") || "Category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("projects.allCategories") || "All Categories"}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Filter */}
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full md:w-[150px] h-11">
                  <SelectValue placeholder={t("projects.year") || "Year"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("projects.allYears") || "All Years"}</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleFilter}
                  className="bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {t("projects.filter") || "Filter"}
                </Button>
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="rounded-lg"
                >
                  {t("projects.reset") || "Reset"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-56 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-4" />
                      <div className="space-y-3 pt-4 border-t border-border">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <Skeleton className="h-10 w-full mt-4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl font-bold text-muted-foreground mb-4">
                  {t("projects.noProjects") || "No projects found"}
                </p>
                <p className="text-muted-foreground mb-6">
                  {t("projects.tryDifferentFilters") || "Try adjusting your filters or search term"}
                </p>
                <Button onClick={handleReset} variant="outline">
                  {t("projects.clearFilters") || "Clear Filters"}
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProjects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <Card className="group h-full overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-blue-500/50 cursor-pointer">
                      {/* Image */}
                      <div className="relative h-48 md:h-56 overflow-hidden bg-muted">
                        <img
                          src={project.main_image || "/placeholder.svg"}
                          alt={getLocalizedText(project.title)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                          <span className="px-3 py-1.5 bg-blue-600 text-white text-xs md:text-sm rounded-full font-medium">
                            {getLocalizedText(project.category)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {getLocalizedText(project.title)}
                        </h3>
                        <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-2">
                          {getLocalizedText(project.short_description)}
                        </p>

                        <div className="space-y-3 mb-4 pt-4 border-t border-border">
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs text-muted-foreground">
                              {t("projects.client") || "Client"}:
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {project.client}
                            </span>
                          </div>
                          
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {project.duration}
                            </span>
                          </div>
                          
                          {project.budget && (
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <DollarSign className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-600">
                                {project.budget}
                              </span>
                            </div>
                          )}
                        </div>

                        <Button className="w-full bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
                          {t("projects.viewProject") || "View Project"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}