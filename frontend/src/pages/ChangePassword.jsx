import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ChangePassword() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword.trim())
      newErrors.currentPassword = "رمز عبور فعلی را وارد کنید";
    if (!formData.newPassword.trim())
      newErrors.newPassword = "رمز عبور جدید را وارد کنید";
    else if (formData.newPassword.length < 6)
      newErrors.newPassword = "رمز عبور جدید باید حداقل ۶ کاراکتر باشد";
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "رمز عبور جدید با تکرار آن مطابقت ندارد";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setStatus({ type: "", message: "" });
    setTimeout(() => {
      setLoading(false);
      setStatus({
        type: "success",
        message: "رمز عبور شما با موفقیت تغییر کرد.",
      });
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }, 1500);
  };

  return (
    <main>
      <div className="bg-gray-100 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">تغییر رمز عبور</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-emerald-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li><a href="/account" className="text-emerald-600 hover:underline">حساب کاربری</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">تغییر رمز عبور</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-md" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-shield-lock text-3xl text-emerald-600"></i>
              </div>
              <h3 className="text-2xl font-bold">تغییر رمز عبور</h3>
              <p className="text-gray-500 mt-2">
                برای حفظ امنیت حساب خود، رمز عبوری قوی انتخاب کنید.
              </p>
            </div>

            {status.message && (
              <div
                className={`mb-4 p-3 rounded-lg text-center ${
                  status.type === "success"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <i className="bi bi-lock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.currentPassword ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="رمز عبور فعلی"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                >
                  <i className={`bi ${showCurrent ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                )}
              </div>

              <div className="relative">
                <i className="bi bi-key absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="رمز عبور جدید"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                >
                  <i className={`bi ${showNew ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div className="relative">
                <i className="bi bi-key-fill absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="تکرار رمز عبور جدید"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                >
                  <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="bi bi-arrow-repeat bi-spin"></i> در حال تغییر...
                  </>
                ) : (
                  <>
                    تغییر رمز عبور <i className="bi bi-arrow-left"></i>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <a href="/account" className="text-emerald-600 hover:underline">
                <i className="bi bi-arrow-right ml-1"></i> بازگشت به حساب کاربری
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
