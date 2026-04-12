// /zain-tech-redesign-3/components/navbar.tsx
"use client"

import { useState, useEffect } from "react"
import { Menu, X, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getSettings } from "@/lib/home"
import Image from "next/image"

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

const languages = [
  { code: "ar" as const, label: "language.ar", flag: "🇸🇦" },
  { code: "en" as const, label: "language.en", flag: "🇬🇧" },
  { code: "ru" as const, label: "language.ru", flag: "🇷🇺" },
]

interface Settings {
  site_name: { ar: string; en: string }
  sub_site_name: { ar: string; en: string }
  logo: string
  theme_color: string
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings()
        if (response?.success && response?.data) {
          setSettings(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleLanguageChange = (newLang: "ar" | "en" | "ru") => {
    if (newLang === language) return
    setIsOpen(false)
    setLanguage(newLang)
    setTimeout(() => {
      router.refresh()
    }, 100)
  }

  const handleNavClick = () => {
    setIsOpen(false)
  }

  const getSiteName = () => {
    if (!settings) return "Zynqore"
    return settings.site_name[language] || settings.site_name.en || "Zynqore"
  }

  const getThemeColor = () => {
    return settings?.theme_color || "#3b82f6"
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled 
            ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50" 
            : "bg-white/60 dark:bg-gray-950/60 backdrop-blur-md",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo - Responsive sizing */}
            <Link 
              href="/" 
              className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity duration-200 flex-shrink-0"
            >
              {settings?.logo ? (
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                  <Image 
                    src={settings.logo} 
                    alt={getSiteName()}
                    fill
                    className="object-contain p-1"
                    priority
                  />
                </div>
              ) : (
                <div 
                  className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                  }}
                >
                  <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
                    {getSiteName().charAt(0)}
                  </span>
                </div>
              )}
              <div className="hidden sm:block">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded h-6 lg:h-7 w-24 lg:w-32" />
                ) : (
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    {getSiteName()}
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* Main Links */}
              {navGroups.main.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm whitespace-nowrap",
                    pathname === link.href 
                      ? "text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                  style={pathname === link.href ? {
                    background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                  } : {}}
                >
                  {t(link.label)}
                </Link>
              ))}

              {/* Offerings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "gap-1 font-medium text-sm px-3 xl:px-4 hover:bg-gray-100 dark:hover:bg-gray-800",
                      navGroups.offerings.some(link => pathname === link.href) 
                        ? "text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300"
                    )}
                    style={navGroups.offerings.some(link => pathname === link.href) ? {
                      background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                    } : {}}
                  >
                    {t("nav.offerings") || "Offerings"}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 mt-2">
                  {navGroups.offerings.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "cursor-pointer w-full",
                          pathname === link.href && "bg-gray-100 dark:bg-gray-800 font-medium"
                        )}
                        style={pathname === link.href ? { color: getThemeColor() } : {}}
                        dir={language=="ar"?"rtl":"ltr"}
                      >
                        {t(link.label)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Work Links */}
              {navGroups.work.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm whitespace-nowrap",
                    pathname === link.href 
                      ? "text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                  style={pathname === link.href ? {
                    background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                  } : {}}
                >
                  {t(link.label)}
                </Link>
              ))}

              {/* Support Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "gap-1 font-medium text-sm px-3 xl:px-4 hover:bg-gray-100 dark:hover:bg-gray-800",
                      navGroups.support.some(link => pathname === link.href) 
                        ? "text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300"
                    )}
                    style={navGroups.support.some(link => pathname === link.href) ? {
                      background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                    } : {}}
                  >
                    {t("nav.support") || "Support"}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 mt-2">
                  {navGroups.support.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "cursor-pointer w-full",
                          pathname === link.href && "bg-gray-100 dark:bg-gray-800 font-medium"
                        )}
                        style={pathname === link.href ? { color: getThemeColor() } : {}}
                          dir={language=="ar"?"rtl":"ltr"}

                      >
                        {t(link.label)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right Actions - Desktop */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 h-9 px-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-base">{languages.find((l) => l.code === language)?.flag}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 mt-2">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={cn(
                        "cursor-pointer",
                        language === lang.code && "bg-gray-100 dark:bg-gray-800 font-medium"
                      )}
                      style={language === lang.code ? { color: getThemeColor() } : {}}
                    >
                      <span className="mr-2 text-base">{lang.flag}</span>
                      {t(lang.label)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* CTA Button */}
              <Link href="/add-projects">
                <Button 
                  size="sm"
                  className="text-white px-4 xl:px-6 h-9 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm whitespace-nowrap"
                  style={{
                    background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                  }}
                >
                  {t("nav.startProject")}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-200 dark:border-gray-800",
            isOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="max-h-[calc(100vh-5rem)] overflow-y-auto bg-white dark:bg-gray-950">
            <div className="flex flex-col gap-1 p-4 pb-6">
              {/* Mobile Nav Links - Organized by Section */}
              <div className="space-y-1 mb-2">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                  {t("nav.main") || "Main"}
                </p>
                {navGroups.main.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className={cn(
                      "block px-4 py-3 rounded-xl transition-all font-medium text-sm",
                      pathname === link.href 
                        ? "text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                    style={pathname === link.href ? {
                      background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                    } : {}}
                  >
                    {t(link.label)}
                  </Link>
                ))}
              </div>

              <div className="space-y-1 mb-2">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                  {t("nav.offerings") || "Offerings"}
                </p>
                {navGroups.offerings.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className={cn(
                      "block px-4 py-3 rounded-xl transition-all font-medium text-sm",
                      pathname === link.href 
                        ? "text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                    style={pathname === link.href ? {
                      background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                    } : {}}
                  >
                    {t(link.label)}
                  </Link>
                ))}
              </div>

              <div className="space-y-1 mb-2">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                  {t("nav.work") || "Work"}
                </p>
                {navGroups.work.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className={cn(
                      "block px-4 py-3 rounded-xl transition-all font-medium text-sm",
                      pathname === link.href 
                        ? "text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                    style={pathname === link.href ? {
                      background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                    } : {}}
                  >
                    {t(link.label)}
                  </Link>
                ))}
              </div>

              <div className="space-y-1 mb-3">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                  {t("nav.support") || "Support"}
                </p>
                {navGroups.support.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className={cn(
                      "block px-4 py-3 rounded-xl transition-all font-medium text-sm",
                      pathname === link.href 
                        ? "text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                    style={pathname === link.href ? {
                      background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                    } : {}}
                  >
                    {t(link.label)}
                  </Link>
                ))}
              </div>

              {/* Mobile Language Selector */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-2">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2 mb-2">
                  {t("nav.language")}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      disabled={language === lang.code}
                      className={cn(
                        "px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center gap-1",
                        language === lang.code
                          ? "text-white shadow-md cursor-not-allowed"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer",
                      )}
                      style={language === lang.code ? {
                        background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                      } : {}}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-xs font-semibold">{t(lang.label)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile CTA Button */}
              <Link href="/add-projects" onClick={handleNavClick} className="mt-4">
                <Button 
                  size="lg"
                  className="text-white w-full h-12 rounded-full shadow-lg font-medium text-base"
                  style={{
                    background: `linear-gradient(135deg, ${getThemeColor()}, ${getThemeColor()}dd)`,
                  }}
                >
                  {t("nav.startProject")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  )
}