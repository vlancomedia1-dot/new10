// app/contact-us/page.tsx
"use client"

import type React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Phone, Mail, MapPin, Clock, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { 
  getOrganization, 
  getOrganizationBranches, 
  getOrganizationContactInfo,
  submitContact,
  type ContactResponse 
} from "@/lib/services"

export default function ContactUsPage() {
  const { t, language } = useLanguage()
  const isRTL = language === "ar"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [attachment, setAttachment] = useState<File | null>(null)
  const [orgData, setOrgData] = useState<any>(null)
  const [branches, setBranches] = useState<any[]>([])
  const [contactInfo, setContactInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    trackingCode?: string;
  }>({ type: null, message: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgRes, branchesRes, contactRes] = await Promise.all([
          getOrganization({ lang: language }),
          getOrganizationBranches({ lang: language }),
          getOrganizationContactInfo({ lang: language })
        ])

        if (orgRes.success) setOrgData(orgRes.data)
        if (branchesRes.success) setBranches(branchesRes.data.branches)
        if (contactRes.success) setContactInfo(contactRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [language])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({
          type: 'error',
          message: isRTL ? 'حجم الملف يجب أن يكون أقل من 5 ميجابايت' : 'File size must be less than 5MB'
        })
        return
      }
      setAttachment(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      // Determine if email or phone
      const emailPhone = formData.email || formData.phone

      const response = await submitContact({
        fullname: formData.name,
        email_phone: emailPhone,
        details: formData.message,
        subject: formData.subject || (isRTL ? 'استفسار من الموقع' : 'Website Inquiry'),
        source: 'website',
        attachment: attachment || undefined,
      }) as ContactResponse

      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: isRTL 
            ? `تم إرسال رسالتك بنجاح! رقم التتبع: ${response.data.tracking_code}` 
            : `Your message was sent successfully! Tracking code: ${response.data.tracking_code}`,
          trackingCode: response.data.tracking_code
        })
        
        // Reset form
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        setAttachment(null)
        
        // Reset file input
        const fileInput = document.getElementById('attachment') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        throw new Error(response.message || 'Submission failed')
      }
    } catch (error: any) {
      console.error("Error submitting contact form:", error)
      setSubmitStatus({
        type: 'error',
        message: error.message || (isRTL 
          ? 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.' 
          : 'An error occurred while sending your message. Please try again.')
      })
    } finally {
      setSubmitting(false)
    }
  }

  const contactCards = [
    { 
      icon: Phone, 
      label: isRTL ? "الهاتف" : "Phone",
      value: orgData?.phone || contactInfo?.general_info?.phone || "+966 11 123 4567"
    },
    { 
      icon: Mail, 
      label: isRTL ? "البريد الإلكتروني" : "Email",
      value: orgData?.email || contactInfo?.general_info?.email || "info@zynqore.com"
    },
    { 
      icon: MapPin, 
      label: isRTL ? "العنوان" : "Address",
      value: orgData?.address || contactInfo?.general_info?.address || (isRTL ? "الرياض، السعودية" : "Riyadh, Saudi Arabia")
    },
    { 
      icon: Clock, 
      label: isRTL ? "ساعات العمل" : "Working Hours",
      value: contactInfo?.working_hours?.general || (isRTL ? "الأحد - الخميس 8 ص - 5 م" : "Sunday - Thursday 8 AM - 5 PM")
    },
  ]

  const subjects = isRTL ? [
    { value: "general", label: "استفسار عام" },
    { value: "service", label: "طلب خدمة" },
    { value: "support", label: "دعم فني" },
    { value: "partnership", label: "فرص الشراكة" },
    { value: "complaint", label: "شكوى" },
    { value: "other", label: "أخرى" }
  ] : [
    { value: "general", label: "General Inquiry" },
    { value: "service", label: "Service Request" },
    { value: "support", label: "Technical Support" },
    { value: "partnership", label: "Partnership Opportunities" },
    { value: "complaint", label: "Complaint" },
    { value: "other", label: "Other" }
  ]

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto max-w-6xl">
          <Link href="/" className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{isRTL ? "العودة للرئيسية" : "Back to Home"}</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {isRTL ? "تواصل معنا" : "Contact Us"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
            {isRTL 
              ? "لدينا فريق مخصص لمساعدتك والإجابة على جميع استفساراتك" 
              : "We have a dedicated team to help you and answer all your inquiries"}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((info, idx) => {
              const IconComponent = info.icon
              return (
                <div
                  key={idx}
                  className="bg-card rounded-xl p-6 border border-border text-center hover:border-blue-500/50 transition-colors"
                >
                  <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">{info.label}</p>
                  <p className="font-semibold text-foreground text-sm">{info.value}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      {branches.length > 0 && (
        <section className="py-12 md:py-16 px-4 md:px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              {isRTL ? "فروعنا" : "Our Branches"}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {branches.map((branch, idx) => (
                <div key={branch.id} className="bg-card rounded-xl p-6 border border-border hover:border-blue-500/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-2">
                        {branch.name || `${isRTL ? 'فرع' : 'Branch'} ${branch.city}`}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{branch.description}</p>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>{branch.address}, {branch.city}, {branch.country}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span>{branch.phone}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span>{branch.email}</span>
                        </p>
                        {branch.contact_info?.working_hours && (
                          <p className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{branch.contact_info.working_hours}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-card border-y border-border">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isRTL ? "أرسل لنا رسالة" : "Send Us a Message"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {isRTL 
                ? "املأ النموذج أدناه وسيرد عليك فريقنا في أقرب وقت" 
                : "Fill out the form below and our team will respond to you as soon as possible"}
            </p>
          </div>

          {/* Success/Error Message */}
          {submitStatus.type && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              {submitStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  submitStatus.type === 'success' ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                }`}>
                  {submitStatus.message}
                </p>
                {submitStatus.trackingCode && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {isRTL ? 'احتفظ برقم التتبع للمتابعة' : 'Keep the tracking code for follow-up'}
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {isRTL ? "الاسم الكامل" : "Full Name"} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={isRTL ? "أدخل اسمك الكامل" : "Enter your full name"}
                  className="bg-background border-border"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {isRTL ? "البريد الإلكتروني" : "Email"} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-background border-border"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {isRTL ? "رقم الهاتف" : "Phone Number"}
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+966 50 000 0000"
                  className="bg-background border-border"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {isRTL ? "الموضوع" : "Subject"} <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  required
                  disabled={submitting}
                >
                  <option value="">{isRTL ? "اختر الموضوع" : "Select Subject"}</option>
                  {subjects.map(sub => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {isRTL ? "الرسالة" : "Message"} <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={isRTL ? "اكتب رسالتك هنا... (10 أحرف على الأقل)" : "Write your message here... (at least 10 characters)"}
                className="bg-background border-border min-h-32"
                required
                minLength={10}
                maxLength={2000}
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.message.length} / 2000 {isRTL ? 'حرف' : 'characters'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {isRTL ? "مرفق (اختياري)" : "Attachment (Optional)"}
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-blue-500 transition-colors text-center">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {attachment 
                        ? attachment.name 
                        : (isRTL ? "انقر لاختيار ملف (حد أقصى 5 ميجابايت)" : "Click to select file (max 5MB)")}
                    </p>
                  </div>
                  <input
                    id="attachment"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    disabled={submitting}
                  />
                </label>
                {attachment && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAttachment(null)
                      const fileInput = document.getElementById('attachment') as HTMLInputElement
                      if (fileInput) fileInput.value = ''
                    }}
                    disabled={submitting}
                  >
                    {isRTL ? "إزالة" : "Remove"}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className={`bg-gradient-to-${isRTL ? 'l' : 'r'} from-blue-500 to-blue-700 text-white rounded-lg h-12 px-8`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {isRTL ? "جاري الإرسال..." : "Sending..."}
                  </>
                ) : (
                  isRTL ? "إرسال الرسالة" : "Send Message"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="rounded-lg h-12 px-8 bg-transparent"
                onClick={() => {
                  setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
                  setAttachment(null)
                  setSubmitStatus({ type: null, message: '' })
                }}
                disabled={submitting}
              >
                {isRTL ? "مسح" : "Clear"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            {isRTL ? "موقعنا" : "Our Locations"}
          </h2>
          <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg border border-border bg-muted">
            {branches.length > 0 ? (
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.3!2d${branches[0]?.longitude || '46.6753'}!3d${branches[0]?.latitude || '24.7136'}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1s${language}!2ssa!4v1234567890`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                {isRTL ? "جاري تحميل الخريطة..." : "Loading map..."}
              </div>
            )}
          </div>
          
          {/* Branch markers legend */}
          {branches.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              {branches.map((branch, idx) => (
                <div key={branch.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-red-500' : 'bg-blue-500'}`} />
                  <span className="text-muted-foreground">{branch.city}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}