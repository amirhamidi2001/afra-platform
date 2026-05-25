const featuresList = [
  { icon: "bi-eye", color: "#ffbb2c", title: "لورم ایپسوم" },
  { icon: "bi-infinity", color: "#5578ff", title: "دلار سیتم" },
  { icon: "bi-mortarboard", color: "#e80368", title: "آموزش مدرن" },
  { icon: "bi-nut", color: "#e361ff", title: "ابزارهای پیشرفته" },
  { icon: "bi-shuffle", color: "#47aeff", title: "نمو انیم" },
  { icon: "bi-star", color: "#ffa76e", title: "ایوس مود تمپور" },
  { icon: "bi-x-diamond", color: "#11dbcf", title: "میدلا ترن" },
  { icon: "bi-camera-video", color: "#4233ff", title: "پیرا نوه" },
  { icon: "bi-command", color: "#b2904f", title: "دیرادا پک" },
  { icon: "bi-dribbble", color: "#b20969", title: "موتون ایده‌آل" },
  { icon: "bi-activity", color: "#ff5828", title: "وردو پارک" },
  { icon: "bi-brightness-high", color: "#29cc61", title: "فلیور نیولاندا" },
];

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuresList.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition"
              data-aos="fade-up"
              data-aos-delay={100 + idx * 50}
            >
              <i className={`${feat.icon} text-3xl`} style={{ color: feat.color }}></i>
              <h3 className="mt-2 font-medium text-gray-800">{feat.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
