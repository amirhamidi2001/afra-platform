import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function NotFound() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <main>
      <div className="bg-gray-100 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">404</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-emerald-600 hover:underline">خانه</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">404</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="text-8xl text-emerald-300 mb-6" data-aos="zoom-in" data-aos-delay="100">
            <i className="bi bi-exclamation-circle"></i>
          </div>

          <h1
            className="text-8xl md:text-9xl font-extrabold text-gray-800 mb-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            404
          </h1>

          <h2
            className="text-2xl md:text-3xl font-bold text-gray-700 mb-3"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            اوه! صفحه پیدا نشد
          </h2>

          <p
            className="text-gray-500 mb-8 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            صفحه‌ای که به دنبال آن هستید ممکن است حذف شده، نام آن تغییر کرده یا به طور موقت در دسترس نباشد.
          </p>

          <div data-aos="fade-up" data-aos-delay="600">
            <Link
              to="/"
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
