"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Linkedin, Instagram, Facebook, Youtube } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { subscribeToNewsletter } from "@/lib/services"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

type LocalizedString = { ar: string; en: string }

type FooterProps = {
  settings?: {
    site_name: LocalizedString
    sub_site_name: LocalizedString
    site_description: LocalizedString
    logo: string
    contact_email: string
    social_links: {
      facebook?: string
      twitter?: string
      instagram?: string
      linkedin?: string
      youtube?: string
    }
  }
}

// Organized nav links from navbar
const navGroups = {
  main: [
    { href: "/", label: "nav.home" },
    { href: "/who-we-are", label: "nav.about" },
  ],
  offerings: [
    { href: "/services", label: "nav.services" },
    { href: "/solutions", label: "nav.solutions" },
    { href: "/pricing", label: "nav.pricing" },
  ],
  work: [
    { href: "/projects", label: "nav.projects" },
    { href: "/jobs", label: "nav.jobs" },
  ],
  support: [
    { href: "/tickets", label: "nav.tickets" },
    { href: "/contact-us", label: "nav.contact" },
  ],
}

const policyLinks = [
  { label: { ar: "سياسة الخصوصية", en: "Privacy Policy" }, type: "privacy-policy" },
  { label: { ar: "الشروط والأحكام", en: "Terms & Conditions" }, type: "terms-and-conditions" },
  { label: { ar: "سياسة الاسترجاع", en: "Refund Policy" }, type: "refund-policy" },
  { label: { ar: "سياسة الشحن", en: "Shipping Policy" }, type: "shipping-policy" },
]

export function Footer({ settings }: FooterProps) {
  const { language, t } = useLanguage()
  const isRTL = language === "ar"
  const tLocal = (field: LocalizedString) => field?.[language as keyof LocalizedString] || field?.en || ""

  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribeMessage, setSubscribeMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const socialIcons = { 
    facebook: Facebook, 
    twitter: Twitter, 
    instagram: Instagram, 
    linkedin: Linkedin, 
    youtube: Youtube 
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setSubscribeMessage({
        type: 'error',
        text: isRTL ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email"
      })
      return
    }

    setIsSubscribing(true)
    setSubscribeMessage(null)

    try {
      const response = await subscribeToNewsletter({
        email,
        source: 'footer'
      })

      if (response.success) {
        setSubscribeMessage({
          type: 'success',
          text: isRTL ? "تم الاشتراك بنجاح!" : "Successfully subscribed!"
        })
        setEmail("")
      } else {
        throw new Error('Subscription failed')
      }
    } catch (error) {
      setSubscribeMessage({
        type: 'error',
        text: isRTL ? "حدث خطأ، يرجى المحاولة مرة أخرى" : "An error occurred, please try again"
      })
    } finally {
      setIsSubscribing(false)
      setTimeout(() => setSubscribeMessage(null), 5000)
    }
  }

  return (
    <footer className="bg-foreground text-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-10">
          {/* Company Info - Span 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              {settings?.logo ? (
                <Image 
                  src={settings.logo} 
                  alt={tLocal(settings.site_name)} 
                  width={44} 
                  height={44} 
                  className="rounded-xl" 
                />
              ) : (
                <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl md:text-2xl font-bold">Z</span>
                </div>
              )}
              <span className="text-xl md:text-2xl font-bold">
                {settings ? tLocal(settings.site_name) : "Zyn"}
                <span className="text-blue-500">{settings ? "" : "qore"}</span>
              </span>
            </div>
            <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
              {settings 
                ? tLocal(settings.site_description) 
                : (isRTL 
                  ? "شركة رائدة في تقديم حلول تقنية متكاملة ومبتكرة للشركات والمؤسسات لتحقيق النمو الرقمي والتميز." 
                  : "Leading company in providing innovative technical solutions."
                )
              }
            </p>
            <div className="flex gap-2 md:gap-3">
              {settings?.social_links && Object.entries(settings.social_links)
                .filter(([_, url]) => url)
                .map(([platform, url]) => {
                  const Icon = socialIcons[platform as keyof typeof socialIcons]
                  return Icon ? (
                    <a 
                      key={platform} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-9 h-9 md:w-10 md:h-10 bg-muted/20 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                      aria-label={platform}
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                  ) : null
                })
              }
            </div>
          </div>

          {/* Main Links */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6">
              {t("nav.main") || (isRTL ? "الرئيسية" : "Main")}
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {navGroups.main.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-blue-500 transition-colors text-sm md:text-base block"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offerings Links */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6">
              {t("nav.offerings") || (isRTL ? "خدماتنا" : "Offerings")}
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {navGroups.offerings.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-blue-500 transition-colors text-sm md:text-base block"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Work & Support Links */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6">
              {t("nav.work") || (isRTL ? "أعمالنا" : "Work")}
            </h3>
            <ul className="space-y-2 md:space-y-3 mb-6">
              {navGroups.work.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-blue-500 transition-colors text-sm md:text-base block"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h3 className="text-base md:text-lg font-bold mb-4">
              {t("nav.support") || (isRTL ? "الدعم" : "Support")}
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {navGroups.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-blue-500 transition-colors text-sm md:text-base block"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6">
              {isRTL ? "النشرة البريدية" : "Newsletter"}
            </h3>
            <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">
              {isRTL 
                ? "اشترك في نشرتنا البريدية لتصلك آخر أخبارنا وعروضنا." 
                : "Subscribe to our newsletter for latest updates."
              }
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex flex-col gap-2">
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRTL ? "بريدك الإلكتروني" : "Your email"} 
                  className="bg-muted/20 border-muted/30 text-background placeholder:text-muted-foreground text-sm"
                  disabled={isSubscribing}
                />
                <Button 
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-gradient-to-l from-blue-500 to-blue-700 text-white px-4 text-sm md:text-base disabled:opacity-50 w-full"
                >
                  {isSubscribing ? (isRTL ? "جاري..." : "...") : (isRTL ? "اشترك" : "Subscribe")}
                </Button>
              </div>
              {subscribeMessage && (
                <p className={`text-xs md:text-sm ${
                  subscribeMessage.type === 'success' 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {subscribeMessage.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-muted-foreground text-xs md:text-sm">
              © 2025 {settings ? tLocal(settings.site_name) : "Zynqore"}. {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm">
              {policyLinks.map((policy, idx) => (
                <Link 
                  key={idx}
                  href={`/policy/${policy.type}`}
                  className="text-muted-foreground hover:text-blue-500 transition-colors"
                >
                  {tLocal(policy.label)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}