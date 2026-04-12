// app/jobs/page.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Search, MapPin, DollarSign, Clock } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { getJobCategories, getJobOffers } from "@/lib/services"
import { Skeleton } from "@/components/ui/skeleton"

// Type definitions
type JobCategory = {
  id: number
  name: { ar: string; en: string }
  description: { ar: string; en: string }
  slug: string
}

type JobOffer = {
  id: number
  job_category_id: number
  title: { ar: string; en: string }
  description: { ar: string; en: string }
  requirements: { ar: string[]; en: string[] }
  location: { ar: string; en: string }
  type: "full_time" | "part_time" | "remote" | "contract"
  salary_min: string
  salary_max: string
  deadline: string
  is_active: number
  category?: JobCategory
}

// Job type mapping
const jobTypeMap = {
  ar: {
    full_time: "بدوام كامل",
    part_time: "بدوام جزئي",
    remote: "عن بعد",
    contract: "عقد محدد الأجل",
  },
  en: {
    full_time: "Full Time",
    part_time: "Part Time",
    remote: "Remote",
    contract: "Contract",
  }
}

export default function JobsPage() {
  const { t, language } = useLanguage()
  const isRTL = language === "ar"
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [loading, setLoading] = useState(true)
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([])
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, offersRes] = await Promise.all([
        getJobCategories(),
        getJobOffers()
      ])
      
      if (categoriesRes.success) {
        setJobCategories(categoriesRes.data.data || categoriesRes.data)
      }
      
      if (offersRes.success) {
        setJobOffers(offersRes.data.data || offersRes.data)
      }
    } catch (error) {
      console.error("Error fetching jobs data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobOffers.filter((job) => {
      const jobTitle = job.title
      const jobDesc = job.description
      const jobLocation = job.location
   
      const matchesCategory = !selectedCategory || job.job_category_id.toString() === selectedCategory
      const matchesType = !selectedType || job.type === selectedType

      return  matchesCategory && matchesType
    })
  }, [searchTerm, selectedCategory, selectedType, jobOffers])

  const getLocalizedText = (field: { ar: string; en: string } | undefined) => {
    if (!field) return ""
    return field[language as keyof typeof field] || field.en || field.ar || ""
  }

  const getCategoryName = (categoryId: number) => {
    const category = jobCategories.find((c) => c.id === categoryId)
    return category ? getLocalizedText(category.name) : t("jobs.uncategorized")
  }

  const getJobType = (type: string) => {
    return jobTypeMap[language as keyof typeof jobTypeMap]?.[type as keyof typeof jobTypeMap.ar] || type
  }

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
              <span>{t("jobs.backToHome")}</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {t("jobs.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
              {t("jobs.description")}
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 md:py-12 px-4 md:px-6 border-b border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="space-y-4 md:space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-muted-foreground`} />
                <Input
                  type="text"
                  placeholder={t("jobs.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} py-2 md:py-3 text-base md:text-lg rounded-lg`}
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Category Filter */}
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t("jobs.category")}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 md:py-3 border border-border rounded-lg bg-card text-foreground"
                  >
                    <option value="">{t("jobs.allCategories")}</option>
                    {jobCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {getLocalizedText(cat.name)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Type Filter */}
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t("jobs.jobType")}
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 md:py-3 border border-border rounded-lg bg-card text-foreground"
                  >
                    <option value="">{t("jobs.allTypes")}</option>
                    <option value="full_time">{getJobType("full_time")}</option>
                    <option value="part_time">{getJobType("part_time")}</option>
                    <option value="remote">{getJobType("remote")}</option>
                    <option value="contract">{getJobType("contract")}</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <p className="text-sm text-muted-foreground">
                {t("jobs.foundResults")} <span className="font-semibold text-foreground">{filteredJobs.length}</span> {t("jobs.jobs")}
              </p>
            </div>
          </div>
        </section>

        {/* Jobs List */}
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <div className="space-y-4 md:space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-6 md:p-8">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-8 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="space-y-4 md:space-y-6">
                {filteredJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <div className="group bg-card border border-border rounded-xl p-6 md:p-8 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer mt-5">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
                        {/* Job Info */}
                        <div className="flex-1">
                          <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs md:text-sm font-semibold px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                              {getCategoryName(job.job_category_id)}
                            </span>
                            <span className="text-xs md:text-sm font-semibold px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                              {getJobType(job.type)}
                            </span>
                          </div>

                          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors">
                            {getLocalizedText(job.title)}
                          </h3>
                          <p className="text-sm md:text-base text-muted-foreground mb-4">
                            {getLocalizedText(job.description)}
                          </p>

                          {/* Meta Info */}
                          <div className={`flex flex-wrap gap-4 md:gap-6 text-sm md:text-base text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <span>{getLocalizedText(job.location)}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span>
                                {parseFloat(job.salary_min).toLocaleString()} - {parseFloat(job.salary_max).toLocaleString()} {t("jobs.currency")}
                              </span>
                            </div>
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Clock className="w-4 h-4 text-orange-600" />
                              <span>{t("jobs.deadline")}: {new Date(job.deadline).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Apply Button */}
                        <div className="flex md:justify-end">
                          <Button className="w-full md:w-auto bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
                            {t("jobs.viewDetailsAndApply")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  {t("jobs.noJobsFound")}
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("")
                    setSelectedType("")
                  }}
                  className="bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg"
                >
                  {t("jobs.resetFilters")}
                </Button>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}