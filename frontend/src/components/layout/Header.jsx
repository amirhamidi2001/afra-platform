import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

export default function Header() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [openMegaMenu1, setOpenMegaMenu1] = useState(false);
  const [openMegaMenu2, setOpenMegaMenu2] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMegaMenu1(false);
    setOpenMegaMenu2(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="bg-emerald-50 text-sm py-2 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="hidden lg:flex items-center gap-1 text-emerald-600">
              <i className="bi bi-telephone-fill text-emerald-600"></i>
              <span>نیاز به کمک؟ با ما تماس بگیرید:</span>
              <a href="tel:+1234567890" className="text-emerald-600 hover:underline">+۱ (۲۳۴) ۵۶۷-۸۹۰</a>
            </div>

            <div className="w-full lg:w-auto text-center">
              <Swiper
                modules={[Autoplay, EffectFade]}
                direction="vertical"
                loop={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                speed={600}
                className="h-6"
                style={{ height: "24px" }}
              >
                <SwiperSlide>
                  <div className="text-emerald-700">🚚 ارسال رایگان برای سفارش‌های بالای ۵۰ دلار</div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="text-emerald-700">💰 ضمانت بازگشت وجه تا ۳۰ روز</div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="text-emerald-700">🎁 ۲۰٪ تخفیف برای اولین خرید</div>
                </SwiperSlide>
              </Swiper>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <div className="relative group">
                <button className="flex items-center gap-1 text-emerald-600 hover:text-emerald-600">
                  <i className="bi bi-translate"></i> فارسی
                  <i className="bi bi-chevron-down text-xs"></i>
                </button>
                <ul className="absolute left-0 top-full mt-1 w-28 bg-white shadow-md rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">English</a></li>
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">Español</a></li>
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">Français</a></li>
                </ul>
              </div>
              <div className="relative group">
                <button className="flex items-center gap-1 text-emerald-600 hover:text-emerald-600">
                  <i className="bi bi-currency-dollar"></i> USD
                  <i className="bi bi-chevron-down text-xs"></i>
                </button>
                <ul className="absolute left-0 top-full mt-1 w-24 bg-white shadow-md rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">USD</a></li>
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">EUR</a></li>
                  <li><a href="#" className="block px-3 py-1 hover:bg-emerald-100">GBP</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-3 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="text-2xl font-bold text-emerald-600 shrink-0">
              پلتفرم آموزشی افرا
            </a>

            <form className="hidden lg:block flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجوی محصولات..."
                  className="w-full border border-emerald-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden text-2xl text-emerald-700"
              >
                <i className="bi bi-search"></i>
              </button>

              <div className="relative">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="header-action-btn text-2xl text-emerald-700 hover:text-emerald-600"
                >
                  <i className="bi bi-person"></i>
                </button>
                {accountDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-white shadow-lg rounded-lg z-30">
                    <div className="p-4 border-b text-center">
                      <h6 className="font-bold">به <span className="text-emerald-600">نیس شاپ</span> خوش آمدید</h6>
                      <p className="text-xs text-emerald-500">وارد شوید یا ثبت‌نام کنید</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <a href="/account" className="flex items-center gap-2 p-2 hover:bg-emerald-100 rounded">
                        <i className="bi bi-person-circle"></i> <span>پروفایل من</span>
                      </a>
                      <a href="/account?tab=orders" className="flex items-center gap-2 p-2 hover:bg-emerald-100 rounded">
                        <i className="bi bi-bag-check"></i> <span>سفارشات من</span>
                      </a>
                      <a href="/account?tab=wishlist" className="flex items-center gap-2 p-2 hover:bg-emerald-100 rounded">
                        <i className="bi bi-heart"></i> <span>علاقه‌مندی‌ها</span>
                      </a>
                      <a href="/account?tab=settings" className="flex items-center gap-2 p-2 hover:bg-emerald-100 rounded">
                        <i className="bi bi-gear"></i> <span>تنظیمات</span>
                      </a>
                    </div>
                    <div className="p-3 border-t flex flex-col gap-2">
                      <a href="/login" className="bg-emerald-600 text-white text-center py-1 rounded hover:bg-emerald-700">ورود</a>
                      <a href="/register" className="border border-emerald-600 text-emerald-600 text-center py-1 rounded hover:bg-emerald-50">ثبت‌نام</a>
                    </div>
                  </div>
                )}
              </div>

              <a href="/account?tab=wishlist" className="hidden md:block text-2xl text-emerald-700 hover:text-emerald-600 relative">
                <i className="bi bi-heart"></i>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
              </a>

              <a href="/cart" className="text-2xl text-emerald-700 hover:text-emerald-600 relative">
                <i className="bi bi-cart3"></i>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-2xl text-emerald-700"
              >
                <i className={`bi ${mobileMenuOpen ? "bi-x" : "bi-list"}`}></i>
              </button>
            </div>
          </div>

          {mobileSearchOpen && (
            <div className="mt-3 lg:hidden">
              <form className="relative">
                <input
                  type="text"
                  placeholder="جستجوی محصولات..."
                  className="w-full border border-emerald-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-400">
                  <i className="bi bi-search"></i>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <nav className="bg-white border-b lg:border-b-0">
        <div className="container mx-auto px-4">
          <ul className="hidden lg:flex items-center gap-6 py-3">
            <li><a href="/" className="text-emerald-700 hover:text-emerald-600 font-medium">خانه</a></li>
            <li><a href="/about" className="text-emerald-700 hover:text-emerald-600">درباره ما</a></li>
            <li><a href="/courses" className="text-emerald-700 hover:text-emerald-600">دوره ها</a></li>
            <li><a href="/trainers" className="text-emerald-700 hover:text-emerald-600">مدرسان ما</a></li>
            <li><a href="/cart" className="text-emerald-700 hover:text-emerald-600">سبد خرید</a></li>
            <li><a href="/checkout" className="text-emerald-700 hover:text-emerald-600">تسویه حساب</a></li>
            <li><a href="/blog" className="text-emerald-700 hover:text-emerald-600">مجله آموزشی</a></li>
            <li><a href="/contact" className="text-emerald-700 hover:text-emerald-600">تماس با ما</a></li>
          </ul>

          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t mt-2">
              <ul className="flex flex-col gap-3">
                <li><a href="/" onClick={closeMobileMenu} className="block text-emerald-700 hover:text-emerald-600">خانه</a></li>
                <li><a href="/about" onClick={closeMobileMenu} className="block text-emerald-700 hover:text-emerald-600">درباره ما</a></li>
                <li><a href="/category" onClick={closeMobileMenu} className="block text-emerald-700 hover:text-emerald-600">دسته‌بندی</a></li>
                <li><a href="/product-details" onClick={closeMobileMenu} className="block text-emerald-700 hover:text-emerald-600">جزئیات محصول</a></li>
                <li><a href="/cart" onClick={closeMobileMenu} className="block text-emerald-700 hover:text-emerald-600">سبد خرید</a></li>
                <li><a href="/checkout" onClick={closeMobileMenu} className="block text-emerald-700 hover:text-emerald-600">تسویه حساب</a></li>

                <li>
                  <button onClick={() => setOpenMegaMenu1(!openMegaMenu1)} className="flex justify-between items-center w-full text-emerald-700 hover:text-emerald-600">
                    منوی کشویی <i className={`bi bi-chevron-${openMegaMenu1 ? 'up' : 'down'}`}></i>
                  </button>
                  {openMegaMenu1 && (
                    <ul className="mr-4 mt-2 space-y-2 border-r-2 border-emerald-200 pr-3">
                      <li><a href="#" className="block text-emerald-600">آیتم ۱</a></li>
                      <li><a href="#" className="block text-emerald-600">آیتم ۲</a></li>
                      <li><button onClick={() => alert("زیرمنو")} className="text-emerald-600">زیرمنو</button></li>
                    </ul>
                  )}
                </li>
                <li>
                  <button onClick={() => setOpenMegaMenu2(!openMegaMenu2)} className="flex justify-between items-center w-full text-emerald-700 hover:text-emerald-600">
                    مگامنو ۱ <i className={`bi bi-chevron-${openMegaMenu2 ? 'up' : 'down'}`}></i>
                  </button>
                  {openMegaMenu2 && (
                    <div className="mr-4 mt-2 grid grid-cols-2 gap-3 border-r-2 border-emerald-200 pr-3">
                      <div><h4 className="font-bold">پوشاک</h4><a href="#" className="text-sm block">مردانه</a><a href="#" className="text-sm block">زنانه</a></div>
                      <div><h4 className="font-bold">الکترونیک</h4><a href="#" className="text-sm block">موبایل</a><a href="#" className="text-sm block">لپ‌تاپ</a></div>
                    </div>
                  )}
                </li>
                <li><a href="/contact" onClick={closeMobileMenu} className="block text-emerald-700 hover:text-emerald-600">تماس با ما</a></li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
