import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../../context/AuthContext";

// ── Desktop nav links ─────────────────────────────────────────────────────────
const NAV_LINKS = [
  { to: "/", label: "خانه" },
  { to: "/about", label: "درباره ما" },
  { to: "/courses", label: "دوره ها" },
  { to: "/trainers", label: "مدرسان ما" },
  { to: "/cart", label: "سبد خرید" },
  { to: "/checkout", label: "تسویه حساب" },
  { to: "/blog", label: "مجله آموزشی" },
  { to: "/contact", label: "تماس با ما" },
];

// ── Mobile nav links ──────────────────────────────────────────────────────────
const MOBILE_NAV_LINKS = [
  { to: "/", label: "خانه" },
  { to: "/about", label: "درباره ما" },
  { to: "/courses", label: "دوره ها" },
  { to: "/trainers", label: "مدرسان ما" },
  { to: "/cart", label: "سبد خرید" },
  { to: "/checkout", label: "تسویه حساب" },
  { to: "/blog", label: "مجله آموزشی" },
  { to: "/contact", label: "تماس با ما" },
];

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // ── Close account dropdown when clicking outside ──────────────────────────
  const accountRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── AOS init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    setAccountOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md" dir="rtl">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="bg-emerald-50 text-sm py-2 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-2">

            {/* Phone */}
            <div className="hidden lg:flex items-center gap-1 text-emerald-600">
              <i className="bi bi-telephone-fill"></i>
              <span>نیاز به کمک؟ با ما تماس بگیرید:</span>
              <a href="tel:+1234567890" className="text-emerald-600 hover:underline">
                +۱ (۲۳۴) ۵۶۷-۸۹۰
              </a>
            </div>

            {/* Promo Swiper */}
            <div className="w-full lg:w-auto text-center">
              <Swiper
                modules={[Autoplay, EffectFade]}
                direction="vertical"
                loop
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                speed={600}
                style={{ height: "24px" }}
              >
                <SwiperSlide><div className="text-emerald-700">🚚 ارسال رایگان برای سفارش‌های بالای ۵۰ دلار</div></SwiperSlide>
                <SwiperSlide><div className="text-emerald-700">💰 ضمانت بازگشت وجه تا ۳۰ روز</div></SwiperSlide>
                <SwiperSlide><div className="text-emerald-700">🎁 ۲۰٪ تخفیف برای اولین خرید</div></SwiperSlide>
              </Swiper>
            </div>

            {/* Language / Currency */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700">
                  <i className="bi bi-translate"></i> فارسی
                  <i className="bi bi-chevron-down text-xs"></i>
                </button>
                <ul className="absolute left-0 top-full mt-1 w-28 bg-white shadow-md rounded-md
                               opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">English</a></li>
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">Español</a></li>
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">Français</a></li>
                </ul>
              </div>
              {/* Currency */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700">
                  <i className="bi bi-currency-dollar"></i> USD
                  <i className="bi bi-chevron-down text-xs"></i>
                </button>
                <ul className="absolute left-0 top-full mt-1 w-24 bg-white shadow-md rounded-md
                               opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">USD</a></li>
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">EUR</a></li>
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">GBP</a></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Middle bar ────────────────────────────────────────────────────── */}
      <div className="py-3 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-emerald-600 shrink-0">
              پلتفرم آموزشی افرا
            </Link>

            {/* Desktop search */}
            <form className="hidden lg:block flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجوی دوره‌ها..."
                  className="w-full border border-emerald-300 rounded-full py-2 px-4 pl-10
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600"
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            {/* Action icons */}
            <div className="flex items-center gap-3">

              {/* Mobile search toggle */}
              <button
                onClick={() => setMobileSearchOpen((v) => !v)}
                className="lg:hidden text-2xl text-emerald-700"
                aria-label="جستجو"
              >
                <i className="bi bi-search"></i>
              </button>

              {/* ── Account dropdown ───────────────────────────────────── */}
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="text-2xl text-emerald-700 hover:text-emerald-500 transition-colors"
                  aria-label="حساب کاربری"
                  aria-expanded={accountOpen}
                >
                  {/* Show filled icon when logged in */}
                  <i className={`bi ${isAuthenticated ? "bi-person-check-fill text-emerald-600" : "bi-person"}`}></i>
                </button>

                {accountOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-white shadow-xl rounded-xl border border-gray-100 z-30 overflow-hidden">

                    {isAuthenticated ? (
                      /* ── Authenticated state ─────────────────────── */
                      <>
                        {/* User info header */}
                        <div className="px-4 py-3 bg-emerald-50 border-b flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center shrink-0">
                            <i className="bi bi-person-fill text-emerald-700 text-lg"></i>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {user?.first_name
                                ? `${user.first_name} ${user.last_name ?? ""}`.trim()
                                : user?.email ?? "کاربر"}
                            </p>
                            {user?.email && (
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            )}
                          </div>
                        </div>

                        {/* Nav links */}
                        <div className="p-2 space-y-0.5">
                          <DropdownLink to="/account" icon="bi-person-circle" label="پروفایل من" onClick={() => setAccountOpen(false)} />
                          <DropdownLink to="/account?tab=orders" icon="bi-bag-check" label="سفارشات من" onClick={() => setAccountOpen(false)} />
                          <DropdownLink to="/account?tab=wishlist" icon="bi-heart" label="علاقه‌مندی‌ها" onClick={() => setAccountOpen(false)} />
                          <DropdownLink to="/account?tab=settings" icon="bi-gear" label="تنظیمات" onClick={() => setAccountOpen(false)} />
                          <DropdownLink to="/change-password" icon="bi-shield-lock" label="تغییر رمز عبور" onClick={() => setAccountOpen(false)} />
                        </div>

                        {/* Logout button */}
                        <div className="p-3 border-t">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600
                                       text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                          >
                            <i className="bi bi-box-arrow-right"></i>
                            خروج از حساب
                          </button>
                        </div>
                      </>
                    ) : (
                      /* ── Guest state ─────────────────────────────── */
                      <>
                        <div className="p-4 border-b text-center">
                          <h6 className="font-bold">
                            به <span className="text-emerald-600">پلتفرم افرا</span> خوش آمدید
                          </h6>
                          <p className="text-xs text-emerald-500 mt-0.5">وارد شوید یا ثبت‌نام کنید</p>
                        </div>

                        <div className="p-2 space-y-0.5">
                          <DropdownLink to="/account" icon="bi-person-circle" label="پروفایل من" onClick={() => setAccountOpen(false)} />
                          <DropdownLink to="/account?tab=orders" icon="bi-bag-check" label="سفارشات من" onClick={() => setAccountOpen(false)} />
                          <DropdownLink to="/account?tab=wishlist" icon="bi-heart" label="علاقه‌مندی‌ها" onClick={() => setAccountOpen(false)} />
                          <DropdownLink to="/account?tab=settings" icon="bi-gear" label="تنظیمات" onClick={() => setAccountOpen(false)} />
                        </div>

                        <div className="p-3 border-t flex flex-col gap-2">
                          <Link
                            to="/login"
                            onClick={() => setAccountOpen(false)}
                            className="block bg-emerald-600 hover:bg-emerald-700 text-white text-center
                                       text-sm font-semibold py-2 rounded-lg transition-colors"
                          >
                            ورود
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setAccountOpen(false)}
                            className="block border border-emerald-600 text-emerald-600 hover:bg-emerald-50
                                       text-center text-sm font-semibold py-2 rounded-lg transition-colors"
                          >
                            ثبت‌نام
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              {/* ── /Account dropdown ──────────────────────────────────── */}

              {/* Wishlist */}
              <Link
                to="/account?tab=wishlist"
                className="hidden md:block text-2xl text-emerald-700 hover:text-emerald-500 relative transition-colors"
                aria-label="علاقه‌مندی‌ها"
              >
                <i className="bi bi-heart"></i>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full
                                 w-4 h-4 flex items-center justify-center leading-none">
                  0
                </span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="text-2xl text-emerald-700 hover:text-emerald-500 relative transition-colors"
                aria-label="سبد خرید"
              >
                <i className="bi bi-cart3"></i>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full
                                 w-4 h-4 flex items-center justify-center leading-none">
                  3
                </span>
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="lg:hidden text-2xl text-emerald-700"
                aria-label="منو"
              >
                <i className={`bi ${mobileMenuOpen ? "bi-x" : "bi-list"}`}></i>
              </button>

            </div>
          </div>

          {/* Mobile search bar */}
          {mobileSearchOpen && (
            <div className="mt-3 lg:hidden">
              <form className="relative">
                <input
                  type="text"
                  placeholder="جستجوی دوره‌ها..."
                  className="w-full border border-emerald-300 rounded-full py-2 px-4 pl-10
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"
                >
                  <i className="bi bi-search"></i>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom nav ────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b lg:border-b-0">
        <div className="container mx-auto px-4">

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-6 py-3">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-emerald-700 hover:text-emerald-500 font-medium transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile nav */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t mt-2">
              <ul className="flex flex-col gap-3">
                {MOBILE_NAV_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={closeMobileMenu}
                      className="block text-emerald-700 hover:text-emerald-500 transition-colors py-1"
                    >
                      {label}
                    </Link>
                  </li>
                ))}

                {/* ── Mobile auth actions ──────────────────────────── */}
                <li className="pt-3 border-t mt-1">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 px-1 pb-2">
                        <i className="bi bi-person-check-fill text-emerald-600"></i>
                        <span className="font-medium truncate">
                          {user?.first_name
                            ? `${user.first_name} ${user.last_name ?? ""}`.trim()
                            : user?.email ?? "کاربر"}
                        </span>
                      </div>
                      <Link
                        to="/account"
                        onClick={closeMobileMenu}
                        className="block text-emerald-700 hover:text-emerald-500 transition-colors py-1"
                      >
                        پروفایل من
                      </Link>
                      <Link
                        to="/change-password"
                        onClick={closeMobileMenu}
                        className="block text-emerald-700 hover:text-emerald-500 transition-colors py-1"
                      >
                        تغییر رمز عبور
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-red-500 hover:text-red-700
                                   font-medium transition-colors py-1 text-right"
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        خروج از حساب
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center
                                   text-sm font-semibold py-2 rounded-lg transition-colors"
                      >
                        ورود
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className="flex-1 border border-emerald-600 text-emerald-600 hover:bg-emerald-50
                                   text-center text-sm font-semibold py-2 rounded-lg transition-colors"
                      >
                        ثبت‌نام
                      </Link>
                    </div>
                  )}
                </li>

              </ul>
            </div>
          )}

        </div>
      </nav>
    </header>
  );
}

// ── Reusable dropdown link ────────────────────────────────────────────────────
function DropdownLink({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700
                 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
    >
      <i className={`bi ${icon} text-emerald-500 text-base`}></i>
      <span>{label}</span>
    </Link>
  );
}
