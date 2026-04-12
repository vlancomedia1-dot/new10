// 📄 app/services/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Search, Filter, Smartphone, Monitor, Brain, ShoppingCart, Cloud, Wifi } from "lucide-react"
import { getServices, getServiceCategories } from "@/lib/services"
import { useLanguage } from "@/lib/i18n/language-context"
import { Skeleton } from "@/components/ui/skeleton"

// Icon mapping
const iconMap: Record<string, any> = {
  "📱": Smartphone,
  "🌐": Monitor,
  "🤖": Brain,
  "🛒": ShoppingCart,
  "☁️": Cloud,
  "🌍": Wifi,
  "mobile": Smartphone,
  "web": Monitor,
  "ai": Brain,
  "ecommerce": ShoppingCart,
  "cloud": Cloud,
  "iot": Wifi,
}

type ServiceCategory = {
  id: number
  name: { ar: string; en: string; ru?: string }
  description: { ar: string; en: string; ru?: string }
  icon: string
  color: string
}

type Service = {
  id: number
  name: { ar: string; en: string; ru?: string }
  description: { ar: string; en: string; ru?: string }
  icon: string
  color: string
  slug: string
  image: string
  start_price: string
  requires_auth: boolean
  category?: {
    id: number
    name: { ar: string; en: string; ru?: string }
  }
}

export default function ServicesPage() {
  const { t} = useLanguage()
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const { language } = useLanguage()
  const isRTL = language === "ar"

  useEffect(() => {
    fetchServices()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterServices()
  }, [services, searchQuery, selectedCategory, language])

  const fetchServices = async () => {
    try {
      const response = await getServices()
      if (response.success) {
        setServices(response.data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await getServiceCategories()
      if (response.success) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const filterServices = () => {
    let filtered = services

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service => {
        const serviceName = service.name[language as keyof Service['name']] || service.name.en || ""
        const serviceDesc = service.description[language as keyof Service['description']] || service.description.en || ""
        return (
          serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          serviceDesc.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(service => 
        service.category?.id === parseInt(selectedCategory)
      )
    }

    setFilteredServices(filtered)
  }

  const getIcon = (icon: string) => {
    const IconComponent = iconMap[icon] || Monitor
    return <IconComponent className="w-6 h-6" />
  }

  const getLocalizedText = (field: { ar: string; en: string; ru?: string } | undefined) => {
    if (!field) return ""
    return field[language as keyof typeof field] || field.en || field.ar || ""
  }

  return (
    <>      <Navbar />
    <div className="min-h-screen bg-background"  dir={isRTL ? "rtl" : "ltr"}>

      {/* Hero Section */}
      <section  dir={isRTL ? "rtl" : "ltr"} className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background" >
        <div className="container mx-auto max-w-6xl">
          <Link 
            href="/" 
            className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t("services.backToHome")}</span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {t("services.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
            {t("services.description")}
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section  dir={isRTL ? "rtl" : "ltr"} className="py-8 px-4 md:px-6 bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
              <Input
                type="text"
                placeholder={t("services.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isRTL ? 'pr-10' : 'pl-10'} h-12`}
              />
            </div>
            
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className={`h-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder={t("services.allCategories")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("services.allCategories")}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span style={{ color: category.color }}>●</span>
                        {getLocalizedText(category.name)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section  dir={isRTL ? "rtl" : "ltr"} className="py-12 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">{t("services.noServicesFound")}</h3>
              <p className="text-muted-foreground">{t("services.tryDifferentSearch")}</p>
            </div>
          ) : (
            <>
              <div className="mb-8 flex justify-between items-center">
                <p className="text-muted-foreground">
                  {t("services.showing")} <span className="font-semibold">{filteredServices.length}</span> {t("services.servicesCount")}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredServices.map((service) => (
                  <Link key={service.id} href={`/services/${service.id}`}>
                    <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-500/50 cursor-pointer">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={getLocalizedText(service.name)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        
                        {/* Price Badge */}
                        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full`}>
                          <span className="text-sm font-bold" style={{ color: service.color }}>
                            {t("services.startingFrom")} ${service.start_price}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        {/* Icon and Category */}
                        <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${service.color}20` }}
                          >
                            <span className="text-xl">{getIcon(service.icon)}</span>
                          </div>
                          {service.category && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                              {getLocalizedText(service.category.name)}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors">
                          {getLocalizedText(service.name)}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm md:text-base mb-4">
                          {getLocalizedText(service.description)}
                        </p>

                        {/* Auth Requirement Badge */}
                        {service.requires_auth && (
                          <div className="mb-4">
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                              🔒 {t("services.loginRequired")}
                            </span>
                          </div>
                        )}

                        <Button className="w-full bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
                          {t("services.viewDetails")}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Service Request Search Section */}
      <section  dir={isRTL ? "rtl" : "ltr"} className="py-12 px-4 md:px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t("services.trackRequest")}
              </h2>
              <p className="mb-8 opacity-90">
                {t("services.enterRequestNumber")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder={t("services.requestNumberPlaceholder")}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12"
                />
                <Button className="h-12 bg-white text-blue-700 hover:bg-white/90">
                  {t("services.trackButton")}
                </Button>
              </div>
              
              <p className="text-sm mt-4 opacity-75">
                {t("services.trackDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
</>
  )
}