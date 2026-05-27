import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { authApi, extractError, tokenStorage } from "../services/api";

// ── Action types ──────────────────────────────────────────────────────────────
const A = {
  REQUEST:    "REQUEST",
  SUCCESS:    "SUCCESS",
  FAILURE:    "FAILURE",
  LOGOUT:     "LOGOUT",
  CLEAR_ERR:  "CLEAR_ERR",
  UPDATE_USER:"UPDATE_USER",
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, { type, payload }) {
  switch (type) {
    case A.REQUEST:
      return { ...state, isLoading: true, error: null };
    case A.SUCCESS:
      return { ...state, isLoading: false, isAuthenticated: true, user: payload, error: null };
    case A.FAILURE:
      return { ...state, isLoading: false, isAuthenticated: false, error: payload };
    case A.LOGOUT:
      return { user: null, isAuthenticated: false, isLoading: false, error: null };
    case A.CLEAR_ERR:
      return { ...state, error: null };
    case A.UPDATE_USER:
      return { ...state, user: payload };
    default:
      return state;
  }
}

// ── Initial state ─────────────────────────────────────────────────────────────
const init = {
  user:            tokenStorage.getUser(),
  isAuthenticated: !!tokenStorage.getAccess(),
  isLoading:       false,
  error:           null,
};

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, init);

  // Forced logout emitted by the Axios interceptor when refresh fails
  useEffect(() => {
    const handle = () => {
      tokenStorage.clear();
      dispatch({ type: A.LOGOUT });
    };
    window.addEventListener("auth:logout", handle);
    return () => window.removeEventListener("auth:logout", handle);
  }, []);

  // Rehydrate from localStorage on first mount
  useEffect(() => {
    const access = tokenStorage.getAccess();
    const user   = tokenStorage.getUser();
    if (access && user) dispatch({ type: A.SUCCESS, payload: user });
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    dispatch({ type: A.REQUEST });
    try {
      const { data } = await authApi.login(email, password);
      // Backend returns: { توکن: { access, refresh }, کاربر: {...} }
      tokenStorage.set(data["توکن"].access, data["توکن"].refresh, data["کاربر"]);
      dispatch({ type: A.SUCCESS, payload: data["کاربر"] });
      return { ok: true };
    } catch (err) {
      const msg = extractError(err);
      dispatch({ type: A.FAILURE, payload: msg });
      return { ok: false, error: msg };
    }
  }, []);

  const register = useCallback(async (payload) => {
    dispatch({ type: A.REQUEST });
    try {
      await authApi.register(payload);
      dispatch({ type: A.FAILURE, payload: null }); // reset loading; no session yet
      return { ok: true };
    } catch (err) {
      const msg = extractError(err);
      dispatch({ type: A.FAILURE, payload: msg });
      return { ok: false, error: msg };
    }
  }, []);

  const logout = useCallback(async () => {
    const refresh = tokenStorage.getRefresh();
    try {
      if (refresh) await authApi.logout(refresh);
    } catch {
      // best-effort — always clear locally
    } finally {
      tokenStorage.clear();
      dispatch({ type: A.LOGOUT });
    }
  }, []);

  const googleLogin = useCallback(async (credential) => {
    dispatch({ type: A.REQUEST });
    try {
      const { data } = await authApi.googleLogin(credential);
      tokenStorage.set(data["توکن"].access, data["توکن"].refresh, data["کاربر"]);
      dispatch({ type: A.SUCCESS, payload: data["کاربر"] });
      return { ok: true };
    } catch (err) {
      const msg = extractError(err);
      dispatch({ type: A.FAILURE, payload: msg });
      return { ok: false, error: msg };
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.me();
      tokenStorage.set(tokenStorage.getAccess(), tokenStorage.getRefresh(), data);
      dispatch({ type: A.UPDATE_USER, payload: data });
    } catch { /* interceptor handles expiry */ }
  }, []);

  const clearError = useCallback(() => dispatch({ type: A.CLEAR_ERR }), []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, googleLogin, refreshUser, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
