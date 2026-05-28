import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Swiper from "swiper";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function About() {
  const swiperRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    if (swiperRef.current) {
      new Swiper(swiperRef.current, {
        modules: [Pagination, Autoplay],
        loop: true,
        speed: 600,
        autoplay: { delay: 5000, disableOnInteraction: false },
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: {
          768: { slidesPerView: 1, spaceBetween: 20 },
          1024: { slidesPerView: 2, spaceBetween: 30 },
        },
      });
    }
  }, []);

  const testimonials = [
    {
      img: "person-f-1.webp",
      name: "سال گودمن",
      position: "مدیرعامل و بنیان‌گذار",
      stars: 5,
      text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
    },
    {
      img: "person-f-2.webp",
      name: "سارا ویلسون",
      position: "طراح",
      stars: 5,
      text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
    },
    {
      img: "person-f-3.webp",
      name: "جنا کارلیس",
      position: "صاحب فروشگاه",
      stars: 5,
      text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
    },
    {
      img: "person-f-4.webp",
      name: "مت براندون",
      position: "فریلنسر",
      stars: 5,
      text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
    },
    {
      img: "person-f-5.webp",
      name: "جان لارسون",
      position: "کارآفرین",
      stars: 5,
      text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
    },
  ];

  return (
    <main>
      <div className="bg-teal-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">درباره ما</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-teal-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">درباره ما</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div
              className="order-2 md:order-2"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img
                src="/src/assets/img/about/about-1.webp"
                alt="درباره ما"
                className="rounded-lg shadow-md w-full"
              />
            </div>
            <div
              className="order-1 md:order-1"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                لورم ایپسوم متن ساختگی
              </h3>
              <p className="italic text-gray-600 mt-2">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2">
                  <i className="bi bi-check-circle text-teal-500 mt-1"></i>
                  <span>لورم ایپسوم متن ساختگی</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="bi bi-check-circle text-teal-500 mt-1"></i>
                  <span>دومین مورد توضیحات</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="bi bi-check-circle text-teal-500 mt-1"></i>
                  <span>سومین مورد بلندتر برای تست</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="bg-white p-4 rounded shadow-sm">
              <span className="text-3xl md:text-4xl font-bold text-teal-600">1232</span>
              <p className="text-gray-600">دانشجو</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <span className="text-3xl md:text-4xl font-bold text-teal-600">64</span>
              <p className="text-gray-600">دوره</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <span className="text-3xl md:text-4xl font-bold text-teal-600">42</span>
              <p className="text-gray-600">رویداد</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <span className="text-3xl md:text-4xl font-bold text-teal-600">24</span>
              <p className="text-gray-600">مدرس</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-teal-600 font-semibold tracking-wide text-sm">نظرات</h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-800">دانشجویان چه می‌گویند؟</p>
          </div>

          <div
            dir="rtl"
            ref={swiperRef}
            className="swiper-container overflow-hidden relative pb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="swiper-wrapper">
              {testimonials.map((item, idx) => (
                <div key={idx} className="swiper-slide h-auto">
                  <div className="bg-gray-50 rounded-lg shadow-md p-6 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={`/src/assets/img/person/${item.img}`}
                        alt={item.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-teal-100"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <h4 className="text-gray-500 text-sm">{item.position}</h4>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 mb-3">
                      {[...Array(item.stars)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill"></i>
                      ))}
                    </div>
                    <p className="text-gray-600 italic leading-relaxed flex-1">
                      <i className="bi bi-quote text-teal-300 ml-1"></i>
                      {item.text}
                      <i className="bi bi-quote text-teal-300 mr-1"></i>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="swiper-pagination !bottom-0"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
