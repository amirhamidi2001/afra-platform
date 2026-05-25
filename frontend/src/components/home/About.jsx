import aboutImg from "/src/assets/img/about/about-1.webp";

export default function About() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div
          className="order-2 md:order-2"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <img src={aboutImg} alt="درباره ما" className="rounded-lg shadow-md w-full" />
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
              <i className="bi bi-check-circle text-emerald-500 mt-1"></i>
              <span>لورم ایپسوم متن ساختگی</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="bi bi-check-circle text-emerald-500 mt-1"></i>
              <span>دومین مورد توضیحات</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="bi bi-check-circle text-emerald-500 mt-1"></i>
              <span>سومین مورد بلندتر برای تست</span>
            </li>
          </ul>
          <a
            href="#"
            className="mt-6 inline-flex items-center text-emerald-600 font-semibold hover:gap-2 transition-all"
          >
            بیشتر بخوانید <i className="bi bi-arrow-left mr-1"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
