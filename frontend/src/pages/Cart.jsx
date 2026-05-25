import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Cart() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const initialCartItems = [
    {
      id: 1,
      title: "لورم ایپسوم متن ساختگی",
      color: "مشکی",
      size: "M",
      price: 89.99,
      quantity: 1,
      image: "person-f-1.webp",
    },
    {
      id: 2,
      title: "لورم ایپسوم متن دوم",
      color: "سفید",
      size: "L",
      price: 64.99,
      originalPrice: 79.99,
      quantity: 2,
      image: "person-f-3.webp",
    },
    {
      id: 3,
      title: "لورم ایپسوم متن سوم",
      color: "آبی",
      size: "S",
      price: 49.99,
      quantity: 1,
      image: "person-f-5.webp",
    },
  ];

  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState("standard"); // standard, express, free
  const [couponApplied, setCouponApplied] = useState(false);

  const taxRate = 0.1;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingCost = (() => {
    if (shippingMethod === "standard") return 4.99;
    if (shippingMethod === "express") return 12.99;
    return 0; // free
  })();

  const tax = subtotal * taxRate;

  const totalBeforeDiscount = subtotal + shippingCost + tax;

  const finalTotal = Math.max(0, totalBeforeDiscount - discount);

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity < 10
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleQuantityChange = (id, value) => {
    const newQty = parseInt(value, 10);
    if (!isNaN(newQty) && newQty >= 1 && newQty <= 10) {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setCouponApplied(false);
    setCouponCode("");
  };

  const updateCart = () => {
    alert("سبد خرید به‌روز شد");
  };

  const applyCoupon = () => {
    if (couponCode === "SAVE10" && !couponApplied) {
      setDiscount(10);
      setCouponApplied(true);
      alert("کد تخفیف با موفقیت اعمال شد");
    } else if (couponApplied) {
      alert("کد تخفیف قبلاً اعمال شده است");
    } else {
      alert("کد تخفیف نامعتبر است");
    }
  };

  const getItemTotal = (item) => item.price * item.quantity;

  return (
    <main>
      <div className="bg-emerald-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">سبد خرید</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-emerald-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">سبد خرید</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-8/12 px-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="hidden lg:block bg-gray-50 px-6 py-3 border-b">
                  <div className="flex items-center text-sm font-semibold text-gray-600">
                    <div className="w-6/12">محصول</div>
                    <div className="w-2/12 text-center">قیمت</div>
                    <div className="w-2/12 text-center">تعداد</div>
                    <div className="w-2/12 text-center">جمع</div>
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <i className="bi bi-cart-x text-5xl"></i>
                    <p className="mt-2">سبد خرید شما خالی است</p>
                    <a href="/shop" className="inline-block mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700">
                      شروع خرید
                    </a>
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div key={item.id} className="border-b last:border-b-0 p-4 lg:p-6">
                        <div className="flex flex-wrap items-center gap-4 lg:gap-0">
                          <div className="w-full lg:w-6/12 flex items-center gap-4">
                            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={`/src/assets/img/person/${item.image}`}
                                alt={item.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <h6 className="font-semibold text-gray-800">{item.title}</h6>
                              <div className="text-sm text-gray-500 mt-1">
                                <span>رنگ: {item.color}</span> | <span>سایز: {item.size}</span>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 text-sm mt-2 flex items-center gap-1 hover:text-red-700"
                              >
                                <i className="bi bi-trash"></i> حذف
                              </button>
                            </div>
                          </div>

                          <div className="w-full lg:w-2/12 text-center lg:text-center">
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                            {item.originalPrice && (
                              <span className="text-gray-400 line-through text-sm mr-2">${item.originalPrice.toFixed(2)}</span>
                            )}
                          </div>

                          <div className="w-full lg:w-2/12 flex justify-center">
                            <div className="inline-flex items-center border rounded-md">
                              <button
                                onClick={() => decreaseQuantity(item.id)}
                                className="px-3 py-1 hover:bg-gray-100"
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                className="w-12 text-center border-x py-1 outline-none"
                                min="1"
                                max="10"
                              />
                              <button
                                onClick={() => increaseQuantity(item.id)}
                                className="px-3 py-1 hover:bg-gray-100"
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </div>

                          <div className="w-full lg:w-2/12 text-center font-bold text-gray-800">
                            ${getItemTotal(item).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="text"
                          placeholder="کد تخفیف"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          onClick={applyCoupon}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700"
                        >
                          اعمال کوپن
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={updateCart}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-100"
                        >
                          <i className="bi bi-arrow-clockwise"></i> به‌روزرسانی
                        </button>
                        <button
                          onClick={clearCart}
                          className="border border-red-300 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-50"
                        >
                          <i className="bi bi-trash"></i> پاک کردن سبد
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="w-full lg:w-4/12 px-4 mt-8 lg:mt-0">
              <div className="bg-gray-50 rounded-lg shadow-md p-6" data-aos="fade-up" data-aos-delay="200">
                <h4 className="text-xl font-bold border-b pb-3 mb-4">خلاصه سفارش</h4>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>جمع جزء</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="font-medium mb-2">حمل و نقل</div>
                    <div className="space-y-2">
                      <label className="flex justify-between items-center cursor-pointer">
                        <span>ارسال معمولی - $4.99</span>
                        <input
                          type="radio"
                          name="shipping"
                          value="standard"
                          checked={shippingMethod === "standard"}
                          onChange={() => setShippingMethod("standard")}
                          className="ml-2"
                        />
                      </label>
                      <label className="flex justify-between items-center cursor-pointer">
                        <span>ارسال سریع - $12.99</span>
                        <input
                          type="radio"
                          name="shipping"
                          value="express"
                          checked={shippingMethod === "express"}
                          onChange={() => setShippingMethod("express")}
                          className="ml-2"
                        />
                      </label>
                      <label className="flex justify-between items-center cursor-pointer">
                        <span>ارسال رایگان (سفارش بالای $300)</span>
                        <input
                          type="radio"
                          name="shipping"
                          value="free"
                          checked={shippingMethod === "free"}
                          onChange={() => setShippingMethod("free")}
                          className="ml-2"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span>مالیات (۱۰%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>تخفیف</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>جمع کل</span>
                    <span className="text-emerald-700">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert("تسویه حساب - ادامه به درگاه پرداخت")}
                  className="w-full bg-emerald-600 text-white py-2 rounded-full mt-6 hover:bg-emerald-700 transition flex justify-center items-center gap-2"
                >
                  ادامه به تسویه حساب <i className="bi bi-arrow-left"></i>
                </button>

                <a
                  href="/"
                  className="block text-center text-emerald-600 mt-4 hover:underline"
                >
                  <i className="bi bi-arrow-right"></i> ادامه خرید
                </a>

                <div className="mt-6 pt-4 border-t text-center">
                  <p className="text-sm text-gray-500 mb-2">روش‌های پرداخت پذیرفته شده</p>
                  <div className="flex justify-center gap-3 text-2xl text-gray-600">
                    <i className="bi bi-credit-card"></i>
                    <i className="bi bi-paypal"></i>
                    <i className="bi bi-wallet2"></i>
                    <i className="bi bi-bank"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
