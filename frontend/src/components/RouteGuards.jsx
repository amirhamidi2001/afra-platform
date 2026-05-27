import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PrivateRoute — requires authentication.
 * Unauthenticated users are sent to /login.
 * The original destination is preserved in location.state.from
 * so Login.jsx can redirect back after a successful sign-in.
 */
export function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Still rehydrating from localStorage — render nothing to avoid flash
  if (isLoading) return null;

  return isAuthenticated
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
}

/**
 * PublicRoute — only accessible when NOT authenticated.
 * Authenticated users are redirected to /account (their dashboard).
 * Use this for: Login, Register, ForgotPassword, ResetPassword.
 */
export function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/account" replace /> : children;
}
