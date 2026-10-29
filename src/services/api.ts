/**
 * Central API client for WishCraft backend communication.
 */

function resolveApiBaseUrl(): string {
  let raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  raw = raw.trim().replace(/\/+$/, '');
  if (!raw.endsWith('/api/v1')) {
    raw = `${raw}/api/v1`;
  }
  return raw;
}

export const API_BASE_URL = resolveApiBaseUrl();
export const BACKEND_HOST = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

/**
 * Canonical URL resolver for public celebration websites.
 * Guarantees that production links NEVER contain localhost or 127.0.0.1.
 */
export function getPublicWishUrl(slug: string): string {
  if (!slug) return '';
  const cleanSlug = slug.trim();

  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local');

    if (isLocalhost) {
      return `${window.location.origin}/wish/${cleanSlug}`;
    }

    const deployedOrigin = window.location.origin || 'https://wishcraft-chi.vercel.app';
    return `${deployedOrigin}/wish/${cleanSlug}`;
  }

  const fallback = import.meta.env.PROD ? 'https://wishcraft-chi.vercel.app' : 'http://localhost:5173';
  return `${fallback}/wish/${cleanSlug}`;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getToken(): string | null {
  return localStorage.getItem('wishcraft_access_token');
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('wishcraft_access_token', token);
  } else {
    localStorage.removeItem('wishcraft_access_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  const token = getToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for HTTP-only sessions
  });

  if (!response.ok) {
    let errorDetail = 'An error occurred while communicating with the server.';
    let errorData = null;
    try {
      errorData = await response.json();
      if (errorData.detail) {
        errorDetail = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : JSON.stringify(errorData.detail);
      }
    } catch {
      errorDetail = response.statusText || errorDetail;
    }

    if (response.status === 401) {
      // If token expired, clear local token
      setToken(null);
    }

    throw new ApiError(errorDetail, response.status, errorData);
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    register: (data: { email: string; password: string; display_name: string }) =>
      request<{ access_token: string; token_type: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: (data: { email: string; password: string }) =>
      request<{ access_token: string; token_type: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    logout: () =>
      request<{ message: string }>('/auth/logout', {
        method: 'POST',
      }),

    getMe: () =>
      request<any>('/auth/me'),

    updateProfile: (data: { display_name?: string; profile_image?: string }) =>
      request<any>('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    changePassword: (data: { current_password: string; new_password: string }) =>
      request<{ message: string }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    forgotPassword: (email: string) =>
      request<{ message: string; reset_token?: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    resetPassword: (data: { token: string; new_password: string }) =>
      request<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    deleteAccount: () =>
      request<{ message: string }>('/auth/me', {
        method: 'DELETE',
      }),
  },

  // Templates
  templates: {
    list: (params?: { occasion?: string; style?: string }) => {
      const q = new URLSearchParams();
      if (params?.occasion) q.append('occasion', params.occasion);
      if (params?.style) q.append('style', params.style);
      const query = q.toString() ? `?${q.toString()}` : '';
      return request<any[]>(`/templates${query}`);
    },

    get: (id: string) =>
      request<any>(`/templates/${id}`),
  },

  // Creations
  creations: {
    list: () =>
      request<any[]>('/creations'),

    get: (id: string) =>
      request<any>(`/creations/${id}`),

    create: (data: any) =>
      request<any>('/creations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      request<any>(`/creations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<{ message: string }>(`/creations/${id}`, {
        method: 'DELETE',
      }),

    duplicate: (id: string) =>
      request<any>(`/creations/${id}/duplicate`, {
        method: 'POST',
      }),
  },

  // Permanent Media Uploads
  uploads: {
    uploadPhoto: async (file: File): Promise<{ asset_id: string; url: string; filename: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      return request<{ asset_id: string; url: string; filename: string }>('/uploads', {
        method: 'POST',
        body: formData,
      });
    },
  },

  // Publishing & Public Celebrations
  public: {
    publish: (creationId: string, data: { custom_slug?: string; privacy?: string; pin?: string; expires_in_days?: number }) =>
      request<any>(`/public/publish/${creationId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    unpublish: (creationId: string) =>
      request<{ message: string }>(`/public/unpublish/${creationId}`, {
        method: 'POST',
      }),

    getPublicSite: (slug: string) =>
      request<any>(`/public/sites/${slug}`),

    verifyPin: (slug: string, pin: string) =>
      request<any>(`/public/sites/${slug}/verify-pin`, {
        method: 'POST',
        body: JSON.stringify({ pin }),
      }),

    recordEvent: (slug: string, event_type: string) =>
      request<{ status: string }>(`/public/sites/${slug}/event`, {
        method: 'POST',
        body: JSON.stringify({ event_type }),
      }),
  },

  // AI Assistant
  ai: {
    generateMessage: (data: {
      occasion: string;
      recipient_name: string;
      relationship: string;
      tone: string;
      length?: string;
      extra_context?: string;
    }) =>
      request<{ suggestions: string[]; provider: string; recipient_name: string; tone: string }>('/ai/generate-message', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};

