// 📄 lib/services.ts
import { apiGet, apiPost, apiPatch, apiDelete, apiPostForm } from "./api";

// ====================== SERVICES SECTION ======================


// http://127.0.0.1:1919/api/about-us/all?lang=ar
/**
 * About Us – Get all sections
 * GET /api/about-us/all
 */
export const getAboutUsAll = (lang = "ar") =>
  apiGet("/about-us/all", lang);

/**
 * Services – Get all service categories
 * GET /api/services/categories
 */
export const getServiceCategories = () =>
  apiGet("/services/categories");

/**
 * Services – Get all services (with optional filtering)
 * GET /api/services/all
 */
export const getServices = (params?: {
  category_id?: number;
  search?: string;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/services/all${queryString}`);
};

/**
 * Services – Get single service by ID
 * GET /api/services/{id}
 */
export const getServiceById = (id: number) =>
  apiGet(`/services/${id}`);


/**
 * Service Requests – Create a new service request
 * POST /api/services/requests/create
 */
export const createServiceRequest = (data: {
  service_id: number;
  details?: string;
  attachments?: File[];
}) => {
  const formData = new FormData();
  
  // Always append service_id
  formData.append("service_id", data.service_id.toString());
  
  // Append details if provided
  if (data.details) {
    formData.append("details", data.details);
  }
  
  // Append attachments if provided
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file, index) => {
      // Use attachments[] format for Laravel array handling
      formData.append(`attachments[]`, file);
    });
  }
  
  return apiPostForm("/services/requests/create", formData);
};

/**
 * Service Requests – Get current user's service requests
 * GET /api/services/requests/my-requests
 */
export const getMyServiceRequests = (params?: {
  status?: string;
  page?: number;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/services/requests/my-requests${queryString}`);
};

/**
 * Service Requests – Get request by request number
 * GET /api/services/requests/number/{request_number}
 */
export const getServiceRequestByNumber = (requestNumber: string) =>
  apiGet(`/services/requests/number/${requestNumber}`);

/**
 * Service Requests – Cancel request by request number
 * POST /api/services/requests/{request_number}/cancel
 */
export const cancelServiceRequest = (requestNumber: string) =>
  apiPost(`/services/requests/${requestNumber}/cancel`, {});

/**
 * Service Requests – Rate service by request number
 * POST /api/services/requests/{request_number}/rate
 */
export const rateService = (requestNumber: string, data: {
  rating: number;
  review?: string;
}) =>
  apiPost(`/services/requests/${requestNumber}/rate`, data);

// ====================== SOLUTIONS SECTION ======================

/**
 * Solutions – Get all tech solutions (with optional filtering)
 * GET /api/solutions/all
 */
export const getSolutions = (params?: {
  technology?: string;
  search?: string;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/solutions/all${queryString}`);
};

/**
 * Solutions – Get single solution by ID
 * GET /api/solutions/{id} 
 */
export const getSolutionById = (id: number) =>
  apiGet(`/solutions/${id}`);

// ====================== PROJECTS SECTION ======================

/**
 * Projects – Get all projects
 * GET /api/projects/all
 */
export const getProjects = () => apiGet("/projects/all");

/**
 * Projects – Get single project by ID
 * GET /api/projects/{id}
 */
export const getProjectById = (id: number) => apiGet(`/projects/${id}`);

/**
 * Projects – Filter projects by category, client, or year
 * GET /api/projects/filter
 */
export const filterProjects = (params?: {
  category?: string;
  client?: string;
  year?: number;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/projects/filter${queryString}`);
};

/**
 * Projects – Apply for a project
 * POST /api/projects/{id}/apply
 */
export const applyForProject = (id: number, data: {
  name: string;
  phone: string;
  email?: string;
  expect_mony?: number;
}) => apiPost(`/projects/${id}/apply`, data);

// ====================== POLICIES SECTION ======================

/**
 * Policies – Get all policy types
 * GET /api/policies/types
 */
export const getPolicyTypes = () => apiGet("/policies/types");

/**
 * Policies – Get policies by type
 * GET /api/policies/type/{type}
 */
export const getPoliciesByType = (type: string) => 
  apiGet(`/policies/type/${type}`);

// ====================== TICKETS SECTION ======================

/**
 * Tickets – Get all tickets (paginated)
 * GET /api/tickets
 */
export const getTickets = (params?: {
  status?: string;
  category?: string;
  priority?: string;
  per_page?: number;
  page?: number;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/tickets${queryString}`);
};

/**
 * Tickets – Get single ticket by ticket number
 * GET /api/tickets/{ticket_number}
 */
export const getTicketByNumber = (ticketNumber: string) => 
  apiGet(`/tickets/${ticketNumber}`);

/**
 * Tickets – Create new ticket
 * POST /api/tickets
 */
export const createTicket = (data: {
  name: string;
  email: string;
  phone?: string;
  link?: string;
  subject: string;
  category: string;
  priority?: 'Low' | 'Medium' | 'High';
  message: string;
  attachments?: string[];
}) => apiPost('/tickets', data);

/**
 * Tickets – Add message to ticket
 * POST /api/tickets/{ticket_number}/messages
 */
export const addTicketMessage = (ticketNumber: string, data: {
  message: string;
  sender: 'customer' | 'admin';
  attachments?: string[];
}) => apiPost(`/tickets/${ticketNumber}/messages`, data);

/**
 * Tickets – Get ticket messages
 * GET /api/tickets/{ticket_number}/messages
 */
export const getTicketMessages = (ticketNumber: string) =>
  apiGet(`/tickets/${ticketNumber}/messages`);

/**
 * Tickets – Update ticket status
 * PATCH /api/tickets/{ticket_number}/status
 */
export const updateTicketStatus = (ticketNumber: string, data: {
  status: 'Open' | 'In Progress' | 'Closed';
}) => apiPatch(`/tickets/${ticketNumber}/status`, data);

/**
 * Tickets – Delete ticket
 * DELETE /api/tickets/{ticket_number}
 */
export const deleteTicket = (ticketNumber: string) =>
  apiDelete(`/tickets/${ticketNumber}`);

// ====================== JOBS SECTION ======================

/**
 * Job Categories – Get all job categories
 * GET /api/job-categories
 */
export const getJobCategories = (params?: {
  search?: string;
  per_page?: number;
  page?: number;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/job-categories${queryString}`);
};

/**
 * Job Categories – Get single category with active job offers
 * GET /api/job-categories/{id}
 */
export const getJobCategoryById = (id: number) =>
  apiGet(`/job-categories/${id}`);

/**
 * Job Offers – Get all active job offers
 * GET /api/job-offers
 */
export const getJobOffers = (params?: {
  category_id?: number;
  type?: string;
  location?: string;
  search?: string;
  min_salary?: number;
  max_salary?: number;
  per_page?: number;
  page?: number;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/job-offers${queryString}`);
};

/**
 * Job Offers – Get single job offer details
 * GET /api/job-offers/{id}
 */
export const getJobOfferById = (id: number) => apiGet(`/job-offers/${id}`);

/**
 * Job Offers – Apply for a job
 * POST /api/job-offers/{id}/apply
 */
export const applyForJob = (id: number, data: JobApplicationFormData) => {
  // Use FormData for file uploads
  const formData = new FormData();
  
  // Append all fields to FormData
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'cv' && value instanceof File) {
      formData.append(key, value);
    } else if (key === 'attachments' && Array.isArray(value)) {
      value.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`attachments[${index}]`, file);
        }
      });
    } else if (key === 'skills' || key === 'languages') {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      }
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  return apiPostForm(`/job-offers/${id}/apply`, formData);
};

/**
 * Job Applications – Get all job applications
 * GET /api/job-applications
 */
export const getJobApplications = (params?: {
  status?: string;
  job_offer_id?: number;
  user_id?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
  per_page?: number;
  page?: number;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/job-applications${queryString}`);
};

/**
 * Job Applications – Get single application
 * GET /api/job-applications/{id}
 */
export const getJobApplicationById = (id: number) =>
  apiGet(`/job-applications/${id}`);

/**
 * Job Applications – Update application status
 * PATCH /api/job-applications/{id}/status
 */
export const updateJobApplicationStatus = (id: number, data: {
  status: JobApplicationStatus;
  admin_notes?: string;
  reviewed_by?: number;
}) => apiPatch(`/job-applications/${id}/status`, data);

// ====================== PRICING PLANS SECTION ======================

/**
 * Pricing Plans – Get all pricing plans
 * GET /api/pricing-plans
 */
export const getPricingPlans = () => apiGet("/pricing-plans");

// /**
//  * Pricing Plans – Get single plan by key
//  * GET /api/pricing-plans/{key}
//  */
// export const getPricingPlanByKey = (key: string) => 
//   apiGet(`/pricing-plans/${key}`);

/**
 * Pricing Plans – Apply for a pricing plan
 * POST /api/pricing-plans/{id}/apply
 */
// export const applyForPricingPlan = (id: string, data: any) =>
//   apiPost(`/pricing-plans/${id}/apply`, data);

export const applyForPricingPlan = (id: number, data: {
  name: string;
  phone: string;
  email?: string;
  expect_mony?: number;
}) => apiPost(`/pr/${id}/apply`, data);

 
/**
 * Pricing Plans – Get single plan by ID
 * GET /api/pricing-plans/{id}
 */
export const getPricingPlanById = (id: number) => 
  apiGet(`/pricing-plans/${id}`);
// ====================== NEWSLETTER SECTION ======================

/**
 * Newsletter – Subscribe to newsletter
 * POST /api/newsletter/subscribe
 */
export const subscribeToNewsletter = (data: {
  email: string;
  source?: string;
}) => apiPost("/newsletter/subscribe", data);



  
// ====================== ORGANIZATION SECTION ======================

/**
 * Organization – Get organization basic info
 * GET /api/organization
 * @param {string} lang - Language (en/ar)
 * @param {number} organization_id - Organization ID
 */
export const getOrganization = (params?: {
  lang?: string;
  organization_id?: number;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/organization${queryString}`);
};

/**
 * Organization Branches – Get all branches
 * GET /api/organization/branches
 * @param {string} lang - Language (en/ar)
 * @param {number} organization_id - Organization ID
 * @param {string} status - Branch status (active/inactive)
 * @param {string} country - Filter by country
 * @param {string} city - Filter by city
 */
export const getOrganizationBranches = (params?: {
  lang?: string;
  organization_id?: number;
  status?: 'active' | 'inactive';
  country?: string;
  city?: string;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/organization/branches${queryString}`);
};

/**
 * Organization Branch – Get single branch details
 * GET /api/organization/branches/{id}
 * @param {number} id - Branch ID
 * @param {string} lang - Language (en/ar)
 */
export const getOrganizationBranch = (id: number, params?: {
  lang?: string;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/organization/branches/${id}${queryString}`);
};

 

/**
 * Organization – Get contact information
 * GET /api/organization/contact-info
 * @param {string} lang - Language (en/ar)
 * @param {number} organization_id - Organization ID
 */
export const getOrganizationContactInfo = (params?: {
  lang?: string;
  organization_id?: number;
}) => {
  const queryString = params 
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return apiGet(`/organization/contact-info${queryString}`);
};

/**
 * Organization Branches – Search branches by location
 * POST /api/organization/search-branches
 * @param {object} data - Search parameters
 * @param {number} data.latitude - User latitude
 * @param {number} data.longitude - User longitude
 * @param {number} data.radius - Search radius in km
 * @param {number} data.organization_id - Organization ID
 */
export const searchOrganizationBranches = (data: {
  latitude: number;
  longitude: number;
  radius?: number;
  organization_id?: number;
}) => apiPost('/organization/search-branches', data);


// 📄 lib/services.ts

// ====================== CONTACT SECTION ======================

/**
 * Contact – Submit contact form
 * POST /api/contact/submit
 * @param {object} data - Contact form data
 * @param {string} data.fullname - Full name
 * @param {string} data.email_phone - Email or phone number
 * @param {string} data.details - Message details
 * @param {string} data.subject - Optional subject
 * @param {string} data.source - Source of contact (website, app, etc.)
 * @param {File} data.attachment - Optional attachment file
 */
export const submitContact = (data: {
  fullname: string;
  email_phone: string;
  details: string;
  subject?: string;
  source?: string;
  attachment?: File;
}) => {
  if (data.attachment) {
    const formData = new FormData();
    
    // Append all fields to FormData
    formData.append('fullname', data.fullname);
    formData.append('email_phone', data.email_phone);
    formData.append('details', data.details);
    
    if (data.subject) {
      formData.append('subject', data.subject);
    }
    
    if (data.source) {
      formData.append('source', data.source);
    }
    
    formData.append('attachment', data.attachment);
    
    return apiPostForm('/contact/submit', formData);
  } else {
    return apiPost('/contact/submit', {
      fullname: data.fullname,
      email_phone: data.email_phone,
      details: data.details,
      subject: data.subject,
      source: data.source,
    });
  }
};

/**
 * Contact – Check status by tracking code
 * GET /api/contact/status/{tracking_code}
 * @param {string} trackingCode - Tracking code from submission
 */
export const checkContactStatus = (trackingCode: string) =>
  apiGet(`/contact/status/${trackingCode}`);

// ====================== CONTACT TYPES ======================

export interface ContactSubmission {
  id: number;
  fullname: string;
  email_phone: string;
  details: string;
  subject?: string;
  source?: string;
  ip?: string;
  read: boolean;
  tracking_code: string;
  contact_type: 'email' | 'phone' | 'other';
  status: 'new' | 'in_progress' | 'resolved' | 'spam';
  attachment?: string;
  metadata?: {
    user_agent?: string;
    page_url?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: {
    tracking_code: string;
    id: number;
    submitted_at: string;
    estimated_response: string;
  };
}

export interface ContactStatusResponse {
  success: boolean;
  data: {
    tracking_code: string;
    status: string;
    submitted_at: string;
    last_updated: string;
    admin_notes?: string;
  };
}
// ====================== TYPES ======================

// Common types
export interface LocalizedField {
  ar?: string;
  en?: string;
}

export interface LocalizedMessage {
  ar: string;
  en: string;
}

// Paginated response types
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Solution types
export interface TechSolution {
  id: number;
  title: LocalizedField;
  overview: LocalizedField;
  technologies: string[];
  duration: LocalizedField;
  investment: string;
  roi: string;
  challenges?: LocalizedField[];
  benefits?: LocalizedField[];
  related_solutions?: Array<{
    icon: string | null;
    title: LocalizedField;
  }>;
}

// Project types
export interface TechProject {
  id: number;
  title: LocalizedField;
  short_description: LocalizedField;
  main_image: string;
  client: string;
  category: LocalizedField;
  duration: string;
  budget: string;
  team: string;
  overview?: LocalizedField;
  challenge?: LocalizedField;
  solution?: LocalizedField;
  results?: any;
  technologies?: string[];
  testimonial?: LocalizedField;
  gallery?: string[];
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectApplication {
  id: number;
  name: string;
  phone: string;
  email?: string;
  expect_mony?: number;
  created_at: string;
  updated_at: string;
}

// Policy types
export interface PrivacyPolicy {
  id: number;
  type: string;
  title: string;
  content: string;
  published_at: string;
}

// Ticket types
export interface Ticket {
  id: number;
  ticket_number: string;
  name: string;
  email: string;
  phone?: string;
  link?: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Closed';
  created_at: string;
  updated_at: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  sender: 'customer' | 'admin';
  message: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export type PaginatedTickets = PaginatedResponse<Ticket>;

// Job types
export interface JobCategory {
  id: number;
  name: LocalizedField;
  description?: LocalizedField;
  icon?: string;
  order?: number;
  is_active: boolean;
  job_offers_count?: number;
  created_at: string;
  updated_at: string;
}

export interface JobOffer {
  id: number;
  job_category_id: number;
  title: LocalizedField;
  description: LocalizedField;
  requirements?: LocalizedField[];
  responsibilities?: LocalizedField[];
  benefits?: LocalizedField[];
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  location: LocalizedField;
  is_remote: boolean;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  experience_level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  education_level?: string;
  vacancies: number;
  deadline?: string;
  is_active: boolean;
  applications_count?: number;
  created_at: string;
  updated_at: string;
  category?: JobCategory;
}

export type JobApplicationStatus = 
  | 'pending'
  | 'reviewing'
  | 'shortlisted'
  | 'interview'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface JobApplication {
  id: number;
  job_offer_id: number;
  user_id?: number;
  full_name: string;
  email: string;
  phone: string;
  national_id?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  city?: string;
  address?: string;
  years_of_experience?: number;
  current_job_title?: string;
  current_company?: string;
  expected_salary?: number;
  education_level?: string;
  major?: string;
  cover_letter?: string;
  notice_period?: string;
  cv_path: string;
  attachments?: string[];
  available_from?: string;
  skills?: string[];
  languages?: string[];
  has_driving_license: boolean;
  has_own_car: boolean;
  willing_to_relocate: boolean;
  status: JobApplicationStatus;
  admin_notes?: string;
  reviewed_at?: string;
  reviewed_by?: number;
  created_at: string;
  updated_at: string;
  job_offer?: JobOffer;
  user?: any;
  reviewed_by_user?: any;
}

export interface JobApplicationFormData {
  full_name: string;
  email: string;
  phone: string;
  national_id?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  city?: string;
  address?: string;
  years_of_experience?: number;
  current_job_title?: string;
  current_company?: string;
  expected_salary?: number;
  education_level?: string;
  major?: string;
  cover_letter?: string;
  notice_period?: string;
  cv: File;
  attachments?: File[];
  available_from?: string;
  skills?: string[];
  languages?: string[];
  has_driving_license?: boolean;
  has_own_car?: boolean;
  willing_to_relocate?: boolean;
  user_id?: number;
}

// Pricing Plan types
export interface PricingPlan {
  id: number;
  key: string;
  name: LocalizedField;
  description?: LocalizedField;
  price: number;
  currency: string;
  period: 'monthly' | 'yearly' | 'one-time';
  features: LocalizedField[];
  is_popular: boolean;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

// Newsletter types
export interface NewsletterSubscriber {
  id: number;
  email: string;
  status: number;
  ip_address?: string;
  user_agent?: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: LocalizedMessage;
}

// Filter parameter types
export interface ProjectFilterParams {
  category?: string;
  client?: string;
  year?: number;
}

export interface SolutionFilterParams {
  technology?: string;
  search?: string;
}

export interface TicketFilterParams {
  status?: string;
  category?: string;
  priority?: string;
  per_page?: number;
  page?: number;
}

export interface JobCategoryFilterParams {
  search?: string;
  per_page?: number;
  page?: number;
}

export interface JobOfferFilterParams {
  category_id?: number;
  type?: string;
  location?: string;
  search?: string;
  min_salary?: number;
  max_salary?: number;
  per_page?: number;
  page?: number;
}

export interface JobApplicationFilterParams {
  status?: string;
  job_offer_id?: number;
  user_id?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
  per_page?: number;
  page?: number;
}


// ====================== ORGANIZATION TYPES ======================

export interface Organization {
  id: number;
  name: LocalizedField;
  description: LocalizedField;
  type: 'supplier' | 'company' | 'agency';
  email: string;
  phone: string;
  address: string;
  tax_number: string;
  status: 'pending' | 'approved' | 'rejected';
  owner_id?: number;
  settings?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface OrganizationBranch {
  id: number;
  organization_id: number;
  name: LocalizedField;
  description: LocalizedField;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  contact_info?: {
    departments?: string[];
    working_hours?: string;
    [key: string]: any;
  };
  manager_id?: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  distance?: number; // For search results
  organization?: Pick<Organization, 'id' | 'name'>;
  manager?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}
 
export interface OrganizationContactInfo {
  general_info: {
    name: LocalizedField;
    email: string;
    phone: string;
    address: string;
    tax_number: string;
  };
  branches: Array<{
    id: number;
    name: LocalizedField;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: number;
    working_hours?: string;
  }>;
  working_hours: {
    general: string;
    support: string;
  };
  social_media: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface OrganizationBranchesResponse {
  branches: OrganizationBranch[];
  total: number;
  countries: string[];
  cities: string[];
}

export interface SearchBranchesResponse {
  branches: OrganizationBranch[];
  total: number;
  search_location: {
    latitude: number;
    longitude: number;
    radius_km: number;
  };
}
 