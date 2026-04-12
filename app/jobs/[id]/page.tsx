// app/jobs/[id]/page.tsx
"use client"

import { useState, useEffect, use } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, MapPin, DollarSign, Clock, Users, Upload, CheckCircle2, Briefcase, Building2, GraduationCap, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { getJobOfferById, applyForJob } from "@/lib/services" 
import { Skeleton } from "@/components/ui/skeleton"

// Type definitions
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
  applications_count?: number
  category?: {
    id: number
    name: { ar: string; en: string }
    description: { ar: string; en: string }
  }
}

type JobApplicationFormData = {
  full_name: string
  email: string
  phone: string
  city: string
  years_of_experience: string
  current_job_title: string
  current_company: string
  expected_salary: string
  education_level: string
  cover_letter: string
  cv?: File
  attachments?: File[]
  skills?: string[]
  languages?: string[]
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

const educationLevels = {
  ar: {
    high_school: "ثانوية",
    diploma: "دبلوم",
    bachelor: "بكالوريوس",
    master: "ماجستير",
    phd: "دكتوراه",
  },
  en: {
    high_school: "High School",
    diploma: "Diploma",
    bachelor: "Bachelor's Degree",
    master: "Master's Degree",
    phd: "PhD",
  }
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, language } = useLanguage()
  const isRTL = language === "ar"
  
  const resolvedParams = use(params)
  const jobId = resolvedParams.id
  
  const [job, setJob] = useState<JobOffer | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState<JobApplicationFormData>({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    years_of_experience: "",
    current_job_title: "",
    current_company: "",
    expected_salary: "",
    education_level: "",
    cover_letter: "",
  })

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await getJobOfferById(parseInt(jobId))
      
      if (response.success && response.data) {
        const jobData = response.data.data || response.data
        setJob(jobData)
      } else {
        setError(response.message || 'Failed to load job details')
      }
    } catch (error: any) {
      setError(error?.message || 'Failed to load job details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files.length > 0) {
      if (name === "cv") {
        setFormData((prev) => ({
          ...prev,
          cv: files[0],
        }))
      } else if (name === "attachments") {
        setFormData((prev) => ({
          ...prev,
          attachments: Array.from(files),
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await applyForJob(parseInt(jobId), formData)
      
      if (response.success) {
        setSubmitted(true)
        setTimeout(() => {
          setFormData({
            full_name: "",
            email: "",
            phone: "",
            city: "",
            years_of_experience: "",
            current_job_title: "",
            current_company: "",
            expected_salary: "",
            education_level: "",
            cover_letter: "",
          })
          setSubmitted(false)
        }, 5000)
      } else {
        setError(response.message || t("jobs.applicationError"))
      }
    } catch (error: any) {
      setError(error?.message || t("jobs.applicationError"))
    } finally {
      setSubmitting(false)
    }
  }

  const getLocalizedText = (field: { ar: string; en: string } | undefined) => {
    if (!field) return ""
    return field[language as keyof typeof field] || field.en || field.ar || ""
  }

  const getJobType = (type: string) => {
    return jobTypeMap[language as keyof typeof jobTypeMap]?.[type as keyof typeof jobTypeMap.ar] || type
  }

  const getEducationLevel = (level: string) => {
    return educationLevels[language as keyof typeof educationLevels]?.[level as keyof typeof educationLevels.ar] || level
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950" dir={isRTL ? "rtl" : "ltr"}>
          <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6">
            <div className="container mx-auto max-w-7xl">
              <Skeleton className="h-8 w-32 mb-8" />
              <Skeleton className="h-16 w-3/4 mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    )
  }

  if (!job || error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950" dir={isRTL ? "rtl" : "ltr"}>
          <div className="pt-32 pb-12 px-4 md:px-6">
            <div className="container mx-auto max-w-2xl text-center">
              <div className="text-8xl mb-6 animate-bounce">😕</div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {error || t("jobs.jobNotFound")}
              </h1>
              <p className="text-muted-foreground mb-8">
                {t("jobs.jobNotFoundDescription")}
              </p>
              <Link href="/jobs">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40">
                  {t("jobs.backToJobs")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950" dir={isRTL ? "rtl" : "ltr"}>
        {/* Hero Header */}
        <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <Link 
              href="/jobs" 
              className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-8 transition-colors group ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-5 h-5 transition-transform group-hover:-translate-x-1 ${isRTL ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
              <span className="font-medium">{t("jobs.backToJobs")}</span>
            </Link>

            {/* Category Badge */}
            {job.category && (
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  <Briefcase className="w-4 h-4" />
                  {getLocalizedText(job.category.name)}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8 text-balance bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              {getLocalizedText(job.title)}
            </h1>

            {/* Job Meta Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-xl hover:shadow-slate-200/70 dark:hover:shadow-slate-900/70 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{t("jobs.jobType")}</p>
                </div>
                <p className="text-xl font-bold text-foreground">{getJobType(job.type)}</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-xl hover:shadow-slate-200/70 dark:hover:shadow-slate-900/70 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{t("jobs.location")}</p>
                </div>
                <p className="text-xl font-bold text-foreground">{getLocalizedText(job.location)}</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-xl hover:shadow-slate-200/70 dark:hover:shadow-slate-900/70 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{t("jobs.salary")}</p>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {parseFloat(job.salary_min).toLocaleString()} - {parseFloat(job.salary_max).toLocaleString()}
                </p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-xl hover:shadow-slate-200/70 dark:hover:shadow-slate-900/70 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{t("jobs.deadline")}</p>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {new Date(job.deadline).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
              {/* Job Details Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description Card */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      {t("jobs.aboutJob")}
                    </h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {getLocalizedText(job.description)}
                  </p>
                </div>

                {/* Requirements Card */}
                {job.requirements && (
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        {t("jobs.requirements")}
                      </h2>
                    </div>
                    <ul className="space-y-4">
                      {(job.requirements[language as keyof typeof job.requirements] || job.requirements.en || []).map((req, idx) => (
                        <li key={idx} className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mt-1">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-muted-foreground text-lg leading-relaxed flex-1">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Application Stats Card */}
                {job.applications_count !== undefined && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <p className="text-lg text-foreground">
                        <span className="font-semibold">{job.applications_count}</span> {t("jobs.applicationsCount")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Application Form Column */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-2xl shadow-slate-300/50 dark:shadow-slate-900/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/30">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {t("jobs.submitApplication")}
                    </h2>
                  </div>

                  {submitted && (
                    <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{t("jobs.applicationSuccess")}</span>
                    </div>
                  )}

                  {error && !submitted && (
                    <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-500">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t("jobs.form.fullName")} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder={t("jobs.form.fullNamePlaceholder")}
                        required
                        className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t("jobs.form.email")} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t("jobs.form.emailPlaceholder")}
                        required
                        className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t("jobs.form.phone")} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t("jobs.form.phonePlaceholder")}
                        required
                        className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          {t("jobs.form.city")}
                        </label>
                        <Input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder={t("jobs.form.cityPlaceholder")}
                          className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          {t("jobs.form.experience")}
                        </label>
                        <Input
                          type="number"
                          name="years_of_experience"
                          value={formData.years_of_experience}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t("jobs.form.currentJobTitle")}
                      </label>
                      <Input
                        type="text"
                        name="current_job_title"
                        value={formData.current_job_title}
                        onChange={handleInputChange}
                        placeholder={t("jobs.form.currentJobTitlePlaceholder")}
                        className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t("jobs.form.currentCompany")}
                      </label>
                      <Input
                        type="text"
                        name="current_company"
                        value={formData.current_company}
                        onChange={handleInputChange}
                        placeholder={t("jobs.form.currentCompanyPlaceholder")}
                        className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t("jobs.form.expectedSalary")}
                      </label>
                      <Input
                        type="number"
                        name="expected_salary"
                        value={formData.expected_salary}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t("jobs.form.educationLevel")}
                      </label>
                      <select
                        name="education_level"
                        value={formData.education_level}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-background text-foreground focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      >
                        <option value="">{t("jobs.form.selectEducation")}</option>
                        <option value="high_school">{getEducationLevel("high_school")}</option>
                        <option value="diploma">{getEducationLevel("diploma")}</option>
                        <option value="bachelor">{getEducationLevel("bachelor")}</option>
                        <option value="master">{getEducationLevel("master")}</option>
                        <option value="phd">{getEducationLevel("phd")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t("jobs.form.cv")}
                      </label>
                      <div className="relative">
                        <Input
                          type="file"
                          name="cv"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 file:font-medium hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t("jobs.form.coverLetter")}
                      </label>
                      <Textarea
                        name="cover_letter"
                        value={formData.cover_letter}
                        onChange={handleInputChange}
                        placeholder={t("jobs.form.coverLetterPlaceholder")}
                        rows={5}
                        className="w-full rounded-xl border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t("jobs.form.submitting")}
                        </span>
                      ) : (
                        t("jobs.form.submit")
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}