// 📄 app/services/[id]/page.tsx (Updated section)
"use client"

import { useEffect, useState } from "react"
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
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, Check, FileText, Upload, X 
} from "lucide-react"
import { getServiceById, createServiceRequest } from "@/lib/services"
import { useLanguage } from "@/lib/i18n/language-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Skeleton } from "@/components/ui/skeleton"

// Form schema for service request
const serviceRequestSchema = z.object({
  details: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
})

type ServiceFeature = {
  title: { ar: string; en: string; ru?: string }
  description: { ar: string; en: string; ru?: string }
  icon: string
}

type Service = {
  id: number
  name: { ar: string; en: string; ru?: string }
  description: { ar: string; en: string; ru?: string }
  long_description?: { ar: string; en: string; ru?: string }
  icon: string
  color: string
  image: string
  slug: string
  start_price: string
  requires_auth: boolean
  requires_approval: boolean
  tech_support: string | { ar: string; en: string; ru?: string }
  insurance: string | { ar: string; en: string; ru?: string }
  technology: string[] | string // Can be array or string
  features: ServiceFeature[]
  category?: {
    id: number
    name: { ar: string; en: string; ru?: string }
  }
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t,  isAuthenticated } = useLanguage()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

    const { language } = useLanguage()
    const isRTL = language === "ar"


  const form = useForm<z.infer<typeof serviceRequestSchema>>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      details: "",
      attachments: [],
    },
  })

  useEffect(() => {
    if (params?.id) {
      fetchService()
    }
  }, [params?.id])

  const fetchService = async () => {
    try {
      const response = await getServiceById(Number(params.id))
      if (response.success) {
        setService(response.data)
      } else {
        router.push("/services")
      }
    } catch (error) {
      console.error("Error fetching service:", error)
      router.push("/services")
    } finally {
      setLoading(false)
    }
  }

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

 
const onSubmit = async (data: z.infer<typeof serviceRequestSchema>) => {
  if (!service) return

  // Check authentication requirement
  if (service.requires_auth && !isAuthenticated) {
    alert(t("serviceDetail.loginRequiredMessage"))
    return
  }

  setIsSubmitting(true)
  try {
    const response = await createServiceRequest({
      service_id: service.id,
      details: data.details || "",
      attachments: attachments,
    })

    if (response.success) {
      // Show success message with request number
      const requestNumber = response.data?.request_number || "N/A"
      // alert(
      //   `${t("serviceDetail.requestCreatedSuccess")}\n` +
      //   `${t("serviceDetail.requestNumber")}: ${requestNumber}\n` +
      //   `${t("serviceDetail.status")}: ${response.data?.status || "pending"}`
      // )
      
      alert(response?.message|| "Service request created successfully")
      // Close dialog and reset form
      setRequestDialogOpen(false)
      form.reset()
      setAttachments([])
      
      // Optional: Redirect to requests page
      // router.push("/my-requests")
    } else {
      alert(response.message || t("serviceDetail.requestFailed"))
    }
  } catch (error: any) {
    console.error("Error creating request:", error)
    
    // More detailed error handling
    if (error.response?.status === 401) {
      alert(t("serviceDetail.loginRequiredMessage"))
    } else if (error.response?.status === 422) {
      const errors = error.response?.data?.errors
      const errorMessages = errors 
        ? Object.values(errors).flat().join('\n')
        : t("serviceDetail.validationError")
      alert(errorMessages)
    } else {
      alert(error.message || t("serviceDetail.requestFailed"))
    }
  } finally {
    setIsSubmitting(false)
  }
}

  const handleRequestClick = () => {
    if (service?.requires_auth && !isAuthenticated) {
      alert(t("serviceDetail.loginRequiredMessage"))
      return
    }
    setRequestDialogOpen(true)
  }

  const getLocalizedText = (field: any): string => {
    if (!field) return ""
    
    // If it's a translation object
    if (typeof field === 'object' && !Array.isArray(field)) {
      return field[language as keyof typeof field] || field.en || field.ar || ""
    }
    
    // If it's a plain string
    return String(field)
  }

  // Helper to safely get technology array
  const getTechnologyArray = (): string[] => {
    if (!service?.technology) return []
    
    if (Array.isArray(service.technology)) {
      return service.technology
    }
    
    // Try to parse as JSON if it's a string
    if (typeof service.technology === 'string') {
      try {
        const parsed = JSON.parse(service.technology)
        return Array.isArray(parsed) ? parsed : [service.technology]
      } catch {
        return [service.technology]
      }
    }
    
    return []
  }

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

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("serviceDetail.serviceNotFound")}</h1>
          <Link href="/services">
            <Button className="bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg">
              {t("serviceDetail.backToServices")}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const technologyArray = getTechnologyArray()

  return (
    <>
          <Navbar />

    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>

      {/* Breadcrumb */}
      <section className="pt-24 md:pt-32 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto max-w-6xl">
          {/* <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/services" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t("serviceDetail.backToServices")}</span>
            </Link>
            <span className="text-muted-foreground mx-2">/</span>
            <span className="text-muted-foreground">{getLocalizedText(service.name)}</span>
          </div> */}
        </div>
      </section>

      {/* Hero Image */}
      <section className="px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="relative h-96 md:h-[32rem] rounded-xl overflow-hidden shadow-lg mt-6 md:mt-8">
            <img 
              src={service.image || "/placeholder.svg"} 
              alt={getLocalizedText(service.name)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Floating Price Card */}
            <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'} bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-sm`}>
              <h2 className="text-2xl font-bold mb-2">{getLocalizedText(service.name)}</h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl" style={{ color: service.color }}>
                  ●
                </div>
                <span className="text-lg font-bold" style={{ color: service.color }}>
                  {t("services.startingFrom")} ${service.start_price}
                </span>
              </div>
              <Button 
                onClick={handleRequestClick}
                className="w-full bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg h-12"
              >
                {t("serviceDetail.requestService")}
              </Button>
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
              {/* Description */}
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {getLocalizedText(service.name)}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                  {getLocalizedText(service.description)}
                </p>
                
                {service.long_description && (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {getLocalizedText(service.long_description)}
                    </p>
                  </div>
                )}
              </div>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    {t("serviceDetail.features")}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {service.features.map((feature, idx) => (
                      <Card key={idx} className="border-border hover:border-blue-500/50 transition-colors">
                        <CardContent className="p-6">
                          <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="text-2xl">{feature.icon}</div>
                            <div>
                              <h3 className="font-bold text-lg mb-2">
                                {getLocalizedText(feature.title)}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {getLocalizedText(feature.description)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies - SAFE RENDERING */}
              {technologyArray.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    {t("serviceDetail.technologies")}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {technologyArray.map((tech, idx) => (
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
            </div>
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Service Info Card */}
                <Card className="border-border">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">{t("serviceDetail.serviceInfo")}</h3>
                    
                    <div className="space-y-4">
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-5 h-5 text-muted-foreground">📅</div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <p className="text-sm text-muted-foreground">{t("serviceDetail.deliveryTime")}</p>
                          <p className="font-medium">2-4 {t("serviceDetail.weeks")}</p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-5 h-5 text-muted-foreground">🛡️</div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <p className="text-sm text-muted-foreground">{t("serviceDetail.warranty")}</p>
                          <p className="font-medium">{getLocalizedText(service.insurance)}</p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-5 h-5 text-muted-foreground">💻</div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <p className="text-sm text-muted-foreground">{t("serviceDetail.techSupport")}</p>
                          <p className="font-medium">{getLocalizedText(service.tech_support)}</p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-5 h-5 text-muted-foreground">✅</div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <p className="text-sm text-muted-foreground">{t("serviceDetail.approvalRequired")}</p>
                          <p className="font-medium">
                            {service.requires_approval ? t("serviceDetail.yes") : t("serviceDetail.no")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-border">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">{t("serviceDetail.quickActions")}</h3>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={handleRequestClick}
                        className="w-full bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg"
                        disabled={service.requires_auth && !isAuthenticated}
                      >
                        {service.requires_auth && !isAuthenticated 
                          ? t("serviceDetail.loginToRequest") 
                          : t("serviceDetail.requestService")
                        }
                      </Button>
                      
                        <Link href="/contact-us">
                        <Button variant="outline" className="w-full rounded-lg">
                          {t("serviceDetail.contactSupport")}
                        </Button>
                      </Link>
                      
                      <Link href="/services">
                        <Button variant="ghost" className="w-full rounded-lg">
                          {t("serviceDetail.browseServices")}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Auth Required Notice */}
                {service.requires_auth && (
                  <Card className="border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20">
                    <CardContent className="p-6">
                      <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-1">🔒</div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                            {t("serviceDetail.authenticationRequired")}
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            {t("serviceDetail.authRequiredDescription")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Request Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {t("serviceDetail.requestService")}: {getLocalizedText(service.name)}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("serviceDetail.additionalDetails")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("serviceDetail.describeRequirements")}
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
                <FormLabel>{t("serviceDetail.attachments")}</FormLabel>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("serviceDetail.uploadFiles")}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {t("serviceDetail.fileTypes")} • {t("common.maxFileSize")}
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

              {/* Service Summary */}
              <Card className="bg-gray-50 dark:bg-gray-900/50">
                <CardContent className="p-6">
                  <h4 className="font-bold mb-4">{t("serviceDetail.serviceSummary")}</h4>
                  <div className="space-y-2">
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{t("serviceDetail.serviceName")}</span>
                      <span className="font-medium">{getLocalizedText(service.name)}</span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{t("serviceDetail.startingPrice")}</span>
                      <span className="font-bold" style={{ color: service.color }}>
                        ${service.start_price}
                      </span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">{t("serviceDetail.approvalRequired")}</span>
                      <span>{service.requires_approval ? t("serviceDetail.yes") : t("serviceDetail.no")}</span>
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
                  {t("serviceDetail.cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("serviceDetail.submitting") : t("serviceDetail.submitRequest")}
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