import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Contact() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "نام خود را وارد کنید";
    if (!formData.email.trim()) newErrors.email = "ایمیل خود را وارد کنید";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "ایمیل نامعتبر است";
    if (!formData.subject.trim()) newErrors.subject = "موضوع را وارد کنید";
    if (!formData.message.trim()) newErrors.message = "پیام را وارد کنید";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    setTimeout(() => {
      setStatus({
        type: "success",
        message: "پیام شما با موفقیت ارسال شد. از ارتباط شما سپاسگزاریم!",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);

      setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    }, 1500);
  };

  return (
    <main>
      <div className="bg-teal-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">تماس با ما</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-teal-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">تماس با ما</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="w-full h-80" data-aos="fade-up" data-aos-delay="200">
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387191.0360543326!2d-74.3093352!3d40.6975397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1697123456789!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full object-cover"
        ></iframe>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-4/12 px-4 mb-8 lg:mb-0">
              <div className="space-y-6">
                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="300">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-geo-alt text-teal-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">آدرس</h3>
                    <p className="text-gray-600">خیابان آدامز ۱۰۸، تهران، ایران</p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="400">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-telephone text-teal-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">تماس تلفنی</h3>
                    <p className="text-gray-600">+۹۸ ۲۱ ۱۲۳۴ ۵۶۷۸</p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="500">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-envelope text-teal-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">ایمیل</h3>
                    <p className="text-gray-600">info@example.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-8/12 px-4">
              <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap -mx-3">
                  <div className="w-full md:w-6/12 px-3 mb-4">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      placeholder="نام شما *"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="w-full md:w-6/12 px-3 mb-4">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      placeholder="ایمیل شما *"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="w-full px-3 mb-4">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      placeholder="موضوع *"
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                  </div>
                  <div className="w-full px-3 mb-4">
                    <textarea
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      placeholder="پیام شما *"
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                  <div className="w-full px-3 text-center">
                    {loading && (
                      <div className="text-teal-600 mb-3">
                        <i className="bi bi-arrow-repeat bi-spin"></i> در حال ارسال...
                      </div>
                    )}
                    {status.type === "success" && (
                      <div className="bg-teal-100 text-teal-700 p-2 rounded mb-3">{status.message}</div>
                    )}
                    {status.type === "error" && (
                      <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{status.message}</div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full font-semibold transition disabled:opacity-50"
                    >
                      ارسال پیام
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
