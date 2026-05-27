import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// ── Auth ──────────────────────────────────────────────────────────────────────
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute, PublicRoute } from "./components/RouteGuards";

// ── Layout ────────────────────────────────────────────────────────────────────
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// ── Public pages (no auth required) ──────────────────────────────────────────
import Home             from "./pages/Home";
import About            from "./pages/About";
import Blog             from "./pages/Blog";
import BlogDetails      from "./pages/BlogDetails";
import Courses          from "./pages/Courses";
import CourseDetails    from "./pages/CourseDetails";
import Trainers         from "./pages/Trainers";
import Contact          from "./pages/Contact";
import NotFound         from "./pages/NotFound";

// ── Auth pages (redirect to /account if already logged in) ───────────────────
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import ForgotPassword   from "./pages/ForgotPassword";
import ResetPassword    from "./pages/ResetPassword";

// ── Open auth pages (no redirect, accessible to all) ─────────────────────────
import VerifyEmail      from "./pages/VerifyEmail";

// ── Private pages (redirect to /login if not authenticated) ──────────────────
import Account          from "./pages/Account";
import ChangePassword   from "./pages/ChangePassword";
import Cart             from "./pages/Cart";
import Checkout         from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

// ── Google OAuth client ID ────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>

          <Header />

          <main className="min-h-screen">
            <Routes>

              {/* ── Fully public ──────────────────────────────────────────── */}
              <Route path="/"              element={<Home />} />
              <Route path="/about"         element={<About />} />
              <Route path="/blog"          element={<Blog />} />
              <Route path="/blog/:slug"    element={<BlogDetails />} />
              <Route path="/courses"       element={<Courses />} />
              <Route path="/course/:slug"  element={<CourseDetails />} />
              <Route path="/trainers"      element={<Trainers />} />
              <Route path="/contact"       element={<Contact />} />

              {/* Email verification is open to everyone (link arrives via email) */}
              <Route
                path="/verify-email/:token"
                element={<VerifyEmail />}
              />

              {/* ── Auth-only (redirect to /account if already logged in) ── */}
              <Route
                path="/login"
                element={<PublicRoute><Login /></PublicRoute>}
              />
              <Route
                path="/register"
                element={<PublicRoute><Register /></PublicRoute>}
              />
              <Route
                path="/forgot-password"
                element={<PublicRoute><ForgotPassword /></PublicRoute>}
              />
              <Route
                path="/reset-password/:token"
                element={<PublicRoute><ResetPassword /></PublicRoute>}
              />

              {/* ── Private (redirect to /login if not authenticated) ──────── */}
              <Route
                path="/account"
                element={<PrivateRoute><Account /></PrivateRoute>}
              />
              <Route
                path="/change-password"
                element={<PrivateRoute><ChangePassword /></PrivateRoute>}
              />
              <Route
                path="/cart"
                element={<PrivateRoute><Cart /></PrivateRoute>}
              />
              <Route
                path="/checkout"
                element={<PrivateRoute><Checkout /></PrivateRoute>}
              />
              <Route
                path="/order-confirmation"
                element={<PrivateRoute><OrderConfirmation /></PrivateRoute>}
              />

              {/* ── 404 ───────────────────────────────────────────────────── */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </main>

          <Footer />

        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
