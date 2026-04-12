// 📄 lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:1919/api";

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

/**
 * Get common headers for API requests
 */
function getHeaders(lang: string = "ar"): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Accept-Language": lang,
  };

  // Add Content-Type for non-GET requests
  if (typeof window !== "undefined") {
    // If we have an auth token in localStorage, add it
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Handle API response
 */
// async function handleResponse<T>(res: Response): Promise<T> {
//   if (!res.ok) {
//     let message = "API Error";

//     try {
//       const data = await res.json();
//       message = data.message || message;
//     } catch {
//       message = await res.text();
//     }

//     throw new Error(message);
//   }

//   return res.json();
// }
async function handleResponse(response: Response): Promise<any> {
  const data = await response.json();
  
  if (!response.ok) {
    throw {
      response: {
        status: response.status,
        data: data
      },
      message: data.message || 'Request failed'
    };
  }
  
  return data;
}

// async function handleResponse<T>(res: Response): Promise<T> {
//   const text = await res.text();
 

//   if (!res.ok) {
//     throw new Error(text || "API Error");
//   }

//   return JSON.parse(text) as T;
// }

/**
 * GET request
 */
export async function apiGet<T = any>(
  endpoint: string,
  lang: string = "ar"
): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`);
  url.searchParams.set("lang", lang);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getHeaders(lang),
    cache: "no-store",
  });

  return handleResponse<T>(res);
}


/**
 * POST request
 */
export async function apiPost<T = any>(
  endpoint: string,
  body: unknown,
  lang: string = "ar"
): Promise<T> {
  const headers = getHeaders(lang);
  headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  return handleResponse<T>(res);
}

/**
 * POST request with FormData (for file uploads)
 */
// export async function apiPostForm<T = any>(
//   endpoint: string,
//   formData: FormData,
//   lang: string = "ar"
// ): Promise<T> {
//   const headers = getHeaders(lang);
//   // Don't set Content-Type for FormData, browser will set it with boundary

//   const res = await fetch(`${API_URL}${endpoint}`, {
//     method: "POST",
//     headers,
//     body: formData,
//     cache: "no-store",
//   });

//   return handleResponse<T>(res);
// }
export async function apiPostForm(endpoint: string, formData: FormData): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      // Don't set Content-Type - browser will set it with boundary for FormData
      body: formData,
    });

    return await handleResponse(response);
  } catch (error: any) {
    console.error('API PostForm Error:', error);
    throw error;
  }
}

/**
 * PATCH request
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body?: unknown,
  lang: string = "ar"
): Promise<T> {
  const headers = getHeaders(lang);
  headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  return handleResponse<T>(res);
}

/**
 * PUT request
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: unknown,
  lang: string = "ar"
): Promise<T> {
  const headers = getHeaders(lang);
  headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  return handleResponse<T>(res);
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(
  endpoint: string,
  lang: string = "ar"
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: getHeaders(lang),
    cache: "no-store",
  });

  return handleResponse<T>(res);
}


/**
 * Generic API request handler
 */
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const defaultHeaders: HeadersInit = {
    'Accept': 'application/json',
  };

  // Only add Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Important: Add these for CORS
    mode: 'cors',
    credentials: 'include',
  };

  try {
    console.log('🚀 API Request:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body instanceof FormData ? 'FormData' : config.body,
    });

    const response = await fetch(url, config);
    
    console.log('📡 API Response Status:', response.status, response.statusText);

    // Try to parse JSON response
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('✅ API Response Data:', data);
    } else {
      // If not JSON, get text for debugging
      const text = await response.text();
      console.error('❌ Non-JSON response:', text);
      
      return {
        success: false,
        message: 'Server returned non-JSON response',
        error: text,
      };
    }

    // Handle unsuccessful responses
    if (!response.ok) {
      console.error('❌ API Error Response:', data);
      
      return {
        success: false,
        message: data.message || `HTTP error! status: ${response.status}`,
        error: data.error || data.errors || null,
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    console.error('❌ API Request Error:', {
      url,
      error: error.message,
      stack: error.stack,
    });

    // Provide more specific error messages
    if (error.message === 'Failed to fetch') {
      return {
        success: false,
        message: 'Unable to connect to the server. Please check your internet connection and ensure the API is running.',
        error: 'NETWORK_ERROR',
        data: null,
      };
    }

    if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        error: 'NETWORK_ERROR',
        data: null,
      };
    }

    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: error.name || 'UNKNOWN_ERROR',
      data: null,
    };
  }
}
