"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { addProjectApply } from "@/lib/home"

export default function AddProjectsPage() {
  const [formData, setFormData] = useState({
    // معلومات مقدم الطلب
    name: "",
    phone: "",
    email: "",
    expect_mony: "",
    
    // تفاصيل المشروع
    title: "",
    description: "",
    category: "",
    client: "",
    budget: "",
    duration: "",
    result: "",
    technologies: "",
    details: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // تحويل البيانات إلى الصيغة المطلوبة من الـ API
      const apiData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        expect_mony: formData.expect_mony ? parseFloat(formData.expect_mony) : undefined,
        details: {
          title: formData.title,
          description: formData.description || undefined,
          category: formData.category || undefined,
          client_name: formData.client || undefined,
          budget_range: formData.budget || undefined,
          duration: formData.duration || undefined,
          result: formData.result || undefined,
          technologies: formData.technologies 
            ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
            : undefined,
          extra: formData.details || undefined,
        },
      }

      await addProjectApply(apiData)
      
      setSubmitted(true)
      
      // إعادة تعيين النموذج بعد 3 ثواني
      setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          email: "",
          expect_mony: "",
          title: "",
          description: "",
          category: "",
          client: "",
          budget: "",
          duration: "",
          result: "",
          technologies: "",
          details: "",
        })
        setSubmitted(false)
      }, 3000)
    } catch (err: any) {
      console.error("Error submitting project:", err)
      setError(err.message || "حدث خطأ أثناء إرسال المشروع. الرجاء المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      expect_mony: "",
      title: "",
      description: "",
      category: "",
      client: "",
      budget: "",
      duration: "",
      result: "",
      technologies: "",
      details: "",
    })
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">إضافة مشروع جديد</h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance">
            شارك مشروعك معنا ودعنا نعرضه ضمن محفظتنا المتميزة
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          {submitted ? (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
              <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">تم الإرسال بنجاح!</p>
              <p className="text-muted-foreground">سيتم مراجعة مشروعك قريباً وإضافته للمحفظة</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* معلومات مقدم الطلب */}
              <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">معلوماتك الشخصية</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">الاسم الكامل *</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="أدخل اسمك الكامل"
                      className="bg-background border-border"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">رقم الهاتف *</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="أدخل رقم هاتفك"
                        className="bg-background border-border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">البريد الإلكتروني</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">الميزانية المتوقعة</label>
                    <Input
                      type="number"
                      name="expect_mony"
                      value={formData.expect_mony}
                      onChange={handleChange}
                      placeholder="أدخل الميزانية المتوقعة بالدولار"
                      className="bg-background border-border"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">معلومات المشروع الأساسية</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">اسم المشروع *</label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="أدخل اسم المشروع"
                      className="bg-background border-border"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">الوصف المختصر</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="وصف مختصر عن المشروع"
                      className="bg-background border-border min-h-24"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">التصنيف</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                      >
                        <option value="">اختر التصنيف</option>
                        <option value="التجارة الإلكترونية">التجارة الإلكترونية</option>
                        <option value="تطبيقات الجوال">تطبيقات الجوال</option>
                        <option value="تطوير المواقع">تطوير المواقع</option>
                        <option value="الذكاء الاصطناعي">الذكاء الاصطناعي</option>
                        <option value="إنترنت الأشياء">إنترنت الأشياء</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">اسم العميل</label>
                      <Input
                        type="text"
                        name="client"
                        value={formData.client}
                        onChange={handleChange}
                        placeholder="أدخل اسم العميل أو الشركة"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">تفاصيل المشروع</h2>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">نطاق الميزانية</label>
                      <Input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="مثال: $5,000 - $10,000"
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">مدة المشروع</label>
                      <Input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="مثال: 3 أشهر"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">النتيجة المحققة</label>
                    <Input
                      type="text"
                      name="result"
                      value={formData.result}
                      onChange={handleChange}
                      placeholder="مثال: زيادة المبيعات 150%"
                      className="bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">التقنيات المستخدمة</label>
                    <Input
                      type="text"
                      name="technologies"
                      value={formData.technologies}
                      onChange={handleChange}
                      placeholder="مثال: React, Node.js, MongoDB (افصل بفاصلة)"
                      className="bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">تفاصيل إضافية</label>
                    <Textarea
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      placeholder="تفاصيل إضافية عن المشروع والتحديات والحلول"
                      className="bg-background border-border min-h-32"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg h-12 px-8 disabled:opacity-50"
                >
                  {loading ? "جاري الإرسال..." : "إرسال المشروع"}
                </Button>
                <Button 
                  type="button" 
                  onClick={handleReset}
                  variant="outline" 
                  className="rounded-lg h-12 px-8 bg-transparent"
                  disabled={loading}
                >
                  مسح النموذج
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}