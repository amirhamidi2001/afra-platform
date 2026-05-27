import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi, extractError } from "../services/api";

export default function ChangePassword() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "", general: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.current_password) errs.current_password = "رمز عبور فعلی الزامی است.";
    if (!form.new_password) errs.new_password = "رمز عبور جدید الزامی است.";
    else if (form.new_password.length < 8) errs.new_password = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (form.new_password === form.current_password)
      errs.new_password = "رمز عبور جدید نباید با رمز عبور فعلی یکسان باشد.";
    if (form.new_password !== form.confirm_password)
      errs.confirm_password = "رمز عبور جدید و تکرار آن مطابقت ندارند.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    try {
      await authApi.changePassword(
        form.current_password,
        form.new_password,
        form.confirm_password
      );
      setSuccess(true);
      // Backend blacklisted all tokens — force re-login after 2s
      setTimeout(async () => {
        await logout();
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      setErrors({ general: extractError(err) });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 text-center" dir="rtl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">رمز عبور با موفقیت تغییر کرد!</h2>
          <p className="text-sm text-gray-500">در حال خروج از سیستم…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8" dir="rtl">
          <h1 className="text-xl font-bold text-gray-900">تغییر رمز عبور</h1>
          <p className="mt-1 text-sm text-gray-500">
            پس از تغییر، از تمام دستگاه‌ها خارج می‌شوید.
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-right">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5" dir="rtl">
          {/* Current password */}
          <PasswordField
            id="current_password" label="رمز عبور فعلی"
            value={form.current_password} onChange={handleChange}
            show={showPasswords} error={errors.current_password}
            autoComplete="current-password"
          />

          <hr className="border-gray-100" />

          {/* New password */}
          <PasswordField
            id="new_password" label="رمز عبور جدید"
            value={form.new_password} onChange={handleChange}
            show={showPasswords} error={errors.new_password}
            autoComplete="new-password" placeholder="حداقل ۸ کاراکتر"
          />

          {/* Confirm */}
          <PasswordField
            id="confirm_password" label="تکرار رمز عبور جدید"
            value={form.confirm_password} onChange={handleChange}
            show={showPasswords} error={errors.confirm_password}
            autoComplete="new-password"
          />

          {/* Toggle show passwords */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={() => setShowPasswords((v) => !v)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            نمایش رمزها
          </label>

          <button
            type="submit" disabled={isLoading}
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white
                       hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "در حال ذخیره…" : "تغییر رمز عبور"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Tiny reusable password field ──────────────────────────────────────────────
function PasswordField({ id, label, value, onChange, show, error, autoComplete, placeholder = "••••••••" }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={id} name={id} type={show ? "text" : "password"}
        value={value} onChange={onChange} autoComplete={autoComplete} placeholder={placeholder}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm transition
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
          placeholder:text-gray-400
          ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
