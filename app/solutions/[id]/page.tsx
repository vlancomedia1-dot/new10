// 📄 app/solutions/[id]/page.tsx (Complete Redesign)
"use client"

import { use, useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, CheckCircle, AlertCircle, FileText, Upload, X, TrendingUp, Clock, DollarSign
} from "lucide-react"
import { getSolutionById } from "@/lib/services"
import { useLanguage } from "@/lib/i18n/language-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Skeleton } from "@/components/ui/skeleton"
import type { TechSolution } from "@/lib/services"

// Form schema for solution request
const solutionRequestSchema = z.object({
  details: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
})

export default function SolutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { t, language, isAuthenticated } = useLanguage()
  const [solution, setSolution] = useState<TechSolution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isRTL = language === "ar"

  const form = useForm<z.infer<typeof solutionRequestSchema>>({
    resolver: zodResolver(solutionRequestSchema),
    defaultValues: {
      details: "",
      attachments: [],
    },
  })

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        setLoading(true)
        const response = await getSolutionById(Number(id))
        if (response.success) {
          setSolution(response.data)
        } else {
          setError("Solution not found")
          router.push("/solutions")
        }
      } catch (err: any) {
        console.error("Error fetching solution:", err)
        setError(err.message || "Failed to load solution")
        router.push("/solutions")
      } finally {
        setLoading(false)
      }
    }

    fetchSolution()
  }, [id, router])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files])
      form.setValue("attachments", [...attachments, ...files])
    }
  }

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index)
    setAttachments(newAttachments)
    form.setValue("attachments", newAttachments)
  }

  const onSubmit = async (data: z.infer<typeof solutionRequestSchema>) => {
    if (!solution) return

    setIsSubmitting(true)
    try {
      // Replace with your actual API call
      // const response = await createSolutionRequest({
      //   solution_id: solution.id,
      //   details: data.details,
      //   attachments: attachments,
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      alert(t("solutionDetail.requestCreated") || "Request created successfully!")
      setRequestDialogOpen(false)
      form.reset()
      setAttachments([])
    } catch (error) {
      console.error("Error creating request:", error)
      alert(t("solutionDetail.requestFailed") || "Failed to create request")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestClick = () => {
    // if (!isAuthenticated) {
    //   alert(t("solutionDetail.loginRequiredMessage") || "Please login to request this solution")
    //   return
    // }
    setRequestDialogOpen(true)
  }

  const getLocalizedText = (field: any): string => {
    if (!field) return ""
    
    if (typeof field === 'object' && !Array.isArray(field)) {
      return field[language as keyof typeof field] || field.en || field.ar || ""
    }
    
    return String(field)
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 md:px-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-96 w-full rounded-xl mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-full mb-8" />
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Error State
  if (error || !solution) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">
            {t("solutionDetail.solutionNotFound") || "Solution Not Found"}
          </h1>
          <Link href="/solutions">
            <Button className="bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg">
              {t("solutionDetail.backToSolutions") || "Back to Solutions"}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        {/* Breadcrumb */}
        <section className="pt-24 md:pt-32 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
          <div className="container mx-auto max-w-6xl">
            {/* Optional: Add breadcrumb navigation here */}
          </div>
        </section>

        {/* Hero Section with Gradient Background */}
        <section className="px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="relative rounded-xl overflow-hidden shadow-lg mt-6 md:mt-8 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950">
              <div className="absolute inset-0 bg-grid-white/10" />
              
              <div className="relative p-8 md:p-12">
                {/* Floating Info Card */}
                <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-md ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
                  <h2 className="text-2xl font-bold mb-2">{getLocalizedText(solution.title)}</h2>
                  <p className="text-muted-foreground mb-4">{getLocalizedText(solution.overview)}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-blue-600">{solution.investment}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span>{getLocalizedText(solution.duration)}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-600">{t("solutions.roi")}: {solution.roi}</span>
                    </div>
                  </div>

                  {/* <Button 
                    onClick={handleRequestClick}
                    className="w-full bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg h-12"
                  >
                    {t("solutionDetail.requestSolution") || "Request Solution"}
                  </Button> */}
                </div>

                {/* Background Pattern */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {/* Main Content */}
              <div className="md:col-span-2">
                {/* Overview */}
                <div className="mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                    {getLocalizedText(solution.title)}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground mb-6">
                    {getLocalizedText(solution.overview)}
                  </p>
                </div>

                {/* Challenges */}
                {solution.challenges && solution.challenges.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                      {t("solutionDetail.challenges") || "Challenges We Solve"}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {solution.challenges.map((challenge, idx) => (
                        <Card key={idx} className="border-red-500/30 bg-red-50/50 dark:bg-red-950/20">
                          <CardContent className="p-4">
                            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-red-900 dark:text-red-100">
                                {challenge}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {solution.benefits && solution.benefits.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                      {t("solutionDetail.benefits") || "Key Benefits"}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {solution.benefits.map((benefit, idx) => (
                        <Card key={idx} className="border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
                          <CardContent className="p-4">
                            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-green-900 dark:text-green-100">
                                {benefit}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {solution.technologies && solution.technologies.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                      {t("solutionDetail.technologies") || "Technologies Used"}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {solution.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Solutions */}
                {solution.related_solutions && solution.related_solutions.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                      {t("solutionDetail.relatedSolutions") || "Related Solutions"}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {solution.related_solutions.map((related, idx) => (
                        <Card key={idx} className="border-border hover:border-blue-500/50 transition-colors cursor-pointer">
                          <CardContent className="p-6">
                            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="text-3xl">{related.icon}</div>
                              <div>
                                <h3 className="font-bold text-lg">
                                  {getLocalizedText(related.title)}
                                </h3>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Solution Info Card */}
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4">
                        {t("solutionDetail.solutionInfo") || "Solution Information"}
                      </h3>
                      
                      <div className="space-y-4">
                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <DollarSign className="w-5 h-5 text-muted-foreground" />
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <p className="text-sm text-muted-foreground">
                              {t("solutionDetail.investment") || "Investment"}
                            </p>
                            <p className="font-medium">{solution.investment}</p>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Clock className="w-5 h-5 text-muted-foreground" />
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <p className="text-sm text-muted-foreground">
                              {t("solutionDetail.duration") || "Duration"}
                            </p>
                            <p className="font-medium">{getLocalizedText(solution.duration)}</p>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <TrendingUp className="w-5 h-5 text-muted-foreground" />
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <p className="text-sm text-muted-foreground">
                              {t("solutionDetail.expectedROI") || "Expected ROI"}
                            </p>
                            <p className="font-medium text-green-600">{solution.roi}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4">
                        {t("solutionDetail.quickActions") || "Quick Actions"}
                      </h3>
                      
                      <div className="space-y-3">
                        <Button 
                          onClick={handleRequestClick}
                          className="w-full bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg"
                        >
                          {t("solutionDetail.requestSolution") || "Request Solution"}
                        </Button>
                        
                        <Link href="/contact-us">
                          <Button variant="outline" className="w-full rounded-lg">
                            {t("solutionDetail.contactSupport") || "Contact Support"}
                          </Button>
                        </Link>
                        
                        <Link href="/solutions">
                          <Button variant="ghost" className="w-full rounded-lg">
                            {t("solutionDetail.browseSolutions") || "Browse Solutions"}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Info Notice */}
                  <Card className="border-blue-500/30 bg-blue-50 dark:bg-blue-950/20">
                    <CardContent className="p-6">
                      <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1">💡</div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                            {t("solutionDetail.customSolution") || "Custom Solution"}
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            {t("solutionDetail.customDescription") || "Each solution is tailored to your specific business needs and requirements."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Request Dialog */}
        <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {t("solutionDetail.requestSolution") || "Request Solution"}: {getLocalizedText(solution.title)}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("solutionDetail.additionalDetails") || "Additional Details"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("solutionDetail.describeRequirements") || "Describe your requirements..."}
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload */}
                <div className="space-y-4">
                  <FormLabel>
                    {t("solutionDetail.attachments") || "Attachments (Optional)"}
                  </FormLabel>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("solutionDetail.uploadFiles") || "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {t("solutionDetail.fileTypes") || "PDF, DOC, DOCX, JPG, PNG"} • {t("common.maxFileSize") || "Max 10MB"}
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="max-w-xs mx-auto"
                    />
                  </div>

                  {/* Attachments List */}
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <FileText className="w-5 h-5 text-gray-500" />
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Solution Summary */}
                <Card className="bg-gray-50 dark:bg-gray-900/50">
                  <CardContent className="p-6">
                    <h4 className="font-bold mb-4">
                      {t("solutionDetail.solutionSummary") || "Solution Summary"}
                    </h4>
                    <div className="space-y-2">
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">
                          {t("solutionDetail.solutionName") || "Solution"}
                        </span>
                        <span className="font-medium">{getLocalizedText(solution.title)}</span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">
                          {t("solutionDetail.investment") || "Investment"}
                        </span>
                        <span className="font-bold text-blue-600">
                          {solution.investment}
                        </span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">
                          {t("solutionDetail.duration") || "Duration"}
                        </span>
                        <span>{getLocalizedText(solution.duration)}</span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-muted-foreground">
                          {t("solutionDetail.expectedROI") || "Expected ROI"}
                        </span>
                        <span className="font-medium text-green-600">{solution.roi}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className={`flex justify-end gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setRequestDialogOpen(false)
                      form.reset()
                      setAttachments([])
                    }}
                  >
                    {t("solutionDetail.cancel") || "Cancel"}
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting 
                      ? (t("solutionDetail.submitting") || "Submitting...") 
                      : (t("solutionDetail.submitRequest") || "Submit Request")
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </>
  )
}