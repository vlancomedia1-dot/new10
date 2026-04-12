"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { apiPost } from "@/lib/api"
import { useLanguage } from "@/lib/i18n/language-context"

type LocalizedString = { ar: string; en: string }

type ContactSectionProps = {
  settings?: {
    phone_number: string
    contact_email: string
    address: string
  }
}

export function ContactSection({ settings }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const { language } = useLanguage()
  const isRTL = language === "ar"

  const contactInfo = [
    { icon: MapPin, title: isRTL ? "العنوان" : "Address", content: settings?.address || (isRTL ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia") },
    { icon: Phone, title: isRTL ? "الهاتف" : "Phone", content: settings?.phone_number || "+966 11 123 4567" },
    { icon: Mail, title: isRTL ? "البريد الإلكتروني" : "Email", content: settings?.contact_email || "info@zynqore.com" },
    { icon: Clock, title: isRTL ? "ساعات العمل" : "Working Hours", content: isRTL ? "الأحد - الخميس: 8 ص - 5 م" : "Sun - Thu: 8 AM - 5 PM" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res: any = await apiPost("/contact", {
        fullname: formData.name,
        email_phone: formData.email,
        subject: formData.subject,
        message: formData.message,
      }, language)

      if (res.success) {
        setStatus({ type: "success", message: res.message[language as keyof LocalizedString] || res.message.en })
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setStatus({ type: "error", message: isRTL ? "حدث خطأ في إرسال الرسالة" : "Error sending message" })
      }
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || (isRTL ? "حدث خطأ في إرسال الرسالة" : "Error sending message") })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-blue-600 font-semibold text-xs md:text-sm uppercase tracking-wider">
            {isRTL ? "تواصل معنا" : "Contact Us"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 text-balance">
            {isRTL ? "نحن هنا لمساعدتك" : "We're Here to Help"}
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            {isRTL ? "لديك سؤال أو مشروع تريد مناقشته؟ تواصل معنا وسنرد عليك في أقرب وقت" : "Have a question or project to discuss? Contact us and we'll respond soon"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{isRTL ? "الاسم الكامل" : "Full Name"}</label>
                  <Input placeholder={isRTL ? "أدخل اسمك" : "Enter your name"} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{isRTL ? "البريد الإلكتروني" : "Email"}</label>
                  <Input type="email" placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email"} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{isRTL ? "الموضوع" : "Subject"}</label>
                <Input placeholder={isRTL ? "موضوع الرسالة" : "Message subject"} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{isRTL ? "الرسالة" : "Message"}</label>
                <Textarea placeholder={isRTL ? "اكتب رسالتك هنا..." : "Write your message..."} rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="resize-none" />
              </div>
              {status && (
                <div className={`p-3 rounded-lg text-sm ${status.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {status.message}
                </div>
              )}
              <Button type="submit" size="lg" disabled={loading} className="w-full bg-gradient-to-l from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full">
                <Send className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                {loading ? (isRTL ? "جاري الإرسال..." : "Sending...") : (isRTL ? "إرسال الرسالة" : "Send Message")}
              </Button>
            </form>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="bg-card rounded-xl p-4 md:p-6 border border-border hover:border-blue-500/50 transition-colors">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <info.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">{info.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm break-words">{info.content}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 md:p-8 text-white">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{isRTL ? "هل لديك مشروع في ذهنك؟" : "Have a Project in Mind?"}</h3>
              <p className="opacity-90 mb-4 md:mb-6 text-sm md:text-base">
                {isRTL ? "دعنا نتحدث عن كيف يمكننا مساعدتك في تحويل فكرتك إلى واقع رقمي مميز." : "Let's discuss how we can help turn your idea into a distinctive digital reality."}
              </p>
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-white/90 rounded-full text-sm md:text-base">
                {isRTL ? "احجز استشارة مجانية" : "Book Free Consultation"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
