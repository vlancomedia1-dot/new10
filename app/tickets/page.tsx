"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Plus, Eye, Clock, CheckCircle, AlertCircle, Search, X, Loader2, Send } from "lucide-react"
import { getTicketByNumber, createTicket, addTicketMessage } from "@/lib/services"
import { useLanguage } from "@/lib/i18n/language-context"

// API Response interfaces
interface ApiTicket {
  id: number
  ticket_number: string
  name: string
  email: string
  phone: string | null
  link: string | null
  subject: string
  category: string
  priority: "Low" | "Medium" | "High"
  status: "Open" | "In Progress" | "Closed"
  created_at: string
  updated_at: string
}

interface TicketMessage {
  id: number
  ticket_id: number
  sender: "customer" | "admin"
  message: string
  attachments: string | null
  created_at: string
}

interface TicketWithMessages extends ApiTicket {
  messages?: TicketMessage[]
}

export default function TicketsPage() {
  const { t, language } = useLanguage()
  const isRTL = language === "ar"

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    link: "",
    subject: "",
    category: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    message: "",
  })

  // Ticket state
  const [selectedTicket, setSelectedTicket] = useState<TicketWithMessages | null>(null)
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([])
  const [searchNumber, setSearchNumber] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)

  // Message form
  const [newMessage, setNewMessage] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await createTicket({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        link: formData.link || undefined,
        subject: formData.subject,
        category: formData.category,
        priority: formData.priority,
        message: formData.message,
      })

      if (response.success && response.data) {
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          link: "",
          subject: "",
          category: "",
          priority: "Medium",
          message: "",
        })
        setShowForm(false)
        setSuccessMessage(t("tickets.ticketCreatedSuccess", { number: response.data.ticket_number }))
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000)
      }
    } catch (error: any) {
      console.error("Error creating ticket:", error)
      setErrorMessage(t("tickets.createError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Search for ticket by number
  const handleSearch = async () => {
    if (!searchNumber.trim()) {
      setSelectedTicket(null)
      return
    }

    setIsSearching(true)
    setErrorMessage("")

    try {
      const response = await getTicketByNumber(searchNumber.trim())
      if (response.success && response.data) {
        setSelectedTicket(response.data)
        setTicketMessages(response.data.messages || [])
      } else {
        setErrorMessage(t("tickets.notFound"))
        setSelectedTicket(null)
      }
    } catch (error) {
      console.error("Error searching ticket:", error)
      setErrorMessage(t("tickets.notFound"))
      setSelectedTicket(null)
    } finally {
      setIsSearching(false)
    }
  }

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedTicket) return

    setIsSendingMessage(true)
    try {
      const response = await addTicketMessage(selectedTicket.ticket_number, {
        message: newMessage,
        sender: "customer",
      })

      if (response.success) {
        // Reload ticket to get updated messages
        const updatedTicket = await getTicketByNumber(selectedTicket.ticket_number)
        if (updatedTicket.success && updatedTicket.data) {
          setSelectedTicket(updatedTicket.data)
          setTicketMessages(updatedTicket.data.messages || [])
        }
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setErrorMessage(t("tickets.messageSendError"))
    } finally {
      setIsSendingMessage(false)
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Open":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300"
      case "Medium":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
      case "Low":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Closed":
        return <CheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      case "In Progress":
        return <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case "Open":
        return <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  }

  // Translate status
  const translateStatus = (status: string) => {
    const key = `tickets.status.${status.toLowerCase().replace(" ", "")}`
    return t(key)
  }

  // Translate priority
  const translatePriority = (priority: string) => {
    const key = `tickets.priority.${priority.toLowerCase()}`
    return t(key)
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
              <span>{t("tickets.backToHome")}</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {t("tickets.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
              {t("tickets.description")}
            </p>
          </div>
        </section>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300 px-4 py-3 rounded relative mx-4 mt-4 max-w-6xl mx-auto">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 px-4 py-3 rounded relative mx-4 mt-4 max-w-6xl mx-auto">
            <span className="block sm:inline">{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage("")} 
              className={`absolute top-0 bottom-0 ${isRTL ? 'right-0' : 'left-0'} px-4`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Content */}
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Submit & Search */}
              <div className="lg:col-span-1 space-y-6">
                {/* Submit Ticket Button */}
                <button
                  onClick={() => setShowForm(!showForm)}
                  className={`w-full bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg px-6 py-3 font-semibold hover:from-blue-600 hover:to-blue-800 transition-all flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Plus className="w-5 h-5" />
                  {showForm ? t("tickets.hideForm") : t("tickets.submitNew")}
                </button>

                {/* Submit Form */}
                {showForm && (
                  <Card>
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-xl font-bold text-foreground mb-4">
                          {t("tickets.formTitle")}
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("tickets.form.name")}
                          </label>
                          <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t("tickets.form.namePlaceholder")}
                            className="bg-background border-border"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("tickets.form.email")}
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t("tickets.form.emailPlaceholder")}
                            className="bg-background border-border"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("tickets.form.phone")}
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={t("tickets.form.phonePlaceholder")}
                            className="bg-background border-border"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("tickets.form.link")}
                          </label>
                          <Input
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder={t("tickets.form.linkPlaceholder")}
                            className="bg-background border-border"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("tickets.form.subject")}
                          </label>
                          <Input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder={t("tickets.form.subjectPlaceholder")}
                            className="bg-background border-border"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("tickets.form.category")}
                          </label>
                          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue placeholder={t("tickets.form.categoryPlaceholder")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Technical Support">{t("tickets.categories.technical")}</SelectItem>
                              <SelectItem value="Consultation">{t("tickets.categories.consultation")}</SelectItem>
                              <SelectItem value="Design Services">{t("tickets.categories.design")}</SelectItem>
                              <SelectItem value="Web Development">{t("tickets.categories.webdev")}</SelectItem>
                              <SelectItem value="API Support">{t("tickets.categories.api")}</SelectItem>
                              <SelectItem value="E-commerce">{t("tickets.categories.ecommerce")}</SelectItem>
                              <SelectItem value="Account Management">{t("tickets.categories.account")}</SelectItem>
                              <SelectItem value="Billing">{t("tickets.categories.billing")}</SelectItem>
                              <SelectItem value="Training">{t("tickets.categories.training")}</SelectItem>
                              <SelectItem value="Feature Request">{t("tickets.categories.feature")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("tickets.form.priority")}
                          </label>
                          <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">{t("tickets.priority.low")}</SelectItem>
                              <SelectItem value="Medium">{t("tickets.priority.medium")}</SelectItem>
                              <SelectItem value="High">{t("tickets.priority.high")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("tickets.form.message")}
                          </label>
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={t("tickets.form.messagePlaceholder")}
                            className="bg-background border-border min-h-24"
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-l from-blue-500 to-blue-700 text-white rounded-lg"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                              {t("tickets.submitting")}
                            </>
                          ) : (
                            t("tickets.submit")
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Search Section */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">
                      {t("tickets.searchTitle")}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("tickets.ticketNumber")}
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={searchNumber}
                            onChange={(e) => setSearchNumber(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            placeholder={t("tickets.searchPlaceholder")}
                            className="bg-background border-border flex-1"
                          />
                          <Button 
                            onClick={handleSearch} 
                            disabled={isSearching}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                          >
                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("tickets.searchHint")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Ticket Details */}
              <div className="lg:col-span-2">
                {selectedTicket ? (
                  <Card>
                    <CardContent className="p-6 md:p-8">
                      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                          {t("tickets.detailsTitle")}
                        </h2>
                        <button
                          onClick={() => {
                            setSelectedTicket(null)
                            setTicketMessages([])
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      {isLoadingMessages ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Ticket Header */}
                          <div className="pb-6 border-b border-border">
                            <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {t("tickets.ticketNumber")}
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                  {selectedTicket.ticket_number}
                                </p>
                              </div>
                              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                                  {translateStatus(selectedTicket.status)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                                  {translatePriority(selectedTicket.priority)}
                                </span>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                              {selectedTicket.subject}
                            </h3>
                          </div>

                          {/* Ticket Info Grid */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">{t("tickets.submittedBy")}</p>
                              <p className="font-medium text-foreground">{selectedTicket.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">{t("tickets.form.email")}</p>
                              <p className="font-medium text-foreground">{selectedTicket.email}</p>
                            </div>
                            {selectedTicket.phone && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">{t("tickets.form.phone")}</p>
                                <p className="font-medium text-foreground">{selectedTicket.phone}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">{t("tickets.category")}</p>
                              <p className="font-medium text-foreground">{selectedTicket.category}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">{t("tickets.createdAt")}</p>
                              <p className="font-medium text-foreground">
                                {new Date(selectedTicket.created_at).toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">{t("tickets.updatedAt")}</p>
                              <p className="font-medium text-foreground">
                                {new Date(selectedTicket.updated_at).toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
                              </p>
                            </div>
                          </div>

                          {selectedTicket.link && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">{t("tickets.form.link")}</p>
                              <a 
                                href={selectedTicket.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all"
                              >
                                {selectedTicket.link}
                              </a>
                            </div>
                          )}

                          {/* Messages */}
                          <div className="bg-background rounded-lg p-4 border border-border">
                            <p className="text-sm font-medium text-foreground mb-4">{t("tickets.messages")}</p>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {ticketMessages.length === 0 ? (
                                <p className="text-muted-foreground text-sm">{t("tickets.noMessages")}</p>
                              ) : (
                                ticketMessages.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`p-3 rounded-lg ${
                                      msg.sender === "customer"
                                        ? `bg-blue-50 dark:bg-blue-950/20 ${isRTL ? 'mr-8' : 'ml-8'}`
                                        : `bg-gray-50 dark:bg-gray-900/20 ${isRTL ? 'ml-8' : 'mr-8'}`
                                    }`}
                                  >
                                    <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                      <span className="text-xs font-medium text-foreground">
                                        {msg.sender === "customer" ? t("tickets.you") : t("tickets.supportTeam")}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(msg.created_at).toLocaleString(isRTL ? "ar-SA" : "en-US")}
                                      </span>
                                    </div>
                                    <p className="text-sm text-foreground">{msg.message}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Add Message Form */}
                          {selectedTicket.status !== "Closed" && (
                            <form onSubmit={handleSendMessage} className="bg-background rounded-lg p-4 border border-border">
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {t("tickets.addMessage")}
                              </label>
                              <Textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={t("tickets.messagePlaceholder")}
                                className="bg-card border-border mb-3"
                                rows={3}
                              />
                              <Button
                                type="submit"
                                disabled={isSendingMessage || !newMessage.trim()}
                                className={`bg-blue-600 text-white hover:bg-blue-700 ${isRTL ? 'flex-row-reverse' : ''}`}
                              >
                                {isSendingMessage ? (
                                  <>
                                    <Loader2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                                    {t("tickets.sending")}
                                  </>
                                ) : (
                                  <>
                                    <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                    {t("tickets.send")}
                                  </>
                                )}
                              </Button>
                            </form>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">{t("tickets.noTicketSelected")}</h3>
                      <p className="text-muted-foreground">{t("tickets.searchToView")}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}