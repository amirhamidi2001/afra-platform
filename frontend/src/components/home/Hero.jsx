import heroBg from "/src/assets/img/hero-bg.webp";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }}>
      {/* لایه تیره برای خوانایی متن */}
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 text-center text-white px-4">
        <h2
          className="text-3xl md:text-5xl font-bold leading-tight"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          امروز بیاموز، <br /> فردا رهبری کن
        </h2>
        <p
          className="mt-4 text-lg md:text-2xl text-gray-200"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          ما تیمی از طراحان با استعداد هستیم که با Bootstrap وب‌سایت می‌سازیم
        </p>
        <div
          className="mt-8"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <a
            href="/courses"
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            شروع کن
          </a>
        </div>
      </div>
    </section>
  );
}
