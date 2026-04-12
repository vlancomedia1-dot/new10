// 📄 app/policy/[type]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getPoliciesByType } from "@/lib/services"
import { useLanguage } from "@/lib/i18n/language-context"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
type Policy = {
  id: number
  type: string
  title: string
  content: string
  published_at: string
}

const policyTitles: Record<string, { ar: string; en: string }> = {
  "privacy-policy": { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  "terms-and-conditions": { ar: "الشروط والأحكام", en: "Terms & Conditions" },
  "refund-policy": { ar: "سياسة الاسترجاع", en: "Refund Policy" },
  "shipping-policy": { ar: "سياسة الشحن", en: "Shipping Policy" },
  "cancellation-policy": { ar: "سياسة الإلغاء", en: "Cancellation Policy" },
  "cookies-policy": { ar: "سياسة الكوكيز", en: "Cookies Policy" },
  "payment-policy": { ar: "سياسة الدفع", en: "Payment Policy" },
  "faq": { ar: "الأسئلة الشائعة", en: "FAQ" },
  "about-us": { ar: "من نحن", en: "About Us" },
  "contact-info": { ar: "معلومات الاتصال", en: "Contact Info" }
}

export default function PolicyPage() {
  const params = useParams()
  const { language } = useLanguage()
  const isRTL = language === "ar"
  const policyType = params.type as string

  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true)
        const response = await getPoliciesByType(policyType)
        
        if (response.status && response.data) {
          setPolicies(response.data)
        } else {
          setError(isRTL ? "فشل تحميل البيانات" : "Failed to load data")
        }
      } catch (err) {
        setError(isRTL ? "حدث خطأ أثناء تحميل البيانات" : "Error loading data")
      } finally {
        setLoading(false)
      }
    }

    if (policyType) {
      fetchPolicies()
    }
  }, [policyType, isRTL])

  const pageTitle = policyTitles[policyType]?.[language] || policyType

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link 
            href="/" 
            className="text-blue-500 hover:underline inline-flex items-center gap-2"
          >
            {isRTL ? (
              <>
                العودة للرئيسية
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </>
            )}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>      <Navbar />
    


    <div className="min-h-screen bg-background mt-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-4xl">
       
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
          {pageTitle}
        </h1>

        {policies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {isRTL ? "لا توجد معلومات متاحة حالياً" : "No information available"}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {policies.map((policy) => (
              <div 
                key={policy.id} 
                className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">
                  {policy.title}
                </h2>
                <div 
                  className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: policy.content }}
                />
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {isRTL ? "تاريخ النشر: " : "Published: "}
                    {new Date(policy.published_at).toLocaleDateString(
                      isRTL ? 'ar-EG' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm md:text-base text-muted-foreground">
            {isRTL 
              ? "إذا كانت لديك أي أسئلة حول هذه السياسة، يرجى التواصل معنا." 
              : "If you have any questions about this policy, please contact us."
            }
          </p>
          <Link 
            href="/contact-us" 
            className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {isRTL ? "تواصل معنا" : "Contact Us"}
          </Link>
        </div>
      </div>
    </div>
              <Footer />  </>
  )
}