import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function OrderConfirmation() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [openCards, setOpenCards] = useState({
    shipping: true,
    payment: false,
    items: false,
  });

  const toggleCard = (card) => {
    setOpenCards((prev) => ({ ...prev, [card]: !prev[card] }));
  };

  const orderData = {
    id: "ORD-۹۳۵۷۲۱",
    date: "۲ اسفند ۱۴۰۴",
    subtotal: 219.97,
    shipping: 0,
    tax: 18.7,
    total: 238.67,
    estimatedDelivery: "۷-۹ اسفند ۱۴۰۴",
    shippingMethod: "ارسال رایگان",
    customer: {
      name: "مایکل تامپسون",
      address: "۷۸۹ خیابان اوکوود، سیاتل، WA 98101، ایالات متحده",
      email: "michael.t@example.com",
      phone: "(206) 555-1234",
    },
    payment: {
      method: "American Express",
      last4: "۳۷۸۲",
      billingSame: true,
    },
    items: [
      {
        id: 1,
        name: "اسپیکر بلوتوث بی‌سیم",
        color: "آبی نفتی",
        price: 129.99,
        quantity: 1,
        image: "person-f-4.webp",
      },
      {
        id: 2,
        name: "ردیاب تناسب اندام هوشمند",
        color: "مشکی",
        size: "M",
        price: 89.98,
        quantity: 1,
        image: "person-f-5.webp",
      },
    ],
  };

  const recommended = [
    { id: 1, name: "هدفون بی‌سیم", price: 59.99, image: "person-f-1.webp" },
    { id: 2, name: "شارژر همراه قابل حمل", price: 34.99, image: "person-f-2.webp" },
    { id: 3, name: "ساعت هوشمند", price: 149.99, image: "person-f-3.webp" },
  ];

  return (
    <main>
      <div className="bg-teal-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">تأیید سفارش</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-teal-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">تأیید سفارش</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-4/12 px-4 mb-8 lg:mb-0">
              <div className="bg-gradient-to-br from-teal-700 to-teal-800 text-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                <div className="p-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                    <i className="bi bi-check-lg text-4xl relative z-10"></i>
                  </div>

                  <div className="text-center mb-6 pb-6 border-b border-white/20">
                    <h4 className="text-xl font-bold">سفارش #{orderData.id}</h4>
                    <div className="text-sm text-gray-200 mt-1">{orderData.date}</div>
                  </div>

                  <div className="mb-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white text-teal-700 rounded-full flex items-center justify-center font-bold">1</div>
                        <span className="font-medium">تأیید شده</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white text-teal-700 rounded-full flex items-center justify-center font-bold">2</div>
                        <span className="font-medium text-white">در حال پردازش</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center font-bold">3</div>
                        <span className="text-gray-300">ارسال شده</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center font-bold">4</div>
                        <span className="text-gray-300">تحویل داده شده</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-white/20">
                    <h5 className="font-bold mb-3">خلاصه سفارش</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>جمع جزء</span>
                        <span>${orderData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>حمل و نقل</span>
                        <span>${orderData.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مالیات</span>
                        <span>${orderData.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-white/20">
                        <span>جمع کل</span>
                        <span>${orderData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="font-bold mb-3">اطلاعات تحویل</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <i className="bi bi-calendar-check"></i>
                        <span>تخمین تحویل: {orderData.estimatedDelivery}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="bi bi-truck"></i>
                        <span>{orderData.shippingMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold mb-3">نیاز به کمک؟</h5>
                    <div className="space-y-2">
                      <a href="#" className="flex items-center gap-2 text-sm hover:text-gray-200 transition">
                        <i className="bi bi-chat-dots"></i>
                        <span>تماس با پشتیبانی</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 text-sm hover:text-gray-200 transition">
                        <i className="bi bi-question-circle"></i>
                        <span>سؤالات متداول</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-8/12 px-4">
              <div className="mb-8 text-center md:text-right" data-aos="fade-up">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">از سفارش شما متشکریم!</h1>
                <p className="text-gray-600">
                  سفارش شما دریافت شده و به زودی پردازش خواهد شد. به‌روزرسانی‌ها را از طریق ایمیل برای شما ارسال خواهیم کرد.
                </p>
              </div>

              <div className="bg-white border rounded-lg overflow-hidden mb-5 shadow-sm" data-aos="fade-up">
                <button
                  onClick={() => toggleCard("shipping")}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition text-right"
                >
                  <h3 className="font-bold flex items-center gap-2">
                    <i className="bi bi-geo-alt text-teal-600"></i>
                    جزئیات ارسال
                  </h3>
                  <i className={`bi bi-chevron-${openCards.shipping ? "up" : "down"} text-gray-500 transition`}></i>
                </button>
                {openCards.shipping && (
                  <div className="p-4 border-t">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">ارسال به</label>
                        <address className="not-italic text-gray-600">
                          {orderData.customer.name}<br />
                          {orderData.customer.address}
                        </address>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">تماس</label>
                        <div className="space-y-1 text-gray-600">
                          <p><i className="bi bi-envelope ml-2"></i> {orderData.customer.email}</p>
                          <p><i className="bi bi-telephone ml-2"></i> {orderData.customer.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border rounded-lg overflow-hidden mb-5 shadow-sm" data-aos="fade-up">
                <button
                  onClick={() => toggleCard("payment")}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition text-right"
                >
                  <h3 className="font-bold flex items-center gap-2">
                    <i className="bi bi-credit-card text-teal-600"></i>
                    جزئیات پرداخت
                  </h3>
                  <i className={`bi bi-chevron-${openCards.payment ? "up" : "down"} text-gray-500 transition`}></i>
                </button>
                {openCards.payment && (
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <i className="bi bi-credit-card-2-front text-teal-600 text-xl"></i>
                      </div>
                      <div>
                        <div className="font-semibold">{orderData.payment.method}</div>
                        <div className="text-sm text-gray-500">•••• •••• •••• {orderData.payment.last4}</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm">آدرس صورتحساب</h5>
                      <p className="text-sm text-gray-600 mt-1">همان آدرس ارسال است</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border rounded-lg overflow-hidden mb-8 shadow-sm" data-aos="fade-up">
                <button
                  onClick={() => toggleCard("items")}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition text-right"
                >
                  <h3 className="font-bold flex items-center gap-2">
                    <i className="bi bi-bag-check text-teal-600"></i>
                    اقلام سفارش
                  </h3>
                  <i className={`bi bi-chevron-${openCards.items ? "up" : "down"} text-gray-500 transition`}></i>
                </button>
                {openCards.items && (
                  <div className="p-4 border-t space-y-4">
                    {orderData.items.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={`/src/assets/img/person/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.color && <span>رنگ: {item.color}</span>}
                            {item.size && <span className="mr-2">سایز: {item.size}</span>}
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-sm">تعداد: {item.quantity}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mb-10" data-aos="fade-up">
                <a href="/" className="flex-1 text-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition">
                  <i className="bi bi-arrow-right ml-1"></i> بازگشت به فروشگاه
                </a>
                <a href="/account" className="flex-1 text-center bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2">
                  <span>مشاهده در حساب کاربری</span>
                  <i className="bi bi-arrow-left"></i>
                </a>
              </div>

              <div data-aos="fade-up">
                <h3 className="text-xl font-bold mb-4 relative inline-block after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-12 after:h-0.5 after:bg-teal-600 pb-2">
                  ممکن است به اینها نیز علاقه داشته باشید
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {recommended.map((product) => (
                    <div key={product.id} className="bg-gray-50 rounded-lg p-3 text-center hover:shadow-md transition">
                      <div className="h-32 flex items-center justify-center mb-2">
                        <img
                          src={`/src/assets/img/person/${product.image}`}
                          alt={product.name}
                          className="max-h-full object-contain"
                        />
                      </div>
                      <h5 className="font-medium text-sm">{product.name}</h5>
                      <div className="text-teal-600 font-bold mt-1">${product.price.toFixed(2)}</div>
                      <button className="mt-2 w-full bg-white border border-teal-600 text-teal-600 py-1 rounded-full text-sm hover:bg-teal-600 hover:text-white transition flex items-center justify-center gap-1">
                        <i className="bi bi-plus"></i> افزودن به سبد
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
