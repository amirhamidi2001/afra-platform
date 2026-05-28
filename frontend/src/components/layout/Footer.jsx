import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-teal-50 text-teal-600 pt-12 pb-6 border-t border-teal-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-teal-600 mb-4">پلتفرم آموزشی افرا</h3>
            <p className="text-sm">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-teal-500 hover:text-teal-600"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-teal-500 hover:text-teal-600"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-teal-500 hover:text-teal-600"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-teal-500 hover:text-teal-600"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-teal-800 mb-4">لینک‌های مفید</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-teal-600">خانه</Link></li>
              <li><Link to="/about" className="hover:text-teal-600">درباره ما</Link></li>
              <li><Link to="/services" className="hover:text-teal-600">خدمات</Link></li>
              <li><Link to="/terms" className="hover:text-teal-600">قوانین</Link></li>
              <li><Link to="/privacy" className="hover:text-teal-600">حریم خصوصی</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-teal-800 mb-4">خدمات ما</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/web-design" className="hover:text-teal-600">طراحی وب</Link></li>
              <li><Link to="/web-dev" className="hover:text-teal-600">توسعه وب</Link></li>
              <li><Link to="/product" className="hover:text-teal-600">مدیریت محصول</Link></li>
              <li><Link to="/marketing" className="hover:text-teal-600">بازاریابی</Link></li>
              <li><Link to="/graphic" className="hover:text-teal-600">طراحی گرافیک</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-teal-800 mb-4">خبرنامه</h4>
            <p className="text-sm mb-3">برای دریافت آخرین اخبار و تخفیف‌ها، ایمیل خود را وارد کنید.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="flex-1 px-4 py-2 border border-teal-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-teal-700 transition"
              >
                عضویت
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-teal-200 mt-8 pt-6 text-center text-sm">
          <p>© ۱۴۰۵ تمامی حقوق متعلق به <strong className="text-teal-600">پلتفرم آموزشی افرا</strong> است.</p>
          <p className="text-teal-600 text-x mt-1">
            طراحی شده توسط <a href="https://amirhamidi.pythonanywhere.com/" className="hover:text-teal-400">Amir Hamidi</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
