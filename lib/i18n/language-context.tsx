"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import arTranslations from "./translations/ar.json"
import enTranslations from "./translations/en.json"
import ruTranslations from "./translations/ru.json"

// تعريف أنواع اللغات المدعومة
type Language = "ar" | "en" | "ru"

// واجهة سياق اللغة
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: "rtl" | "ltr"
}

const allTranslations = {
  ar: arTranslations,
  en: enTranslations,
  ru: ruTranslations,
}

// إنشاء سياق اللغة
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// مزود سياق اللغة
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar")
  const [translations, setTranslations] = useState<Record<string, string>>(arTranslations)

  useEffect(() => {
    setTranslations(allTranslations[language])
  }, [language])

  // حفظ اللغة في localStorage وتحديث الحالة
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
      // تحديث اتجاه الصفحة
      document.documentElement.lang = lang
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    }
  }

  // استرجاع اللغة من localStorage عند التحميل
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") as Language
      if (savedLang && ["ar", "en", "ru"].includes(savedLang)) {
        setLanguage(savedLang)
      }
    }
  }, [])

  // دالة الترجمة
  const t = (key: string): string => {
    return translations[key] || key
  }

  // اتجاه النص
  const dir = language === "ar" ? "rtl" : "ltr"

  return <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>{children}</LanguageContext.Provider>
}

// هوك مخصص لاستخدام سياق اللغة
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
