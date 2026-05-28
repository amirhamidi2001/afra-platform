import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Courses() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const courses = [
    {
      id: 1,
      img: "course-1.webp",
      category: "توسعه وب",
      price: "$۱۶۹",
      title: "طراحی وب‌سایت",
      description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
      trainer: "آنتونیو",
      trainerImg: "person-f-4.webp",
      students: 50,
      likes: 65,
    },
    {
      id: 2,
      img: "course-2.webp",
      category: "بازاریابی",
      price: "$۲۵۰",
      title: "بهینه‌سازی موتور جستجو (SEO)",
      description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
      trainer: "لانا",
      trainerImg: "person-f-5.webp",
      students: 35,
      likes: 42,
    },
    {
      id: 3,
      img: "course-3.webp",
      category: "تولید محتوا",
      price: "$۱۸۰",
      title: "کپی‌رایتینگ حرفه‌ای",
      description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
      trainer: "براندون",
      trainerImg: "person-f-6.webp",
      students: 20,
      likes: 85,
    },
  ];

  return (
    <main>
      <div className="bg-teal-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">دوره‌های آموزشی</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-teal-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">دوره‌های آموزشی</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                data-aos="zoom-in"
                data-aos-delay={100 + index * 100}
              >
                <img
                  src={`/src/assets/img/course/${course.img}`}
                  alt={course.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded">
                      {course.category}
                    </span>
                    <span className="font-bold text-gray-800">{course.price}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    <a href={`/course/${course.id}`} className="hover:text-teal-600 transition">
                      {course.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={`/src/assets/img/person/${course.trainerImg}`}
                        alt={course.trainer}
                        className="w-8 h-8 rounded-full object-cover"
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
    </main>
  );
}
