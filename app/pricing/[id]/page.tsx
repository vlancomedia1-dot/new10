// 📄 app/pricing/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { ArrowLeft, Check, Loader2, Mail, Phone, User, ChevronDown, ChevronUp, DollarSign } from "lucide-react"
import { getPricingPlanById, applyForPricingPlan } from "@/lib/services"
import { useLanguage } from "@/lib/i18n/language-context"
import { Skeleton } from "@/components/ui/skeleton"

// Types
type PricingPlan = {
  id: number
  key: string
  title: string
  price: number
  currency: string
  billing_cycle: string
  description: string
  features: string[]
  extras: {
    web: string[]
    mobile: string[]
    ai: string[]
  }
  target_audience?: string
  order: number
  faq?: Array<{
    question: string
    answer: string
  }>
}

type FormData = {
  name: string
  email: string
  phone: string
  expect_mony: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

// Plan configuration
const PLAN_ICONS: Record<string, string> = {
  basic: "🚀",
  advanced: "⭐",
  productivity: "👑",
  enterprise: "💼",
  starter: "🌱",
  professional: "💎",
}

const PLAN_COLORS: Record<string, string> = {
  basic: "from-blue-400 to-blue-600",
  advanced: "from-purple-400 to-purple-600",
  productivity: "from-amber-400 to-amber-600",
  enterprise: "from-red-400 to-red-600",
  starter: "from-green-400 to-green-600",
  professional: "from-indigo-400 to-indigo-600",
}

export default function PricingDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const { t, language } = useLanguage()
  const isRTL = language === "ar"
  
  const [plan, setPlan] = useState<PricingPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [showApplyDialog, setShowApplyDialog] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [planId, setPlanId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    expect_mony: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  // Initialize page and get plan ID
  useEffect(() => {
    const initializePage = async () => {
      try {
        const resolvedParams = await params
        const id = parseInt(resolvedParams.id)
        
        if (!id || isNaN(id)) {
          console.error("Invalid plan ID:", resolvedParams.id)
          setError(t("pricing.invalidPlanId") || "معرف الباقة غير صحيح")
          setLoading(false)
          return
        }
        
        console.log("🔍 Setting plan ID:", id)
        setPlanId(id)
      } catch (err) {
        console.error("❌ Error resolving params:", err)
        setError(t("pricing.pageLoadError") || "فشل تحميل الصفحة")
        setLoading(false)
      }
    }
    
    initializePage()
  }, [params, t])

  // Fetch plan details when planId is set
  useEffect(() => {
    if (planId) {
      fetchPlanDetails()
    }
  }, [planId])

  const fetchPlanDetails = async () => {
    if (!planId) return
    
    try {
      setLoading(true)
      setError(null)
      
      console.log("📡 Fetching plan with ID:", planId)
      const response: any = await getPricingPlanById(planId)
      
      console.log("📦 API Response:", response)
      
      if (response?.success && response?.data) {
        console.log("✅ Plan loaded successfully:", response.data)
        setPlan(response.data)
      } else {
        const errorMsg = response?.message || t("pricing.planNotFound") || "الباقة غير موجودة"
        console.error("⚠️ API returned unsuccessful response:", errorMsg)
        setError(errorMsg)
      }
    } catch (err: any) {
      console.error("❌ Error fetching plan details:", err)
      setError(err?.message || t("pricing.loadError") || "فشل تحميل الباقة")
    } finally {
      setLoading(false)
    }
  }

  const getPlanIcon = (key: string) => PLAN_ICONS[key] || "📦"
  const getPlanColor = (key: string) => PLAN_COLORS[key] || "from-gray-400 to-gray-600"

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      errors.name = t("pricing.nameRequired") || "الاسم مطلوب"
    } else if (formData.name.trim().length < 2) {
      errors.name = t("pricing.nameTooShort") || "الاسم قصير جداً"
    }

    // Email validation (optional but must be valid if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t("pricing.emailInvalid") || "البريد الإلكتروني غير صحيح"
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = t("pricing.phoneRequired") || "رقم الهاتف مطلوب"
    } else if (!/^\+?[\d\s-()]{8,}$/.test(formData.phone.trim())) {
      errors.phone = t("pricing.phoneInvalid") || "رقم الهاتف غير صحيح"
    }

    // Budget validation (optional but must be valid if provided)
    if (formData.expect_mony) {
      const budget = Number(formData.expect_mony)
      if (isNaN(budget) || budget < 0) {
        errors.expect_mony = t("pricing.budgetInvalid") || "الميزانية المتوقعة غير صحيحة"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleApply = async () => {
    if (!validateForm() || !plan) {
      console.warn("⚠️ Form validation failed or plan not loaded")
      return
    }

    try {
      setApplying(true)
      console.log("📤 Submitting application for plan:", plan.id)
      console.log("📤 Plan details:", { id: plan.id, key: plan.key, title: plan.title })
      
      // Prepare data - only send defined values
      const applicationData: {
        name: string
        phone: string
        email?: string
        expect_mony?: number
      } = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      }

      // Only add email if it's provided and valid
      if (formData.email && formData.email.trim()) {
        applicationData.email = formData.email.trim()
      }

      // Only add expect_mony if it's provided and valid
      if (formData.expect_mony && formData.expect_mony.trim()) {
        const budget = Number(formData.expect_mony)
        if (!isNaN(budget) && budget >= 0) {
          applicationData.expect_mony = budget
        }
      }

      console.log("📋 Application data being sent:", applicationData)
      console.log("📋 Plan ID:", plan.id, "Type:", typeof plan.id)
      console.log("🌐 API endpoint will be: /pricing-plans/" + plan.id + "/apply")
      
      // Call API with plan ID as number
      const response: any = await applyForPricingPlan(plan.id, applicationData)
      
      console.log("📬 Application response:", response)
      
      if (response?.success) {
        // Success - show message from API
        const successMsg = response.data?.message || 
                          response.message || 
                          t("pricing.applicationSuccess") || 
                          "تم إرسال طلبك بنجاح! سنتواصل معك قريباً."
        
        alert(successMsg)
        setShowApplyDialog(false)
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          expect_mony: "",
        })
        setFormErrors({})
        
        console.log("✅ Application submitted successfully")
      } else {
        // Error response from API
        const errorMsg = response?.message || 
                        t("pricing.applicationError") || 
                        "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى."
        
        console.error("⚠️ API error:", errorMsg)
        alert(errorMsg)
      }
    } catch (err: any) {
      console.error("❌ Error applying for plan:", err)
      console.error("❌ Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
      
      // Handle different error types
      let errorMessage = t("pricing.applicationError") || "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى."
      
      if (err.message === "Failed to fetch") {
        errorMessage = isRTL 
          ? "خطأ في الاتصال بالخادم. تأكد من:\n• اتصالك بالإنترنت\n• تشغيل الخادم على المنفذ الصحيح\n• عدم وجود مشاكل CORS"
          : "Connection error. Please check:\n• Your internet connection\n• The server is running on the correct port\n• There are no CORS issues"
      } else if (err.message) {
        errorMessage = err.message
      }
      
      alert(errorMessage)
    } finally {
      setApplying(false)
    }
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  // Loading State
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20" dir={isRTL ? "rtl" : "ltr"}>
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-10 w-32 mb-8" />
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8">
                <CardContent className="p-8">
                  <Skeleton className="h-12 w-3/4 mb-4" />
                  <Skeleton className="h-6 w-full mb-8" />
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Error State
  if (error || !plan) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20" dir={isRTL ? "rtl" : "ltr"}>
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-6xl mb-4">😕</div>
              <h1 className="text-3xl font-bold mb-4">
                {t("pricing.planNotFound") || "الباقة غير موجودة"}
              </h1>
              <p className="text-muted-foreground mb-8">
                {error || t("pricing.planNotFoundDesc") || "عذراً، لم نتمكن من العثور على الباقة المطلوبة"}
              </p>
              <Link href="/pricing">
                <Button size="lg">
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                  {t("pricing.backToPlans") || "العودة إلى الباقات"}
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link href="/pricing">
            <Button variant="ghost" className="mb-8 group">
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'} transition-transform group-hover:-translate-x-1`} />
              {t("pricing.backToPlans") || "العودة إلى الباقات"}
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Plan Header Card */}
            <Card className="mb-8 overflow-hidden border-2 shadow-xl">
              <div className={`bg-gradient-to-r ${getPlanColor(plan.key)} p-8 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{getPlanIcon(plan.key)}</div>
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{plan.title}</h1>
                      <p className="text-white/90 text-lg">{plan.description}</p>
                    </div>
                  </div>
                </div>
                <div className={`flex items-baseline gap-2 mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-2xl">{plan.currency}</span>
                  <span className="text-xl text-white/80">/ {plan.billing_cycle}</span>
                </div>
              </div>

              <CardContent className="p-8">
                {/* Target Audience */}
                {plan.target_audience && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-1">
                      {t("pricing.targetAudience") || "مناسبة لـ"}
                    </h3>
                    <p className="text-blue-700">{plan.target_audience}</p>
                  </div>
                )}

                {/* Features */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Check className="w-6 h-6 text-green-500" />
                    {t("pricing.features") || "المميزات"}
                  </h2>
                  <div className="grid gap-3">
                    {plan.features && plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extras */}
                {plan.extras && (plan.extras.web?.length > 0 || plan.extras.mobile?.length > 0 || plan.extras.ai?.length > 0) && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                      {t("pricing.extras") || "خدمات إضافية"}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      {plan.extras.web && plan.extras.web.length > 0 && (
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">
                              {t("pricing.web") || "ويب"}
                            </h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                              {plan.extras.web.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                      {plan.extras.mobile && plan.extras.mobile.length > 0 && (
                        <Card className="bg-purple-50 border-purple-200">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-purple-900 mb-2">
                              {t("pricing.mobile") || "موبايل"}
                            </h3>
                            <ul className="text-sm text-purple-700 space-y-1">
                              {plan.extras.mobile.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                      {plan.extras.ai && plan.extras.ai.length > 0 && (
                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-green-900 mb-2">
                              {t("pricing.ai") || "ذكاء اصطناعي"}
                            </h3>
                            <ul className="text-sm text-green-700 space-y-1">
                              {plan.extras.ai.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      className={`w-full text-lg py-6 bg-gradient-to-r ${getPlanColor(plan.key)} hover:opacity-90 transition-opacity`}
                    >
                      {t("pricing.applyNow") || "تقديم طلب الآن"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" dir={isRTL ? "rtl" : "ltr"}>
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        {t("pricing.applyFor") || "تقديم طلب للباقة"}: {plan.title}
                      </DialogTitle>
                      <DialogDescription>
                        {t("pricing.fillForm") || "املأ النموذج وسنتواصل معك قريباً"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      {/* Name */}
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          {t("pricing.name") || "الاسم"} *
                        </label>
                        <div className="relative">
                          <User className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
                          <Input
                            placeholder={t("pricing.namePlaceholder") || "أدخل اسمك"}
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value })
                              if (formErrors.name) {
                                setFormErrors({ ...formErrors, name: undefined })
                              }
                            }}
                            className={isRTL ? "pr-10" : "pl-10"}
                          />
                        </div>
                        {formErrors.name && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          {t("pricing.phone") || "رقم الهاتف"} *
                        </label>
                        <div className="relative">
                          <Phone className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
                          <Input
                            type="tel"
                            placeholder={t("pricing.phonePlaceholder") || "أدخل رقم هاتفك"}
                            value={formData.phone}
                            onChange={(e) => {
                              setFormData({ ...formData, phone: e.target.value })
                              if (formErrors.phone) {
                                setFormErrors({ ...formErrors, phone: undefined })
                              }
                            }}
                            className={isRTL ? "pr-10" : "pl-10"}
                          />
                        </div>
                        {formErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          {t("pricing.email") || "البريد الإلكتروني"} ({t("pricing.optional") || "اختياري"})
                        </label>
                        <div className="relative">
                          <Mail className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
                          <Input
                            type="email"
                            placeholder={t("pricing.emailPlaceholder") || "أدخل بريدك الإلكتروني"}
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value })
                              if (formErrors.email) {
                                setFormErrors({ ...formErrors, email: undefined })
                              }
                            }}
                            className={isRTL ? "pr-10" : "pl-10"}
                          />
                        </div>
                        {formErrors.email && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                        )}
                      </div>

                      {/* Expected Budget */}
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          {t("projects.budget") || "الميزانية المتوقعة"} ({t("pricing.optional") || "اختياري"})
                        </label>
                        <div className="relative">
                          <DollarSign className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={t("projects.budget") || "مثال: 5000"}
                            value={formData.expect_mony}
                            onChange={(e) => {
                              setFormData({ ...formData, expect_mony: e.target.value })
                              if (formErrors.expect_mony) {
                                setFormErrors({ ...formErrors, expect_mony: undefined })
                              }
                            }}
                            className={isRTL ? "pr-10" : "pl-10"}
                          />
                        </div>
                        {formErrors.expect_mony && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.expect_mony}</p>
                        )}
                      </div>

                      <Button
                        onClick={handleApply}
                        disabled={applying}
                        className="w-full"
                        size="lg"
                      >
                        {applying ? (
                          <>
                            <Loader2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                            {t("pricing.sending") || "جاري الإرسال..."}
                          </>
                        ) : (
                          t("pricing.submit") || "إرسال الطلب"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            {plan.faq && plan.faq.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    {t("pricing.faq") || "الأسئلة الشائعة"}
                  </h2>
                  <div className="space-y-4">
                    {plan.faq.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          className={`w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between ${isRTL ? 'text-right' : 'text-left'}`}
                        >
                          <span className="font-semibold text-gray-800">
                            {item.question}
                          </span>
                          {expandedFaq === index ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFaq === index && (
                          <div className="p-4 bg-white border-t">
                            <p className="text-gray-600">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}