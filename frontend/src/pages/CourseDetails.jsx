import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function CourseDetails() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [openModules, setOpenModules] = useState({
    1: true,
    2: false,
    3: false,
  });

  const toggleModule = (id) => {
    setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const modules = [
    {
      id: 1,
      title: "ماژول ۱: مقدمه‌ای بر توسعه وب مدرن",
      lessonsCount: "۶ درس • ۳ ساعت",
      lessons: [
        { title: "راه‌اندازی محیط توسعه", duration: "۱۸ دقیقه", type: "video" },
        { title: "مرور مبانی جاوااسکریپت", duration: "۲۵ دقیقه", type: "video" },
        { title: "آشنایی با ابزارهای مدرن توسعه", duration: "۳۲ دقیقه", type: "text" },
        { title: "نصب و راه‌اندازی Git", duration: "۱۵ دقیقه", type: "video" },
        { title: "اولین پروژه عملی", duration: "۴۰ دقیقه", type: "project" },
        { title: "جمع‌بندی و تمرین", duration: "۲۰ دقیقه", type: "quiz" },
      ],
    },
    {
      id: 2,
      title: "ماژول ۲: مبانی React.js",
      lessonsCount: "۸ درس • ۵ ساعت",
      lessons: [
        { title: "معماری کامپوننت و JSX", duration: "۲۸ دقیقه", type: "video" },
        { title: "مدیریت state و props", duration: "۳۵ دقیقه", type: "video" },
        { title: "مدیریت رویدادها و فرم‌ها", duration: "۴۲ دقیقه", type: "video" },
        { title: "چرخه حیات کامپوننت‌ها", duration: "۳۰ دقیقه", type: "text" },
        { title: "ارتباط با API", duration: "۵۵ دقیقه", type: "project" },
        { title: "React Hooks عمیق", duration: "۴۵ دقیقه", type: "video" },
        { title: "مسیریابی با React Router", duration: "۳۵ دقیقه", type: "video" },
        { title: "پروژه نهایی ماژول", duration: "۶۰ دقیقه", type: "project" },
      ],
    },
    {
      id: 3,
      title: "ماژول ۳: توسعه بک‌اند با Node.js",
      lessonsCount: "۱۰ درس • ۶ ساعت",
      lessons: [
        { title: "راه‌اندازی سرور Express.js", duration: "۲۲ دقیقه", type: "video" },
        { title: "ساخت RESTful API", duration: "۴۵ دقیقه", type: "video" },
        { title: "اتصال به پایگاه داده MongoDB", duration: "۵۰ دقیقه", type: "video" },
        { title: "احراز هویت و امنیت", duration: "۴۰ دقیقه", type: "text" },
        { title: "مدیریت خطا و لاگینگ", duration: "۳۰ دقیقه", type: "video" },
        { title: "آموزش و اعتبارسنجی داده", duration: "۳۵ دقیقه", type: "video" },
        { title: "تست واحد یکپارچه", duration: "۴۵ دقیقه", type: "video" },
        { title: "استقرار در بستر ابری", duration: "۵۵ دقیقه", type: "project" },
        { title: "پروژه فروشگاه آنلاین", duration: "۹۰ دقیقه", type: "project" },
        { title: "مرور و تمرین", duration: "۳۰ دقیقه", type: "quiz" },
      ],
    },
  ];

  const tabsData = [
    {
      id: 1,
      title: "معماری نرم‌افزار مدرن",
      desc: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
      image: "illustration-13.webp",
    },
    {
      id: 2,
      title: "توسعه چابک و همکاری تیمی",
      desc: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
      image: "illustration-11.webp",
    },
    {
      id: 3,
      title: "بهترین شیوه‌های کدنویسی",
      desc: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
      image: "illustration-14.webp",
    },
    {
      id: 4,
      title: "پروژه‌های عملی و نمونه‌کار",
      desc: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
      image: "illustration-12.webp",
    },
    {
      id: 5,
      title: "آمادگی برای بازار کار",
      desc: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
      image: "illustration-10.webp",
    },
  ];

  const [activeTab, setActiveTab] = useState(1);

  return (
    <main>
      <div className="bg-emerald-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">جزئیات دوره</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-emerald-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li><a href="/blog" className="text-emerald-600 hover:underline">دوره ها</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">جزئیات دوره</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-8/12 px-4">
              <div data-aos="fade-up" data-aos-delay="200">
                <div className="rounded-xl overflow-hidden shadow-md mb-6">
                  <img
                    src="/src/assets/img/course/course-details-1.webp"
                    alt="دوره پیشرفته وب"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <img
                      src="/src/assets/img/person/person-f-3.webp"
                      alt="مدرس"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h6 className="font-bold">دکتر سارا میچل</h6>
                      <span className="text-sm text-gray-500">استاد علوم کامپیوتر</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div><i className="bi bi-people ml-1"></i> ۲,۸۴۷ دانشجو</div>
                    <div><i className="bi bi-clock ml-1"></i> ۴۰ ساعت</div>
                    <div><i className="bi bi-calendar ml-1"></i> ۱۶ هفته</div>
                  </div>
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="300">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">مبانی پیشرفته توسعه وب</h2>
                <div className="text-gray-600 space-y-4">
                  <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                  <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-8" data-aos="fade-up" data-aos-delay="400">
                <h3 className="text-xl font-bold mb-4">آنچه یاد خواهید گرفت</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><i className="bi bi-check-circle text-emerald-600"></i> مبانی جاوااسکریپت مدرن و ES6+</li>
                    <li className="flex items-center gap-2"><i className="bi bi-check-circle text-emerald-600"></i> توسعه مبتنی بر کامپوننت React.js</li>
                    <li className="flex items-center gap-2"><i className="bi bi-check-circle text-emerald-600"></i> مبانی بک‌اند با Node.js</li>
                    <li className="flex items-center gap-2"><i className="bi bi-check-circle text-emerald-600"></i> طراحی پایگاه داده و یکپارچه‌سازی MongoDB</li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><i className="bi bi-check-circle text-emerald-600"></i> توسعه و تست RESTful API</li>
                    <li className="flex items-center gap-2"><i className="bi bi-check-circle text-emerald-600"></i> امنیت و احراز هویت</li>
                    <li className="flex items-center gap-2"><i className="bi bi-check-circle text-emerald-600"></i> استراتژی‌های استقرار و مبانی DevOps</li>
                    <li className="flex items-center gap-2"><i className="bi bi-check-circle text-emerald-600"></i> کنترل نسخه با Git و همکاری تیمی</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8" data-aos="fade-up" data-aos-delay="500">
                <h3 className="text-xl font-bold mb-4">سرفصل‌های دوره</h3>
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition text-right"
                      >
                        <div className="flex items-center gap-2">
                          <i className={`bi ${openModules[module.id] ? 'bi-chevron-up' : 'bi-chevron-down'} text-emerald-600`}></i>
                          <span className="font-semibold">{module.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">{module.lessonsCount}</span>
                      </button>
                      {openModules[module.id] && (
                        <div className="divide-y">
                          {module.lessons.map((lesson, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50">
                              <div className="flex items-center gap-2">
                                <i className={`bi ${lesson.type === 'video' ? 'bi-play-circle' :
                                    lesson.type === 'text' ? 'bi-file-text' :
                                      lesson.type === 'project' ? 'bi-code-square' :
                                        'bi-question-circle'
                                  } text-emerald-600`}></i>
                                <span>{lesson.title}</span>
                              </div>
                              <span className="text-sm text-gray-500">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-4/12 px-4 mt-8 lg:mt-0">
              <div className="sticky top-24 space-y-6" data-aos="fade-left" data-aos-delay="200">
                <div className="bg-gray-50 rounded-lg p-6 text-center border">
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-emerald-600">$۱۹۹</span>
                    <span className="text-gray-500"> / دوره</span>
                    <div className="text-gray-400 line-through text-sm">$۲۹۹</div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="flex justify-between"><span>۴۰ ساعت محتوا</span><i className="bi bi-clock"></i></div>
                    <div className="flex justify-between"><span>گواهی پایان دوره</span><i className="bi bi-trophy"></i></div>
                    <div className="flex justify-between"><span>دسترسی موبایل و دسکتاپ</span><i className="bi bi-phone"></i></div>
                    <div className="flex justify-between"><span>دسترسی مادام‌العمر</span><i className="bi bi-infinity"></i></div>
                  </div>
                  <button className="w-full bg-emerald-600 text-white py-2 rounded-full mt-4 hover:bg-emerald-700 transition">ثبت‌نام در دوره</button>
                  <button className="w-full border border-emerald-600 text-emerald-600 py-2 rounded-full mt-2 hover:bg-emerald-50 transition">پیش‌نمایش دوره</button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold border-b pb-2 mb-3">اطلاعات دوره</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>سطح:</span><span className="font-medium">متوسط</span></div>
                    <div className="flex justify-between"><span>دانشجو:</span><span className="font-medium">۲,۸۴۷ نفر</span></div>
                    <div className="flex justify-between"><span>زبان:</span><span className="font-medium">فارسی</span></div>
                    <div className="flex justify-between"><span>پیش‌نیاز:</span><span className="font-medium">HTML و CSS پایه</span></div>
                    <div className="flex justify-between"><span>آخرین بروزرسانی:</span><span className="font-medium">آبان ۱۴۰۴</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold border-b pb-2 mb-3">برچسب‌ها</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">توسعه وب</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">جاوااسکریپت</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">React</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">Node.js</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">فول استک</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">برنامه‌نویسی</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-3/12 px-4 mb-6 lg:mb-0">
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                {tabsData.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-right rounded-lg transition whitespace-nowrap lg:whitespace-normal ${activeTab === tab.id
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-700 hover:bg-emerald-100"
                      }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-9/12 px-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                {tabsData.map((tab) => (
                  <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="md:w-8/12 order-2 md:order-1">
                        <h3 className="text-xl font-bold mb-3">{tab.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{tab.desc}</p>
                      </div>
                      <div className="md:w-4/12 order-1 md:order-2">
                        <img
                          src={`/src/assets/img/illustration/${tab.image}`}
                          alt={tab.title}
                          className="max-w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
