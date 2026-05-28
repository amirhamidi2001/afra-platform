import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authApi, extractError } from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ new_password: "", confirm_password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "", general: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.new_password) errs.new_password = "رمز عبور جدید الزامی است.";
    else if (form.new_password.length < 8) errs.new_password = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (form.new_password !== form.confirm_password)
      errs.confirm_password = "رمز عبور و تکرار آن مطابقت ندارند.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    try {
      await authApi.resetPassword(token, form.new_password, form.confirm_password);
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    } catch (err) {
      setErrors({ general: extractError(err) });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center" dir="rtl">
          <p className="text-red-600 text-sm mb-4">لینک بازنشانی رمز عبور نامعتبر است.</p>
          <Link to="/forgot-password" className="text-teal-600 hover:underline text-sm">
            درخواست لینک جدید
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 text-center" dir="rtl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
            <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">رمز عبور تغییر کرد!</h2>
          <p className="text-sm text-gray-600">در حال انتقال به صفحه ورود…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8" dir="rtl">
          <h1 className="text-xl font-bold text-gray-900">تعیین رمز عبور جدید</h1>
          <p className="mt-1 text-sm text-gray-500">رمز عبور جدید خود را وارد کنید.</p>
        </div>

        {errors.general && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-right">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5" dir="rtl">
          {/* New password */}
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور جدید
            </label>
            <div className="relative">
              <input
                id="new_password" name="new_password"
                type={showPassword ? "text" : "password"}
                value={form.new_password} onChange={handleChange}
                autoComplete="new-password" placeholder="حداقل ۸ کاراکتر"
                className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-sm transition
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  ${errors.new_password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              <button type="button" tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "پنهان" : "نمایش"}
              </button>
            </div>
            {errors.new_password && <p className="mt-1 text-xs text-red-600">{errors.new_password}</p>}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
              تکرار رمز عبور
            </label>
            <input
              id="confirm_password" name="confirm_password"
              type={showPassword ? "text" : "password"}
              value={form.confirm_password} onChange={handleChange}
              autoComplete="new-password" placeholder="تکرار رمز عبور جدید"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm transition
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                ${errors.confirm_password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
            />
            {errors.confirm_password && (
              <p className="mt-1 text-xs text-red-600">{errors.confirm_password}</p>
            )}
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white
                       hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "در حال ذخیره…" : "ذخیره رمز عبور جدید"}
          </button>
        </form>
      </div>
    </div>
  );
}
