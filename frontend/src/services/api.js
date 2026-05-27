import axios from "axios";

// ── Constants ─────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const STORAGE_KEYS = {
  ACCESS: "auth_access",
  REFRESH: "auth_refresh",
  USER: "auth_user",
};

// ── Token helpers ─────────────────────────────────────────────────────────────
export const tokenStorage = {
  getAccess: () => localStorage.getItem(STORAGE_KEYS.ACCESS),
  getRefresh: () => localStorage.getItem(STORAGE_KEYS.REFRESH),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    } catch {
      return null;
    }
  },
  set: (access, refresh, user) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS, access);
    localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS);
    localStorage.removeItem(STORAGE_KEYS.REFRESH);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request interceptor — attach access token ─────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccess();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — silent token refresh on 401 ───────────────────────
let _isRefreshing = false;
let _failedQueue = [];

const processQueue = (error, token = null) => {
  _failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  _failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only attempt refresh once per request; skip auth endpoints themselves
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/accounts/token/refresh/") &&
      !original.url?.includes("/accounts/login/")
    ) {
      if (_isRefreshing) {
        return new Promise((resolve, reject) => {
          _failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch(Promise.reject);
      }

      original._retry = true;
      _isRefreshing = true;

      const refresh = tokenStorage.getRefresh();
      if (!refresh) {
        tokenStorage.clear();
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/accounts/token/refresh/`, {
          refresh,
        });
        const newAccess = data.access;
        const newRefresh = data.refresh ?? refresh; // SimpleJWT returns new refresh when rotation is on
        const user = tokenStorage.getUser();
        tokenStorage.set(newAccess, newRefresh, user);
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        processQueue(null, newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clear();
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      } finally {
        _isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Error normaliser ──────────────────────────────────────────────────────────
/**
 * Extracts the first human-readable Persian error string from a DRF response.
 * Priority: non_field_errors → first field error → generic fallback.
 */
export const extractError = (err, fallback = "خطایی رخ داد. لطفاً مجدداً تلاش کنید.") => {
  const data = err?.response?.data;
  if (!data) return fallback;

  if (typeof data === "string") return data;

  if (data["پیام"] && typeof data["پیام"] === "string") return data["پیام"];

  const errors = data["خطاها"] ?? data;

  if (errors?.non_field_errors) {
    const v = errors.non_field_errors;
    return Array.isArray(v) ? v[0] : v;
  }

  for (const key of Object.keys(errors)) {
    const v = errors[key];
    const msg = Array.isArray(v) ? v[0] : v;
    if (typeof msg === "string") return msg;
  }

  return fallback;
};

// ── Auth API calls ────────────────────────────────────────────────────────────
export const authApi = {
  register: (payload) =>
    api.post("/accounts/register/", payload),

  login: (email, password) =>
    api.post("/accounts/login/", { email, password }),

  logout: (refresh) =>
    api.post("/accounts/logout/", { refresh }),

  me: () =>
    api.get("/accounts/me/"),

  verifyEmail: (token) =>
    api.post("/accounts/verify-email/", { token }),

  resendVerification: (email) =>
    api.post("/accounts/resend-verification/", { email }),

  changePassword: (currentPassword, newPassword, confirmPassword) =>
    api.post("/accounts/change-password/", {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),

  forgotPassword: (email) =>
    api.post("/accounts/forgot-password/", { email }),

  resetPassword: (token, newPassword, confirmPassword) =>
    api.post("/accounts/reset-password/", {
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),

  googleLogin: (credential) =>
    api.post("/accounts/google/", { credential }),
};

export default api;
