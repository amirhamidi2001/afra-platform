export default function Counts() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div
          className="bg-white p-4 rounded shadow-sm"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <span className="text-3xl md:text-4xl font-bold text-teal-600">1232</span>
          <p className="text-gray-600">دانشجو</p>
        </div>
        <div
          className="bg-white p-4 rounded shadow-sm"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <span className="text-3xl md:text-4xl font-bold text-teal-600">64</span>
          <p className="text-gray-600">دوره</p>
        </div>
        <div
          className="bg-white p-4 rounded shadow-sm"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <span className="text-3xl md:text-4xl font-bold text-teal-600">42</span>
          <p className="text-gray-600">رویداد</p>
        </div>
        <div
          className="bg-white p-4 rounded shadow-sm"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <span className="text-3xl md:text-4xl font-bold text-teal-600">24</span>
          <p className="text-gray-600">مدرس</p>
        </div>
      </div>
    </section>
  );
}
