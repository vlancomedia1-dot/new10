// 📄 lib/services.ts
import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

// ====================== SERVICES SECTION (Existing) ======================

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
  formData.append("service_id", data.service_id.toString());
  
  if (data.details) {
    formData.append("details", data.details);
  }
  
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => {
      formData.append("attachments[]", file);
    });
  }
  
  return apiPost("/services/requests/create", formData);
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

// ====================== TYPES ======================

// Common localized field type
export interface LocalizedField {
  ar?: string;
  en?: string;
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

// Project application type
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

export interface PaginatedTickets {
  current_page: number;
  data: Ticket[];
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

// Create ticket payload type
export interface CreateTicketPayload {
  name: string;
  email: string;
  phone?: string;
  link?: string;
  subject: string;
  category: string;
  priority?: 'Low' | 'Medium' | 'High';
  message: string;
  attachments?: string[];
}

// Add message payload type
export interface AddMessagePayload {
  message: string;
  sender: 'customer' | 'admin';
  attachments?: string[];
}

// Update status payload type
export interface UpdateStatusPayload {
  status: 'Open' | 'In Progress' | 'Closed';
}