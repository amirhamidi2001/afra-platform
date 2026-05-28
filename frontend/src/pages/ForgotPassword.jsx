import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi, extractError } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("لطفاً آدرس ایمیل خود را وارد کنید.");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 text-center" dir="rtl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">ایمیل ارسال شد</h2>
          <p className="text-sm text-gray-600 mb-2">
            اگر آدرس <span className="font-medium text-teal-600">{email}</span> در سیستم ما وجود داشته باشد،
            یک لینک بازنشانی رمز عبور ارسال خواهد شد.
          </p>
          <p className="text-xs text-gray-400 mb-6">لطفاً پوشه اسپم را نیز بررسی کنید.</p>
          <Link
            to="/login"
            className="inline-block rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition"
          >
            بازگشت به ورود
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8" dir="rtl">
          <h1 className="text-xl font-bold text-gray-900">فراموشی رمز عبور</h1>
          <p className="mt-1 text-sm text-gray-500">
            آدرس ایمیل خود را وارد کنید تا لینک بازنشانی رمز عبور برای شما ارسال شود.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-right">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5" dir="rtl">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              آدرس ایمیل
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="example@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                         placeholder:text-gray-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white
                       hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "در حال ارسال…" : "ارسال لینک بازنشانی"}
          </button>

          <p className="text-center text-sm text-gray-500">
            <Link to="/login" className="text-teal-600 font-medium hover:underline">
              بازگشت به ورود
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
