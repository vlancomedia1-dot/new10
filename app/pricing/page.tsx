// 📄 app/pricing/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Check, Search, Loader2 } from "lucide-react"
import { getPricingPlans } from "@/lib/services"
import { useLanguage } from "@/lib/i18n/language-context"
import { Skeleton } from "@/components/ui/skeleton"
import type { PricingPlan } from "@/lib/services"

export default function PricingPage() {
  const { t, language } = useLanguage()
  const isRTL = language === "ar"
  
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await getPricingPlans()
      
      if (response.success && response.data?.plans) {
        // Sort by order
        const sortedPlans = response.data.plans.sort((a: any, b: any) => a.order - b.order)
        setPlans(sortedPlans)
      }
    } catch (error) {
      console.error("Error fetching pricing plans:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter plans by search term
  const filteredPlans = plans.filter(plan => {
    if (!searchTerm) return true
    
    const title = (plan.title || "").toLowerCase()
    const description = (plan.description || "").toLowerCase()
    const search = searchTerm.toLowerCase()
    
    return title.includes(search) || description.includes(search)
  })

  const getPlanIcon = (key: string) => {
    const icons: Record<string, string> = {
      basic: "🚀",
      advanced: "⭐",
      productivity: "👑",
      enterprise: "💼",
      starter: "🌱",
      professional: "💎",
    }
    return icons[key] || "📦"
  }

  const getPlanColor = (key: string) => {
    const colors: Record<string, string> = {
      basic: "from-blue-400 to-blue-600",
      advanced: "from-purple-400 to-purple-600",
      productivity: "from-amber-400 to-amber-600",
      enterprise: "from-red-400 to-red-600",
      starter: "from-green-400 to-green-600",
      professional: "from-indigo-400 to-indigo-600",
    }
    return colors[key] || "from-gray-400 to-gray-600"
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
              <span>{t("pricing.backToHome") || "العودة للرئيسية"}</span>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {t("pricing.title") || "خطط الأسعار"}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
              {t("pricing.subtitle") || "اختر الخطة المناسبة لاحتياجات مشروعك - نحن نقدم حلول مرنة وشاملة لجميع الأحجام والميزانيات"}
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 px-4 md:px-6 bg-card border-b border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  type="text"
                  placeholder={t("pricing.searchPlaceholder") || "ابحث عن الباقات..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} h-11`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans Grid */}
        <section className="py-16 md:py-20 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                {t("pricing.plansTitle") || "باقات الخدمات الشاملة"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("pricing.plansSubtitle") || "خطط شاملة تشمل جميع الخدمات الأساسية التي تحتاجها لنمو مشروعك الرقمي"}
              </p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-32 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-8 w-1/2 mb-4" />
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((j) => (
                          <Skeleton key={j} className="h-4 w-full" />
                        ))}
                      </div>
                      <Skeleton className="h-10 w-full mt-6" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("pricing.noPlansFound") || "لم يتم العثور على باقات"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t("pricing.tryDifferentSearch") || "حاول البحث بكلمات مختلفة"}
                </p>
                <Button onClick={() => setSearchTerm("")} variant="outline">
                  {t("pricing.clearSearch") || "مسح البحث"}
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPlans.map((plan) => (
                  <Link key={plan.id} href={`/pricing/${plan.id}`}>
                    <Card className="group h-full overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-border hover:border-blue-500 cursor-pointer flex flex-col">
                      {/* Header */}
                      <div className={`bg-gradient-to-r ${getPlanColor(plan.key)} p-6 text-white`}>
                        <div className="text-4xl mb-3">{getPlanIcon(plan.key)}</div>
                        <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                        <p className="text-blue-100">{plan.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="p-6 border-b border-border">
                        <div className={`flex items-baseline gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.currency}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {isRTL ? `لكل ${plan.billing_cycle}` : `per ${plan.billing_cycle}`}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="flex-1 p-6 space-y-4">
                        {plan.features && plan.features.slice(0, 6).map((feature, idx) => (
                          <div key={idx} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                        {plan.features && plan.features.length > 6 && (
                          <p className="text-sm text-blue-600 font-medium">
                            + {plan.features.length - 6} {t("pricing.moreFeatures") || "مميزات إضافية"}
                          </p>
                        )}
                      </div>

                      {/* CTA Button */}
                      <div className="p-6 pt-0">
                        <Button className="w-full bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
                          {t("pricing.choosePlan") || "اختر هذه الباقة"}
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
 
        {/* CTA Section */}
        <section className="py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-8 md:p-12 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t("pricing.ctaTitle") || "هل تحتاج مساعدة في اختيار الباقة المناسبة؟"}
              </h2>
              <p className="text-lg mb-8 opacity-90">
                {t("pricing.ctaSubtitle") || "تواصل مع فريقنا للحصول على استشارة مجانية"}
              </p>
              <Button className="bg-white text-blue-700 hover:bg-white/90 px-8 py-6 text-lg rounded-lg">
                {t("pricing.ctaButton") || "تواصل معنا"}
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}