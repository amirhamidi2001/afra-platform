const coursesData = [
  {
    img: "course-1.webp",
    category: "توسعه وب",
    price: "$169",
    title: "طراحی وب‌سایت",
    desc: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.",
    trainer: "آنتونیو",
    trainerImg: "person-f-4.webp",
    students: 50,
    likes: 65,
  },
  {
    img: "course-2.webp",
    category: "بازاریابی",
    price: "$250",
    title: "بهینه‌سازی موتور جستجو",
    desc: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.",
    trainer: "لانا",
    trainerImg: "person-f-5.webp",
    students: 35,
    likes: 42,
  },
  {
    img: "course-3.webp",
    category: "تولید محتوا",
    price: "$180",
    title: "کپی‌رایتینگ",
    desc: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.",
    trainer: "براندون",
    trainerImg: "person-f-6.webp",
    students: 20,
    likes: 85,
  },
];

export default function Courses() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-emerald-600 font-semibold tracking-wide text-sm">دوره‌ها</h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-800">دوره‌های محبوب</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesData.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              data-aos="zoom-in"
              data-aos-delay={100 + idx * 100}
            >
              <img
                src={`/src/assets/img/course/${course.img}`}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded">
                    {course.category}
                  </span>
                  <span className="font-bold text-gray-800">{course.price}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.desc}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      src={`/src/assets/img/person/${course.trainerImg}`}
                      className="w-8 h-8 rounded-full"
                      alt={course.trainer}
                    />
                    <span className="text-sm font-medium">{course.trainer}</span>
                  </div>
                  <div className="flex gap-3 text-sm text-gray-500">
                    <span><i className="bi bi-person"></i> {course.students}</span>
                    <span><i className="bi bi-heart"></i> {course.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
