const trainersData = [
  {
    name: "والتر وایت",
    field: "توسعه وب",
    img: "person-f-1.webp",
    desc: "متن کوتاه درباره والتر وایت و تخصص او در توسعه وب",
  },
  {
    name: "سارا جانسون",
    field: "بازاریابی",
    img: "person-f-2.webp",
    desc: "متن کوتاه درباره سارا جانسون و تخصص او در بازاریابی دیجیتال",
  },
  {
    name: "ویلیام اندرسون",
    field: "تولید محتوا",
    img: "person-f-3.webp",
    desc: "متن کوتاه درباره ویلیام اندرسون و تخصص او در تولید محتوا",
  },
];

export default function Trainers() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {trainersData.map((trainer, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden text-center p-6"
              data-aos="fade-up"
              data-aos-delay={100 + idx * 100}
            >
              <img
                src={`/src/assets/img/person/${trainer.img}`}
                className="w-32 h-32 rounded-full mx-auto object-cover"
                alt={trainer.name}
              />
              <h4 className="mt-4 text-xl font-bold">{trainer.name}</h4>
              <span className="text-teal-600 text-sm">{trainer.field}</span>
              <p className="text-gray-600 text-sm mt-2">{trainer.desc}</p>
              <div className="flex justify-center gap-3 mt-4">
                <a href="#" className="text-gray-500 hover:text-teal-600"><i className="bi bi-twitter-x"></i></a>
                <a href="#" className="text-gray-500 hover:text-teal-600"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-gray-500 hover:text-teal-600"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-gray-500 hover:text-teal-600"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
