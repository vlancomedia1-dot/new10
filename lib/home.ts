// 📄 lib/home.ts
import { apiGet,apiPost } from "./api";

/**
 * Home – Settings
 * GET /api/settings
 */
export const getSettings = () =>
  apiGet("/settings");

/**
 * Home – Hero Section
 * GET /api/home/hero
 */
export const getHero = () =>
  apiGet("/home/hero");

/**
 * Home – Statistics
 * GET /api/home/statistics
 */
export const getStatistics = () =>
  apiGet("/home/statistics");

/**
 * Home – Services
 * GET /api/home/services
 */
export const getServices = (limit: number = 6) =>
  apiGet(`/home/services?limit=${limit}`);

/**
 * Home – Projects
 * GET /api/home/projects
 */
export const getProjects = (limit: number = 6) =>
  apiGet(`/home/projects?limit=${limit}`);

/**
 * Home – Team
 * GET /api/home/team
 */
export const getTeam = (limit: number = 4) =>
  apiGet(`/home/team?limit=${limit}`);

/**
 * Home – Testimonials
 * GET /api/home/testimonials
 */
export const getTestimonials = (limit: number = 3) =>
  apiGet(`/home/testimonials?limit=${limit}`);


/**
 * Home – solutions
 * GET /api/home/solutions
 */
export const getSolutions = (limit: number = 3) =>
  apiGet(`/home/solutions?limit=${limit}`);
 

// 
/**
 * Home – benefits
 * GET /api/home/benefits
 */
export const getBenefits = () =>
  apiGet(`/home/benefits`);
 

// about
// 
/**
 * Home – about
 * GET /api/home/about
 */
export const getAbout = () =>
  apiGet(`/home/about`);
 


//api/projects/add-aply 
// here 


/**
 * Projects – Add Apply
 * POST /api/projects/add-aply
 */
export interface AddProjectData {
  name: string;
  phone: string;
  email?: string;
  tech_project_id?: number;
  expect_mony?: number;
  details: {
    title: string;
    description?: string;
    category?: string;
    client_name?: string;
    budget_range?: string;
    duration?: string;
    result?: string;
    technologies?: string[];
    extra?: string;
  };
}

export const addProjectApply = (data: AddProjectData) =>
  apiPost("/projects/add-aply", data);
