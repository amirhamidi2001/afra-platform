import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Blog() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [activeTab, setActiveTab] = useState("top-stories");

  const featuredPost = {
    img: "person-f-1.webp",
    category: "سیاست",
    date: "۱۴۰۳/۰۲/۱۵",
    title: "بهینه‌سازی ابتکارات استراتژیک از طریق همکاری میان‌بخشی",
    excerpt: "استفاده از قابلیت‌های اصلی برای رشد پایدار و حداکثرسازی ارزش ذی‌نفعان از طریق راهکارهای نوآورانه و رویکردهای بازارمحور.",
    author: "جنیفر میچل",
  };

  const secondaryPosts = [
    {
      img: "person-f-2.webp",
      category: "سیاست",
      date: "۱۴۰۳/۰۱/۲۲",
      title: "پیاده‌سازی روش‌های چابک برای بهبود عملکرد کسب‌وکار",
      author: "رابرت اندرسون",
    },
    {
      img: "person-f-3.webp",
      category: "کسب‌وکار",
      date: "۱۴۰۲/۱۱/۱۰",
      title: "بهینه‌سازی عملیات از طریق راهکارهای تحول دیجیتال",
      author: "سارا تامپسون",
    },
  ];

  const tabData = {
    "top-stories": [
      { img: "person-f-1.webp", category: "علم", title: "حداکثرسازی بازگشت سرمایه از طریق تخصیص بهینه منابع", author: "مایکل دیویدسون" },
      { img: "person-f-2.webp", category: "سفر", title: "استفاده از تحلیل داده‌های بزرگ برای هوشمندی بازار", author: "امیلی ریچاردسون" },
      { img: "person-f-3.webp", category: "سیاست", title: "بهبود تجربه مشتری از طریق نوآوری دیجیتال", author: "دنیل کوپر" },
      { img: "person-f-4.webp", category: "تکنولوژی", title: "تحول مدل‌های کسب‌وکار با نوآوری دیجیتال", author: "ریچل استیونز" },
      { img: "person-f-5.webp", category: "مالی", title: "برنامه‌ریزی سرمایه‌گذاری استراتژیک برای رشد پایدار", author: "اندرو فیلیپس" },
    ],
    trending: [
      { img: "person-f-6.webp", category: "علم", title: "پیاده‌سازی شیوه‌های کسب‌وکار پایدار برای رشد بلندمدت", author: "الکساندرا فاستر" },
      { img: "person-f-7.webp", category: "سبک زندگی", title: "بهینه‌سازی زنجیره تامین از طریق ادغام فناوری", author: "کریستوفر ولز" },
      { img: "person-f-8.webp", category: "سیاست", title: "توسعه مشارکت‌های استراتژیک برای گسترش بازار", author: "ویکتوریا پالمر" },
      { img: "person-f-9.webp", category: "بازاریابی", title: "ارتقای ارزش برند با استراتژی‌های مشتری‌محور", author: "سوفیا رودریگز" },
      { img: "person-f-1.webp", category: "رهبری", title: "ساخت تیم‌های پربازده در محیط‌های پویا", author: "ناتان بروکس" },
    ],
    latest: [
      { img: "person-f-2.webp", category: "سلامت", title: "شتاب‌بخشی به نوآوری از طریق همکاری میان‌بخشی", author: "بنجامین کارتر" },
      { img: "person-f-3.webp", category: "کسب‌وکار", title: "پیشبرد رشد کسب‌وکار با ابتکارات دیجیتال استراتژیک", author: "اولیویا مارتینز" },
      { img: "person-f-4.webp", category: "ورزش", title: "حداکثرسازی کارایی عملیاتی با بهینه‌سازی فرآیندها", author: "ویلیام ترنر" },
      { img: "person-f-5.webp", category: "نوآوری", title: "استفاده از راهکارهای هوش مصنوعی برای اتوماسیون فرآیندهای کسب‌وکار", author: "ایزابلا کلارک" },
      { img: "person-f-6.webp", category: "استراتژی", title: "پیاده‌سازی چارچوب چابک برای تعالی مدیریت پروژه", author: "مارکوس هندرسون" },
    ],
  };

  const blogPosts = [
    {
      img: "person-f-1.webp",
      category: "سیاست",
      title: "دلاروم اپتیمو تمپوره ولوتاس دیگنیسیموس",
      author: "ماریا دو",
      authorImg: "person-f-1.webp",
      date: "۱۴۰۱/۱۰/۱۱",
    },
    {
      img: "person-f-2.webp",
      category: "ورزش",
      title: "نیسی مانی اودیت کانسکوتاتور اوتیم نولا دولورم",
      author: "آلیسا مایر",
      authorImg: "person-f-2.webp",
      date: "۱۴۰۱/۰۳/۱۵",
    },
    {
      img: "person-f-3.webp",
      category: "سرگرمی",
      title: "پاسییموس سولوتا اوت سوسپیت آ ایا اوت این کو کویا ات سولوتا",
      author: "مارک داور",
      authorImg: "person-f-3.webp",
      date: "۱۴۰۱/۰۴/۰۱",
    },
    {
      img: "person-f-4.webp",
      category: "ورزش",
      title: "نون رم رروم نام کووم کوم مینوس الور دیستینکتی",
      author: "لیزا نیمار",
      authorImg: "person-f-4.webp",
      date: "۱۴۰۱/۰۴/۰۹",
    },
    {
      img: "person-f-5.webp",
      category: "سیاست",
      title: "آکوساموس کوآرات آلیکوئی کوی دبیتیس فاسیلیس کانسکوتاتور",
      author: "دنیس پترسون",
      authorImg: "person-f-5.webp",
      date: "۱۴۰۱/۱۰/۳۰",
    },
    {
      img: "person-f-6.webp",
      category: "سرگرمی",
      title: "دیستینکتیو پروویدنت کویبوسدام نومکوام آپریام اوت",
      author: "میکا لندون",
      authorImg: "person-f-6.webp",
      date: "۱۴۰۱/۱۱/۲۵",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <main>
      <div className="bg-emerald-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">مجله آموزشی</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-emerald-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">مجله</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <article
                className="relative rounded-xl overflow-hidden shadow-md"
                data-aos="fade-up"
              >
                <img
                  src={`/src/assets/img/person/${featuredPost.img}`}
                  alt={featuredPost.title}
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex gap-3 text-sm mb-2">
                    <span className="bg-emerald-600 px-2 py-1 rounded text-xs">{featuredPost.category}</span>
                    <span>{featuredPost.date}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-2">
                    <a href="/blog/1" className="hover:underline">{featuredPost.title}</a>
                  </h2>
                  <p className="text-gray-200 text-sm mb-3">{featuredPost.excerpt}</p>
                  <div className="text-sm">
                    توسط <a href="#" className="hover:underline">{featuredPost.author}</a>
                  </div>
                </div>
              </article>

              <div className="grid md:grid-cols-2 gap-6">
                {secondaryPosts.map((post, idx) => (
                  <article
                    key={idx}
                    className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                    data-aos="fade-up"
                    data-aos-delay={100 * (idx + 1)}
                  >
                    <img
                      src={`/src/assets/img/person/${post.img}`}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex gap-2 text-xs text-gray-500 mb-2">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">{post.category}</span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2">
                        <a href="/blog/1" className="hover:text-emerald-600">{post.title}</a>
                      </h3>
                      <div className="text-sm text-gray-600">
                        توسط <a href="#" className="hover:text-emerald-600">{post.author}</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="bg-gray-50 rounded-lg p-4 shadow-sm" data-aos="fade-up" data-aos-delay="200">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setActiveTab("top-stories")}
                  className={`flex-1 py-2 text-center font-semibold transition ${activeTab === "top-stories" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-emerald-500"}`}
                >
                  داغ‌ترین
                </button>
                <button
                  onClick={() => setActiveTab("trending")}
                  className={`flex-1 py-2 text-center font-semibold transition ${activeTab === "trending" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-emerald-500"}`}
                >
                  پرطرفدار
                </button>
                <button
                  onClick={() => setActiveTab("latest")}
                  className={`flex-1 py-2 text-center font-semibold transition ${activeTab === "latest" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-emerald-500"}`}
                >
                  جدیدترین
                </button>
              </div>

              <div className="space-y-4">
                {tabData[activeTab].map((item, idx) => (
                  <article key={idx} className="flex gap-3 items-center">
                    <img
                      src={`/src/assets/img/person/${item.img}`}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <span className="text-xs text-emerald-600">{item.category}</span>
                      <h4 className="text-sm font-semibold line-clamp-2">
                        <a href="/blog/1" className="hover:text-emerald-600">{item.title}</a>
                      </h4>
                      <div className="text-xs text-gray-500 mt-1">توسط {item.author}</div>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10" data-aos="fade-up">
            <h2 className="text-emerald-600 font-semibold tracking-wide text-sm">آخرین مطالب</h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-800">از مجله ما</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <article
                key={idx}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                data-aos="fade-up"
                data-aos-delay={100 * (idx % 3)}
              >
                <img
                  src={`/src/assets/img/person/${post.img}`}
                  alt={post.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5">
                  <p className="text-emerald-600 text-sm mb-2">{post.category}</p>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">
                    <a href="/blog/1" className="hover:text-emerald-600">{post.title}</a>
                  </h3>
                  <div className="flex items-center gap-3 mt-4">
                    <img
                      src={`/src/assets/img/person/${post.authorImg}`}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{post.author}</p>
                      <p className="text-sm text-gray-500">{post.date}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <nav className="flex justify-center">
            <ul className="flex flex-wrap items-center gap-2">
              <li>
                <button
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  className="px-3 py-2 rounded-md border border-gray-300 hover:bg-emerald-600 hover:text-white transition"
                >
                  <i className="bi bi-arrow-right"></i> {/* RTL: arrow-right means previous */}
                  <span className="hidden sm:inline mr-1">قبلی</span>
                </button>
              </li>

              {[1, 2, 3, "...", 8, 9, 10].map((page, idx) => (
                <li key={idx}>
                  {page === "..." ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-md border transition ${
                        currentPage === page
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-gray-300 hover:bg-emerald-100"
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </li>
              ))}

              <li>
                <button
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  className="px-3 py-2 rounded-md border border-gray-300 hover:bg-emerald-600 hover:text-white transition"
                >
                  <span className="hidden sm:inline ml-1">بعدی</span>
                  <i className="bi bi-arrow-left"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}