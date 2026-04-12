// 📄 app/projects/[id]/page.tsx (Refactored & Reorganized)
"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"

// Components
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// Icons
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  DollarSign,
  Users,
  Quote,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react"

// Services & Context
import { getProjectById, applyForProject, type TechProject } from "@/lib/services"
import { useLanguage } from "@/lib/i18n/language-context"

// ============================================================================
// SCHEMA & TYPES
// ============================================================================

const projectApplicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  expect_mony: z.number().min(0, "Budget must be a positive number").optional(),
})

type ApplicationFormData = z.infer<typeof projectApplicationSchema>

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { t, language } = useLanguage()
  const isRTL = language === "ar"

  // State Management
  const [project, setProject] = useState<TechProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showGallery, setShowGallery] = useState(false)

  // Form Setup
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(projectApplicationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      expect_mony: undefined,
    },
  })

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await getProjectById(Number(id))
        
        if (response.success && response.data) {
          setProject(response.data)
        } else {
          setError("Project not found")
          router.push("/projects")
        }
      } catch (err: any) {
        console.error("Error fetching project:", err)
        setError(err.message || "Failed to load project")
        router.push("/projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id, router])

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const onSubmit = async (data: ApplicationFormData) => {
    if (!project) return

    setIsSubmitting(true)
    try {
      const response = await applyForProject(project.id, {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        expect_mony: data.expect_mony || undefined,
      })

      if (response.success) {
        alert(t("projectDetail.applicationSuccess") || "Application submitted successfully!")
        setApplyDialogOpen(false)
        form.reset()
      } else {
        alert(t("projectDetail.applicationFailed") || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      alert(t("projectDetail.applicationFailed") || "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageClick = (image: string) => {
    setSelectedImage(image)
    setShowGallery(true)
  }

  const handleCloseDialog = () => {
    setApplyDialogOpen(false)
    form.reset()
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  const getLocalizedText = (field: any): string => {
    if (!field) return ""
    
    if (typeof field === 'object' && !Array.isArray(field)) {
      return field[language as keyof typeof field] || field.en || field.ar || ""
    }
    
    return String(field)
  }

  const getResults = (): any[] => {
    if (!project?.results) return []
    
    if (Array.isArray(project.results)) {
      return project.results
    }
    
    if (typeof project.results === 'string') {
      try {
        const parsed = JSON.parse(project.results)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return [project.results]
      }
    }
    
    return []
  }

  // ============================================================================
  // RENDER CONDITIONS
  // ============================================================================

  if (loading) {
    return <LoadingState />
  }

  if (error || !project) {
    return <ErrorState error={error} t={t} />
  }

  const results = getResults()

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        {/* Breadcrumb Section */}
        <BreadcrumbSection isRTL={isRTL} t={t} />

        {/* Hero Image Section */}
        <HeroSection 
          project={project}
          getLocalizedText={getLocalizedText}
          isRTL={isRTL}
        />

        {/* Main Content Section */}
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {/* Left Column - Main Content */}
              <div className="md:col-span-2 space-y-12">
                <TitleSection 
                  project={project}
                  getLocalizedText={getLocalizedText}
                />
                
                <OverviewSection 
                  project={project}
                  getLocalizedText={getLocalizedText}
                  t={t}
                />
                
                <ChallengeSolutionSection 
                  project={project}
                  getLocalizedText={getLocalizedText}
                  t={t}
                />
                
                <ResultsSection 
                  results={results}
                  getLocalizedText={getLocalizedText}
                  isRTL={isRTL}
                  t={t}
                />
                
                <TechnologiesSection 
                  project={project}
                  t={t}
                />
                
                <GallerySection 
                  project={project}
                  onImageClick={handleImageClick}
                  t={t}
                />
                
                <VideoSection 
                  project={project}
                  t={t}
                />
                
                <TestimonialSection 
                  project={project}
                  getLocalizedText={getLocalizedText}
                />
              </div>

              {/* Right Column - Sidebar */}
              <aside className="md:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <ProjectInfoCard 
                    project={project}
                    isRTL={isRTL}
                    t={t}
                  />
                  
                  <QuickActionsCard 
                    onApply={() => setApplyDialogOpen(true)}
                    t={t}
                  />
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Application Dialog */}
        <ApplicationDialog
          open={applyDialogOpen}
          onOpenChange={setApplyDialogOpen}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          project={project}
          getLocalizedText={getLocalizedText}
          isRTL={isRTL}
          onClose={handleCloseDialog}
          t={t}
        />

        {/* Gallery Modal */}
        <GalleryModal
          open={showGallery}
          onOpenChange={setShowGallery}
          selectedImage={selectedImage}
        />
      </main>

      <Footer />
    </>
  )
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 md:px-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-96 w-full rounded-xl mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <div className="grid md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
      <Footer />
    </div>
  )
}

function ErrorState({ error, t }: { error: string | null; t: any }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">
            {t("projectDetail.projectNotFound") || "Project Not Found"}
          </h1>
          <Link href="/projects">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
              {t("projectDetail.backToProjects") || "Back to Projects"}
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function BreadcrumbSection({ isRTL, t }: { isRTL: boolean; t: any }) {
  return (
    <section className="pt-24 md:pt-32 px-4 md:px-6 bg-gradient-to-br from-blue-50 via-white to-background dark:from-blue-950/20 dark:via-background dark:to-background">
      <div className="container mx-auto max-w-6xl pb-6">
        <Link 
          href="/projects" 
          className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="font-medium">{t("projectDetail.backToProjects") || "Back to Projects"}</span>
        </Link>
      </div>
    </section>
  )
}

function HeroSection({ 
  project, 
  getLocalizedText, 
  isRTL 
}: { 
  project: TechProject
  getLocalizedText: (field: any) => string
  isRTL: boolean 
}) {
  return (
    <section className="px-4 md:px-6 -mt-6">
      <div className="container mx-auto max-w-6xl">
        <div className="relative h-96 md:h-[32rem] rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src={project.main_image || "/placeholder.svg"} 
            alt={getLocalizedText(project.title)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'}`}>
            <span className="inline-flex px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-lg">
              {getLocalizedText(project.category)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function TitleSection({ 
  project, 
  getLocalizedText 
}: { 
  project: TechProject
  getLocalizedText: (field: any) => string 
}) {
  return (
    <div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
        {getLocalizedText(project.title)}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
        {getLocalizedText(project.short_description)}
      </p>
    </div>
  )
}

function OverviewSection({ 
  project, 
  getLocalizedText, 
  t 
}: { 
  project: TechProject
  getLocalizedText: (field: any) => string
  t: any 
}) {
  if (!project.overview) return null

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        {t("projectDetail.overview") || "Overview"}
      </h2>
      <p className="text-muted-foreground leading-relaxed text-lg">
        {getLocalizedText(project.overview)}
      </p>
    </div>
  )
}

function ChallengeSolutionSection({ 
  project, 
  getLocalizedText, 
  t 
}: { 
  project: TechProject
  getLocalizedText: (field: any) => string
  t: any 
}) {
  if (!project.challenge && !project.solution) return null

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        {t("projectDetail.challengeAndSolution") || "Challenge & Solution"}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {project.challenge && (
          <Card className="border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-950/10">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-red-900 dark:text-red-100">
                {t("projectDetail.challenge") || "Challenge"}
              </h3>
              <p className="text-red-800 dark:text-red-200 leading-relaxed">
                {getLocalizedText(project.challenge)}
              </p>
            </CardContent>
          </Card>
        )}
        
        {project.solution && (
          <Card className="border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-950/10">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-green-900 dark:text-green-100">
                {t("projectDetail.solution") || "Solution"}
              </h3>
              <p className="text-green-800 dark:text-green-200 leading-relaxed">
                {getLocalizedText(project.solution)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function ResultsSection({ 
  results, 
  getLocalizedText, 
  isRTL, 
  t 
}: { 
  results: any[]
  getLocalizedText: (field: any) => string
  isRTL: boolean
  t: any 
}) {
  if (results.length === 0) return null

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        {t("projectDetail.results") || "Results Achieved"}
      </h2>
      <div className="space-y-4"  dir="rtl">
        {results.map((result: any, idx: number) => (
          <div 
            key={idx} 
             dir="rtl"
            className={`flex gap-4 items-start ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground text-lg leading-relaxed">
              {typeof result === 'object' ? getLocalizedText(result) : result}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TechnologiesSection({ 
  project, 
  t 
}: { 
  project: TechProject
  t: any 
}) {
  if (!project.technologies || project.technologies.length === 0) return null

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        {t("projectDetail.technologies") || "Technologies Used"}
      </h2>
      <div className="flex flex-wrap gap-3">
        {project.technologies.map((tech, idx) => (
          <span
            key={idx}
            className="inline-flex px-4 py-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

function GallerySection({ 
  project, 
  onImageClick, 
  t 
}: { 
  project: TechProject
  onImageClick: (image: string) => void
  t: any 
}) {
  if (!project.gallery || project.gallery.length === 0) return null

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        {t("projectDetail.gallery") || "Project Gallery"}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {project.gallery.map((image, idx) => (
          <button
            key={idx}
            type="button"
            className="relative aspect-video rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => onImageClick(image)}
          >
            <img
              src={image}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function VideoSection({ 
  project, 
  t 
}: { 
  project: TechProject
  t: any 
}) {
  if (!project.video_url) return null

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        {t("projectDetail.video") || "Project Video"}
      </h2>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted shadow-lg">
        <iframe
          src={project.video_url}
          className="w-full h-full"
          allowFullScreen
          title="Project Video"
        />
      </div>
    </div>
  )
}

function TestimonialSection({ 
  project, 
  getLocalizedText 
}: { 
  project: TechProject
  getLocalizedText: (field: any) => string 
}) {
  if (!project.testimonial) return null

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-50 dark:from-blue-950/40 dark:via-blue-900/20 dark:to-blue-950/40">
      <CardContent className="p-8 md:p-10">
        <Quote className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-6" />
        <p className="text-lg md:text-xl text-foreground mb-6 italic leading-relaxed">
          "{getLocalizedText(project.testimonial)}"
        </p>
        <p className="text-sm font-semibold text-muted-foreground">
          — {project.client}
        </p>
      </CardContent>
    </Card>
  )
}

function ProjectInfoCard({ 
  project, 
  isRTL, 
  t 
}: { 
  project: TechProject
  isRTL: boolean
  t: any 
}) {
  const InfoItem = ({ 
    icon: Icon, 
    label, 
    value, 
    valueClassName = "" 
  }: { 
    icon: any
    label: string
    value: string
    valueClassName?: string 
  }) => (
    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className={`font-semibold ${valueClassName}`}>{value}</p>
      </div>
    </div>
  )

  return (
    <Card className="border-border shadow-lg">
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-6 pb-3 border-b">
          {t("projectDetail.projectInfo") || "Project Information"}
        </h3>
        
        <div className="space-y-5">
          <InfoItem
            icon={Users}
            label={t("projectDetail.client") || "Client"}
            value={project.client}
          />
          
          <InfoItem
            icon={Calendar}
            label={t("projectDetail.duration") || "Duration"}
            value={project.duration}
          />
          
          <InfoItem
            icon={DollarSign}
            label={t("projectDetail.budget") || "Budget"}
            value={project.budget}
            valueClassName="text-blue-600 dark:text-blue-400"
          />
          
          <InfoItem
            icon={Users}
            label={t("projectDetail.team") || "Team Size"}
            value={project.team}
          />
        </div>
<br />
      {project.link && (
  <Link
    href={project.link}
    className="block"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button
      variant="ghost"
      className="w-full border-2 hover:bg-accent"
    >
      {t("projectDetail.browseProject") || ""}
    </Button>
  </Link>
)}


      </CardContent>
    </Card>
  )
}

function QuickActionsCard({ 
  onApply, 
  t 
}: { 
  onApply: () => void
  t: any 
}) {
  return (
    <Card className="border-border shadow-lg">
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-6 pb-3 border-b">
          {t("projectDetail.quickActions") || "Quick Actions"}
        </h3>
        
        <div className="space-y-3">
          <Button 
            onClick={onApply}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all"
          >
            {t("projectDetail.requestSimilar") || "Request Similar Project"}
          </Button>
          
                           <Link href="/contact-us" className="block">
            <Button 
              variant="outline" 
              className="w-full border-2 hover:bg-accent"
            >
              {t("projectDetail.contactUs") || "Contact Us"}
            </Button>
          </Link>
          
          <Link href="/projects" className="block">
            <Button 
              variant="ghost" 
              className="w-full hover:bg-accent"
            >
              {t("projectDetail.browseProjects") || "Browse More Projects"}
            </Button>
          </Link>

        </div>
      </CardContent>
    </Card>
  )
}

function ApplicationDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
  project,
  getLocalizedText,
  isRTL,
  onClose,
  t,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: any
  onSubmit: (data: ApplicationFormData) => void
  isSubmitting: boolean
  project: TechProject
  getLocalizedText: (field: any) => string
  isRTL: boolean
  onClose: () => void
  t: any
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("projectDetail.requestSimilar") || "Request Similar Project"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {t("projectDetail.yourName") || "Your Name"} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-11" placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {t("projectDetail.phone") || "Phone"} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-11" placeholder="+1 234 567 8900" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {t("projectDetail.email") || "Email"}
                  </FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="h-11" placeholder="john@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expect_mony"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {t("projectDetail.expectedBudget") || "Expected Budget"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      className="h-11"
                      placeholder="10000"
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/30 border-2">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  {t("projectDetail.projectSummary") || "Project Summary"}
                </h4>
                <div className="space-y-3">
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm text-muted-foreground font-medium">
                      {t("projectDetail.projectName") || "Project"}
                    </span>
                    <span className="font-semibold text-right">{getLocalizedText(project.title)}</span>
                  </div>
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm text-muted-foreground font-medium">
                      {t("projectDetail.category") || "Category"}
                    </span>
                    <span className="font-semibold">{getLocalizedText(project.category)}</span>
                  </div>
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm text-muted-foreground font-medium">
                      {t("projectDetail.duration") || "Duration"}
                    </span>
                    <span className="font-semibold">{project.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className={`flex justify-end gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {t("projectDetail.cancel") || "Cancel"}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[140px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                {isSubmitting 
                  ? (t("projectDetail.submitting") || "Submitting...") 
                  : (t("projectDetail.submitRequest") || "Submit Request")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function GalleryModal({
  open,
  onOpenChange,
  selectedImage,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedImage: string | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-2">
        {selectedImage && (
          <div className="relative">
            <img
              src={selectedImage}
              alt="Gallery"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}