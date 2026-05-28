export default function WhyUs() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div
          className="bg-teal-600 text-white p-8 rounded-lg"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h3 className="text-2xl font-bold">چرا محصولات ما را انتخاب کنید؟</h3>
          <p className="mt-4 text-gray-100">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.
          </p>
          <div className="mt-6 text-center">
            <a
              href="#"
              className="inline-block bg-white text-teal-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100"
            >
              بیشتر بدانید
            </a>
          </div>
        </div>

        {/* سه جعبه آیکون‌دار */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div
            className="text-center p-6 border rounded-lg shadow-sm"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <i className="bi bi-clipboard-data text-4xl text-teal-600"></i>
            <h4 className="font-bold mt-2">دوره‌های عملی</h4>
            <p className="text-gray-600 text-sm">توضیح کوتاه درباره دوره‌های عملی</p>
          </div>
          <div
            className="text-center p-6 border rounded-lg shadow-sm"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <i className="bi bi-gem text-4xl text-teal-600"></i>
            <h4 className="font-bold mt-2">مدرسان حرفه‌ای</h4>
            <p className="text-gray-600 text-sm">توضیح کوتاه درباره مدرسان</p>
          </div>
          <div
            className="text-center p-6 border rounded-lg shadow-sm col-span-2 sm:col-span-1"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <i className="bi bi-inboxes text-4xl text-teal-600"></i>
            <h4 className="font-bold mt-2">پشتیبانی ۲۴/۷</h4>
            <p className="text-gray-600 text-sm">پشتیبانی شبانه‌روزی</p>
          </div>
        </div>
      </div>
    </section>
  );
}
