"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { useState } from "react"

// واجهات برمجية API مختلفة لتوضيح الأساليب المختلفة
// Different API interfaces to demonstrate different styles

interface APIEndpoint {
  id: number
  method: "GET" | "POST" | "PUT" | "DELETE"
  title: string // اسم نقطة النهاية
  titleAr: string // اسم النقطة بالعربية
  description: string // الوصف
  descriptionAr: string // الوصف بالعربية
  endpoint: string // مسار المكالمة
  params?: {
    name: string
    type: string
    required: boolean
    description: string
    descriptionAr: string
  }[]
  requestBody?: string // جسم الطلب
  responseExample: string // مثال الرد
  statusCodes: {
    code: number
    message: string
    messageAr: string
  }[]
  category: string // فئة المكالمة
  categoryAr: string // فئة المكالمة بالعربية
}

const apiEndpoints: APIEndpoint[] = [
  // ==================== المستخدمين ====================
  // ==================== Users ====================
  {
    id: 1,
    method: "GET",
    title: "Get All Users",
    titleAr: "الحصول على جميع المستخدمين",
    description: "Retrieve a list of all registered users",
    descriptionAr: "استرجاع قائمة بجميع المستخدمين المسجلين",
    endpoint: "/api/users",
    params: [
      {
        name: "page",
        type: "integer",
        required: false,
        description: "Page number for pagination",
        descriptionAr: "رقم الصفحة للتصفح",
      },
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Number of records per page",
        descriptionAr: "عدد السجلات لكل صفحة",
      },
      {
        name: "search",
        type: "string",
        required: false,
        description: "Search by user name or email",
        descriptionAr: "البحث عن طريق الاسم أو البريد الإلكتروني",
      },
    ],
    responseExample: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "role": "admin",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}`,
    statusCodes: [
      { code: 200, message: "Success", messageAr: "نجح" },
      { code: 401, message: "Unauthorized", messageAr: "غير مصرح" },
      { code: 500, message: "Server Error", messageAr: "خطأ في الخادم" },
    ],
    category: "Users",
    categoryAr: "المستخدمين",
  },
  {
    id: 2,
    method: "POST",
    title: "Create User",
    titleAr: "إنشاء مستخدم جديد",
    description: "Create a new user account",
    descriptionAr: "إنشاء حساب مستخدم جديد",
    endpoint: "/api/users",
    requestBody: `{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "SecurePassword123!",
  "role": "user"
}`,
    responseExample: `{
  "success": true,
  "message": "User created successfully",
  "messageAr": "تم إنشاء المستخدم بنجاح",
  "data": {
    "id": 101,
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "role": "user",
    "createdAt": "2025-12-03T12:00:00Z"
  }
}`,
    statusCodes: [
      { code: 201, message: "Created", messageAr: "تم الإنشاء" },
      { code: 400, message: "Bad Request", messageAr: "طلب غير صحيح" },
      { code: 409, message: "User Already Exists", messageAr: "المستخدم موجود بالفعل" },
    ],
    category: "Users",
    categoryAr: "المستخدمين",
  },
  {
    id: 3,
    method: "GET",
    title: "Get User by ID",
    titleAr: "الحصول على مستخدم برقمه",
    description: "Retrieve a specific user by their ID",
    descriptionAr: "استرجاع مستخدم معين برقمه",
    endpoint: "/api/users/:id",
    params: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "User ID (UUID)",
        descriptionAr: "رقم المستخدم (معرف فريد)",
      },
    ],
    responseExample: `{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "role": "admin",
    "lastLogin": "2025-12-03T11:45:00Z",
    "createdAt": "2025-01-15T10:30:00Z",
    "profile": {
      "avatar": "https://example.com/avatars/ahmed.jpg",
      "bio": "مهندس برمجيات متخصص"
    }
  }
}`,
    statusCodes: [
      { code: 200, message: "Success", messageAr: "نجح" },
      { code: 404, message: "Not Found", messageAr: "لم يتم العثور عليه" },
    ],
    category: "Users",
    categoryAr: "المستخدمين",
  },

  // ==================== المشاريع ====================
  // ==================== Projects ====================
  {
    id: 4,
    method: "GET",
    title: "Get All Projects",
    titleAr: "الحصول على جميع المشاريع",
    description: "Retrieve all projects with filters and sorting",
    descriptionAr: "استرجاع جميع المشاريع مع إمكانية التصفية والترتيب",
    endpoint: "/api/projects",
    params: [
      {
        name: "status",
        type: "string",
        required: false,
        description: "Filter by project status (active, completed, on-hold)",
        descriptionAr: "التصفية حسب حالة المشروع (نشط، مكتمل، معلق)",
      },
      {
        name: "userId",
        type: "string",
        required: false,
        description: "Filter projects by user ID",
        descriptionAr: "تصفية المشاريع حسب رقم المستخدم",
      },
      {
        name: "sortBy",
        type: "string",
        required: false,
        description: "Sort by (name, date, budget)",
        descriptionAr: "الترتيب حسب (الاسم، التاريخ، الميزانية)",
      },
    ],
    responseExample: `{
  "success": true,
  "data": [
    {
      "id": "proj_123",
      "title": "تطوير موقع العملاء",
      "titleAr": "تطوير موقع العملاء",
      "description": "بناء موقع ويب للعملاء",
      "status": "active",
      "statusAr": "نشط",
      "budget": 5000,
      "currency": "USD",
      "startDate": "2025-11-01T00:00:00Z",
      "endDate": "2026-02-01T00:00:00Z",
      "progress": 45,
      "team": ["user_1", "user_2"]
    }
  ],
  "count": 12
}`,
    statusCodes: [
      { code: 200, message: "Success", messageAr: "نجح" },
      { code: 400, message: "Invalid Filter", messageAr: "عامل تصفية غير صحيح" },
    ],
    category: "Projects",
    categoryAr: "المشاريع",
  },
  {
    id: 5,
    method: "POST",
    title: "Create Project",
    titleAr: "إنشاء مشروع جديد",
    description: "Create a new project",
    descriptionAr: "إنشاء مشروع جديد",
    endpoint: "/api/projects",
    requestBody: `{
  "title": "تطوير تطبيق جوال",
  "description": "تطبيق جوال للتجارة الإلكترونية",
  "budget": 15000,
  "currency": "USD",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-06-01T00:00:00Z",
  "team": ["user_1", "user_2", "user_3"],
  "technologies": ["React Native", "Node.js", "MongoDB"]
}`,
    responseExample: `{
  "success": true,
  "message": "Project created successfully",
  "messageAr": "تم إنشاء المشروع بنجاح",
  "data": {
    "id": "proj_456",
    "title": "تطوير تطبيق جوال",
    "status": "active",
    "progress": 0,
    "createdAt": "2025-12-03T12:00:00Z"
  }
}`,
    statusCodes: [
      { code: 201, message: "Created", messageAr: "تم الإنشاء" },
      { code: 400, message: "Invalid Data", messageAr: "بيانات غير صحيحة" },
    ],
    category: "Projects",
    categoryAr: "المشاريع",
  },

  // ==================== الخدمات ====================
  // ==================== Services ====================
  {
    id: 6,
    method: "GET",
    title: "Get All Services",
    titleAr: "الحصول على جميع الخدمات",
    description: "Retrieve all available services",
    descriptionAr: "استرجاع جميع الخدمات المتاحة",
    endpoint: "/api/services",
    params: [
      {
        name: "category",
        type: "string",
        required: false,
        description: "Filter by service category",
        descriptionAr: "التصفية حسب فئة الخدمة",
      },
    ],
    responseExample: `{
  "success": true,
  "data": [
    {
      "id": "srv_001",
      "name": "تطوير الويب",
      "nameAr": "تطوير الويب",
      "description": "خدمات تطوير مواقع الويب",
      "price": 100,
      "currency": "USD",
      "duration": "30 days",
      "category": "development"
    }
  ],
  "total": 6
}`,
    statusCodes: [{ code: 200, message: "Success", messageAr: "نجح" }],
    category: "Services",
    categoryAr: "الخدمات",
  },

  // ==================== التقارير ====================
  // ==================== Reports ====================
  {
    id: 7,
    method: "GET",
    title: "Get Project Report",
    titleAr: "الحصول على تقرير المشروع",
    description: "Generate and retrieve project reports",
    descriptionAr: "إنشاء واسترجاع تقارير المشروع",
    endpoint: "/api/projects/:id/reports",
    params: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "Project ID",
        descriptionAr: "رقم المشروع",
      },
      {
        name: "period",
        type: "string",
        required: false,
        description: "Report period (weekly, monthly, yearly)",
        descriptionAr: "فترة التقرير (أسبوعي، شهري، سنوي)",
      },
    ],
    responseExample: `{
  "success": true,
  "data": {
    "projectId": "proj_123",
    "period": "monthly",
    "metrics": {
      "tasksCompleted": 45,
      "tasksRemaining": 55,
      "budget": {
        "allocated": 10000,
        "spent": 4500,
        "remaining": 5500
      },
      "teamProductivity": 87.5,
      "clientSatisfaction": 9.2
    },
    "generatedAt": "2025-12-03T12:00:00Z"
  }
}`,
    statusCodes: [
      { code: 200, message: "Success", messageAr: "نجح" },
      { code: 404, message: "Project Not Found", messageAr: "المشروع غير موجود" },
    ],
    category: "Reports",
    categoryAr: "التقارير",
  },

  // ==================== المصادقة ====================
  // ==================== Authentication ====================
  {
    id: 8,
    method: "POST",
    title: "User Login",
    titleAr: "تسجيل الدخول",
    description: "Authenticate user and receive access token",
    descriptionAr: "مصادقة المستخدم واستلام رمز الوصول",
    endpoint: "/api/auth/login",
    requestBody: `{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}`,
    responseExample: `{
  "success": true,
  "message": "Login successful",
  "messageAr": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": {
      "id": "user_123",
      "name": "أحمد محمد",
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}`,
    statusCodes: [
      { code: 200, message: "Login Successful", messageAr: "تم تسجيل الدخول بنجاح" },
      { code: 401, message: "Invalid Credentials", messageAr: "بيانات دخول غير صحيحة" },
    ],
    category: "Authentication",
    categoryAr: "المصادقة",
  },
]

// مكون عرض نقطة نهاية API واحدة
// Component to display a single API endpoint
function APIEndpointCard({ endpoint }: { endpoint: APIEndpoint }) {
  const [copiedRequest, setCopiedRequest] = useState(false)
  const [copiedResponse, setCopiedResponse] = useState(false)

  // دالة نسخ النص
  // Function to copy text
  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // تحديد لون الزر حسب نوع الطلب
  // Set button color based on request type
  const methodColors = {
    GET: "bg-green-500/10 text-green-700 border-green-200 dark:border-green-800",
    POST: "bg-blue-500/10 text-blue-700 border-blue-200 dark:border-blue-800",
    PUT: "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:border-yellow-800",
    DELETE: "bg-red-500/10 text-red-700 border-red-200 dark:border-red-800",
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors">
      {/* رأس المكون */}
      {/* Component Header */}
      <div className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent p-6 border-b border-border">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">{endpoint.titleAr}</h3>
            <p className="text-sm text-muted-foreground">{endpoint.title}</p>
          </div>
          <div className={`px-4 py-2 rounded-lg font-mono font-bold border text-sm ${methodColors[endpoint.method]}`}>
            {endpoint.method}
          </div>
        </div>
        <p className="text-foreground mb-2">{endpoint.descriptionAr}</p>
        <p className="text-muted-foreground text-sm">{endpoint.description}</p>
      </div>

      {/* محتوى المكون */}
      {/* Component Content */}
      <div className="p-6 space-y-6">
        {/* نقطة النهاية */}
        {/* Endpoint */}
        <div>
          <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-blue-600">📍</span> نقطة النهاية / Endpoint
          </h4>
          <div className="bg-muted p-3 rounded-lg font-mono text-sm overflow-x-auto text-foreground">
            {endpoint.endpoint}
          </div>
        </div>

        {/* المعاملات */}
        {/* Parameters */}
        {endpoint.params && endpoint.params.length > 0 && (
          <div>
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-blue-600">⚙️</span> المعاملات / Parameters
            </h4>
            <div className="space-y-3">
              {endpoint.params.map((param, idx) => (
                <div key={idx} className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-mono font-bold text-blue-600">{param.name}</code>
                    <span
                      className={`text-xs px-2 py-1 rounded ${param.required ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}
                    >
                      {param.required ? "مطلوب / Required" : "اختياري / Optional"}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">
                      {param.type}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mb-1">{param.descriptionAr}</p>
                  <p className="text-xs text-muted-foreground">{param.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* جسم الطلب */}
        {/* Request Body */}
        {endpoint.requestBody && (
          <div>
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="text-blue-600">📤</span> جسم الطلب / Request Body
            </h4>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
                <code>{endpoint.requestBody}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(endpoint.requestBody!, setCopiedRequest)}
                className="absolute top-2 left-2 p-2 hover:bg-background rounded transition-colors"
              >
                {copiedRequest ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* مثال الرد */}
        {/* Response Example */}
        <div>
          <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-green-600">📥</span> مثال الرد / Response Example
          </h4>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
              <code>{endpoint.responseExample}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(endpoint.responseExample, setCopiedResponse)}
              className="absolute top-2 left-2 p-2 hover:bg-background rounded transition-colors"
            >
              {copiedResponse ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* رموز الحالة */}
        {/* Status Codes */}
        <div>
          <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="text-blue-600">✅</span> رموز الحالة / Status Codes
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {endpoint.statusCodes.map((status, idx) => (
              <div key={idx} className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">{status.code}</span>
                  <span className="text-sm text-foreground">{status.messageAr}</span>
                </div>
                <p className="text-xs text-muted-foreground">{status.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// دالة تجميع نقاط النهاية حسب الفئة
// Function to group endpoints by category
function groupByCategory(endpoints: APIEndpoint[]) {
  return endpoints.reduce(
    (acc, endpoint) => {
      const category = endpoint.categoryAr
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(endpoint)
      return acc
    },
    {} as Record<string, APIEndpoint[]>,
  )
}

export default function APIsPage() {
  const groupedEndpoints = groupByCategory(apiEndpoints)
  const categories = Object.keys(groupedEndpoints)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* قسم البطل */}
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">واجهات برمجية API</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
            توثيق شامل لجميع نقاط النهاية المتاحة مع أمثلة عملية وشرح تفصيلي بالعربية
          </p>
        </div>
      </section>

      {/* قسم التنقل بين الفئات */}
      {/* Categories Navigation */}
      <section className="sticky top-20 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex gap-2 overflow-x-auto py-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  document.getElementById(category)?.scrollIntoView({ behavior: "smooth" })
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap text-sm font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* جميع نقاط النهاية مجمعة حسب الفئة */}
      {/* All Endpoints Grouped by Category */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl space-y-12">
          {categories.map((category) => (
            <div key={category} id={category}>
              {/* عنوان الفئة */}
              {/* Category Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 pb-4 border-b-2 border-blue-600">
                {category}
              </h2>

              {/* شبكة نقاط النهاية */}
              {/* Endpoints Grid */}
              <div className="space-y-6">
                {groupedEndpoints[category].map((endpoint) => (
                  <APIEndpointCard key={endpoint.id} endpoint={endpoint} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* قسم المعلومات العامة */}
      {/* General Information Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">معلومات عامة / General Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* رؤوس المصادقة */}
            {/* Authentication Headers */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span>🔒</span> المصادقة / Authentication
              </h3>
              <p className="text-muted-foreground mb-3">جميع الطلبات تتطلب رمز المصادقة (Authentication Token)</p>
              <div className="bg-muted p-3 rounded-lg font-mono text-sm overflow-x-auto text-foreground">
                Authorization: Bearer {"<token>"}
              </div>
            </div>

            {/* معايير الخطأ */}
            {/* Error Conventions */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span>⚠️</span> معايير الأخطاء / Error Conventions
              </h3>
              <p className="text-muted-foreground mb-3">جميع الأخطاء تتبع صيغة موحدة</p>
              <div className="bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto text-foreground">
                {`{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}`}
              </div>
            </div>

            {/* حدود المعدل */}
            {/* Rate Limiting */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span>⏱️</span> حدود المعدل / Rate Limiting
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <span className="text-foreground">100 طلب / دقيقة</span> (100 requests/minute)
                </li>
                <li>
                  • <span className="text-foreground">10,000 طلب / ساعة</span> (10,000 requests/hour)
                </li>
              </ul>
            </div>

            {/* تنسيق التاريخ */}
            {/* Date Format */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span>📅</span> تنسيق التاريخ / Date Format
              </h3>
              <p className="text-muted-foreground mb-2">جميع التواريخ بصيغة ISO 8601 UTC</p>
              <div className="bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto text-foreground">
                2025-12-03T12:00:00Z
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
