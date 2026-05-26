import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ResetPassword() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!password) newErrors.password = "رمز عبور را وارد کنید";
    else if (password.length < 6) newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    if (password !== confirmPassword) newErrors.confirmPassword = "رمز عبور با تکرار آن مطابقت ندارد";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setServerMessage("رمز عبور شما با موفقیت تغییر کرد.");
      setTimeout(() => navigate("/login"), 2000);
    }, 1500);
  };

  return (
    <main>
      <div className="bg-gray-100 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">بازنشانی رمز عبور</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-emerald-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">تعیین رمز جدید</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-md" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-key text-3xl text-emerald-600"></i>
              </div>
              <h3 className="text-2xl font-bold">رمز عبور جدید خود را وارد کنید</h3>
              <p className="text-gray-500 mt-2">رمز عبور باید حداقل ۶ کاراکتر باشد.</p>
            </div>

            {serverMessage && (
              <div className="mb-4 p-3 rounded-lg text-center bg-emerald-100 text-emerald-700">
                {serverMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <i className="bi bi-lock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="رمز عبور جدید"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="relative mb-6">
                <i className="bi bi-lock-fill absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="تکرار رمز عبور"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                >
                  <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="bi bi-arrow-repeat bi-spin"></i> در حال بازنشانی...
                  </>
                ) : (
                  <>
                    بازنشانی رمز عبور <i className="bi bi-arrow-left"></i>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <a href="/login" className="text-emerald-600 hover:underline">
                <i className="bi bi-arrow-right ml-1"></i> بازگشت به صفحه ورود
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
