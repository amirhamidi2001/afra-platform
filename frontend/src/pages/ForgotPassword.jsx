import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ForgotPassword() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("لطفا ایمیل خود را وارد کنید");
      return;
    }
    if (!validateEmail(email)) {
      setError("ایمیل نامعتبر است");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/forgot-password-sent", { state: { email } });
    }, 1500);
  };

  return (
    <main>
      <div className="bg-gray-100 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">فراموشی رمز عبور</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-emerald-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">بازیابی رمز عبور</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-md" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-envelope-exclamation text-3xl text-emerald-600"></i>
              </div>
              <h3 className="text-2xl font-bold">رمز عبور خود را فراموش کرده‌اید؟</h3>
              <p className="text-gray-500 mt-2">
                ایمیل خود را وارد کنید. لینک بازنشانی رمز عبور برای شما ارسال خواهد شد.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative mb-6">
                <i className="bi bi-envelope absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg py-3 pr-10 pl-3 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="آدرس ایمیل"
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="bi bi-arrow-repeat bi-spin"></i> در حال ارسال...
                  </>
                ) : (
                  <>
                    ارسال لینک بازنشانی <i className="bi bi-arrow-left"></i>
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
