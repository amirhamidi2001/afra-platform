import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const USER_TYPE_OPTIONS = [
  { value: 1, label: "دانش‌آموز / دانشجو" },
  { value: 2, label: "مدرس / استاد" },
];

const INITIAL_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  user_type: 1,
};

export default function Register() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "user_type" ? Number(value) : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = "نام الزامی است.";
    if (!form.last_name.trim()) errs.last_name = "نام خانوادگی الزامی است.";
    if (!form.email.trim()) errs.email = "ایمیل الزامی است.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "فرمت ایمیل نامعتبر است.";
    if (!form.password) errs.password = "رمز عبور الزامی است.";
    else if (form.password.length < 8) errs.password = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (form.password !== form.confirm_password) errs.confirm_password = "رمز عبور و تکرار آن مطابقت ندارند.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const result = await register(form);
    if (result.ok) {
      setSuccess(true);
    } else {
      setErrors({ general: result.error });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center" dir="rtl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">ثبت‌نام با موفقیت انجام شد!</h2>
          <p className="text-sm text-gray-600 mb-6">
            یک ایمیل تأیید به آدرس <span className="font-medium text-emerald-600">{form.email}</span> ارسال شد.
            لطفاً ایمیل خود را بررسی کرده و روی لینک فعال‌سازی کلیک کنید.
          </p>
          <Link
            to="/login"
            className="inline-block rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          >
            رفتن به صفحه ورود
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">ایجاد حساب کاربری</h1>
          <p className="mt-1 text-sm text-gray-500">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link to="/login" className="text-emerald-600 font-medium hover:underline">
              ورود
            </Link>
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-right">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4" dir="rtl">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="نام" id="first_name" name="first_name" value={form.first_name}
              onChange={handleChange} error={errors.first_name} placeholder="نام" />
            <Field label="نام خانوادگی" id="last_name" name="last_name" value={form.last_name}
              onChange={handleChange} error={errors.last_name} placeholder="نام خانوادگی" />
          </div>

          <Field label="آدرس ایمیل" id="email" name="email" type="email"
            value={form.email} onChange={handleChange} error={errors.email}
            placeholder="example@email.com" autoComplete="email" />

          {/* User type */}
          <div>
            <label htmlFor="user_type" className="block text-sm font-medium text-gray-700 mb-1">
              نقش کاربری
            </label>
            <select
              id="user_type"
              name="user_type"
              value={form.user_type}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition"
            >
              {USER_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور
            </label>
            <div className="relative">
              <input
                id="password" name="password" type={showPassword ? "text" : "password"}
                value={form.password} onChange={handleChange} autoComplete="new-password"
                placeholder="حداقل ۸ کاراکتر"
                className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-sm transition
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              <button type="button" tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                {showPassword ? "پنهان" : "نمایش"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <Field label="تکرار رمز عبور" id="confirm_password" name="confirm_password"
            type={showPassword ? "text" : "password"} value={form.confirm_password}
            onChange={handleChange} error={errors.confirm_password}
            placeholder="تکرار رمز عبور" autoComplete="new-password" />

          <button
            type="submit" disabled={isLoading}
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white
                       hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition mt-2"
          >
            {isLoading ? "در حال ثبت‌نام…" : "ایجاد حساب"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Tiny reusable field ───────────────────────────────────────────────────────
function Field({ label, id, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={id}
        {...props}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm transition
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
          placeholder:text-gray-400
          ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
