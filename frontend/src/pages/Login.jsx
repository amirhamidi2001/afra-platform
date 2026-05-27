import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, googleLogin, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  // Sync context error → local
  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleChange = (e) => {
    clearError();
    setLocalError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!form.email || !form.password) {
      setLocalError("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }

    const result = await login(form.email.trim().toLowerCase(), form.password);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setLocalError(result.error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLocalError("");
    const result = await googleLogin(credentialResponse.credential);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">ورود به حساب کاربری</h1>
          <p className="mt-1 text-sm text-gray-500">
            حساب ندارید؟{" "}
            <Link to="/register" className="text-emerald-600 font-medium hover:underline">
              ثبت‌نام کنید
            </Link>
          </p>
        </div>

        {/* Error banner */}
        {localError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-right">
            {localError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5" dir="rtl">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              آدرس ایمیل
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         placeholder:text-gray-400 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                رمز عبور
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-emerald-600 hover:underline"
              >
                رمز عبور را فراموش کردم
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="رمز عبور"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           placeholder:text-gray-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                tabIndex={-1}
              >
                {showPassword ? "پنهان" : "نمایش"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white
                       hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "در حال ورود…" : "ورود"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400">
            <span className="bg-white px-3">یا ورود با</span>
          </div>
        </div>

        {/* Google login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setLocalError("ورود با گوگل ناموفق بود. لطفاً مجدداً تلاش کنید.")}
            useOneTap={false}
            locale="fa"
            shape="rectangular"
            text="signin_with"
          />
        </div>
      </div>
    </div>
  );
}
