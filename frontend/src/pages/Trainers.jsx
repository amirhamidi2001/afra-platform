import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Trainers() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const trainers = [
    {
      id: 1,
      name: "والتر وایت",
      specialty: "کسب‌وکار",
      description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.",
      image: "person-f-6.webp",
    },
    {
      id: 2,
      name: "سارا جانسون",
      specialty: "بازاریابی",
      description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.",
      image: "person-f-5.webp",
    },
    {
      id: 3,
      name: "ویلیام اندرسون",
      specialty: "ریاضیات",
      description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.",
      image: "person-f-4.webp",
    },
    {
      id: 4,
      name: "آماندا جپسون",
      specialty: "زبان‌های خارجی",
      description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.",
      image: "person-f-3.webp",
    },
    {
      id: 5,
      name: "برایان دو",
      specialty: "توسعه وب",
      description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.",
      image: "person-f-2.webp",
    },
    {
      id: 6,
      name: "جوزفا پالاس",
      specialty: "کسب‌وکار",
      description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.",
      image: "person-f-1.webp",
    },
  ];

  return (
    <main>
      <div className="bg-emerald-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">مدرسان ما</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-emerald-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">مدرسان ما</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <div
                key={trainer.id}
                className="bg-white rounded-lg overflow-hidden text-center group"
                data-aos="fade-up"
                data-aos-delay={100 + index * 100}
              >
                <div className="relative w-48 h-48 mx-auto mt-6 rounded-full overflow-hidden shadow-md">
                  <img
                    src={`/src/assets/img/person/${trainer.image}`}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href="#" className="text-white hover:text-emerald-400 transition text-xl">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="#" className="text-white hover:text-emerald-400 transition text-xl">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="text-white hover:text-emerald-400 transition text-xl">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="text-white hover:text-emerald-400 transition text-xl">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-bold text-gray-800">{trainer.name}</h4>
                  <span className="text-emerald-600 text-sm block mt-1">{trainer.specialty}</span>
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed">{trainer.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
