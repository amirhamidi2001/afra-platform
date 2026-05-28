import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Checkout() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    saveAddress: false,
    billingSame: true,
    paymentMethod: "credit-card",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
    terms: false,
  });

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const orderItems = [
    {
      id: 1,
      name: "لورم ایپسوم دولور",
      variant: "رنگ: مشکی | سایز: M",
      price: 89.99,
      quantity: 1,
      image: "person-f-1.webp",
    },
    {
      id: 2,
      name: "سیت آمت کانسک تکتور",
      variant: "رنگ: سفید | سایز: L",
      price: 59.99,
      quantity: 2,
      image: "person-f-2.webp",
    },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax - discount;

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "نام را وارد کنید";
    if (!formData.lastName) newErrors.lastName = "نام خانوادگی را وارد کنید";
    if (!formData.email) newErrors.email = "ایمیل را وارد کنید";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "ایمیل نامعتبر است";
    if (!formData.phone) newErrors.phone = "شماره تلفن را وارد کنید";
    if (!formData.address) newErrors.address = "آدرس را وارد کنید";
    if (!formData.city) newErrors.city = "شهر را وارد کنید";
    if (!formData.state) newErrors.state = "استان را وارد کنید";
    if (!formData.zip) newErrors.zip = "کد پستی را وارد کنید";
    if (!formData.country) newErrors.country = "کشور را انتخاب کنید";
    if (formData.paymentMethod === "credit-card") {
      if (!formData.cardNumber) newErrors.cardNumber = "شماره کارت را وارد کنید";
      if (!formData.expiry) newErrors.expiry = "تاریخ انقضا را وارد کنید";
      if (!formData.cvv) newErrors.cvv = "CVV را وارد کنید";
      if (!formData.cardName) newErrors.cardName = "نام روی کارت را وارد کنید";
    }
    if (!formData.terms) newErrors.terms = "باید قوانین را بپذیرید";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handlePaymentMethodChange = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const applyPromo = () => {
    if (promoCode === "SAVE10" && !promoApplied) {
      setDiscount(10);
      setPromoApplied(true);
      alert("کد تخفیف با موفقیت اعمال شد");
    } else if (promoApplied) {
      alert("کد تخفیف قبلاً استفاده شده است");
    } else {
      alert("کد تخفیف نامعتبر است");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    alert("سفارش شما با موفقیت ثبت شد!");
  };

  return (
    <main>
      <div className="bg-teal-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">تسویه حساب</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-teal-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">تسویه حساب</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-7/12 px-4">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-3">
                    <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <h3 className="text-lg font-semibold">اطلاعات مشتری</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-1">نام *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                          placeholder="نام"
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">نام خانوادگی *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                          placeholder="نام خانوادگی"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-gray-700 mb-1">ایمیل *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        placeholder="ایمیل شما"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="mt-4">
                      <label className="block text-gray-700 mb-1">شماره تلفن *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        placeholder="تلفن همراه"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-3">
                    <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <h3 className="text-lg font-semibold">آدرس حمل و نقل</h3>
                  </div>
                  <div className="p-6">
                    <div className="mt-2">
                      <label className="block text-gray-700 mb-1">آدرس خیابان *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        placeholder="خیابان، پلاک"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div className="mt-4">
                      <label className="block text-gray-700 mb-1">واحد، طبقه (اختیاری)</label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="واحد، طبقه"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-gray-700 mb-1">شهر *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                          placeholder="شهر"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">استان *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={`w-full border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                          placeholder="استان"
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">کد پستی *</label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          className={`w-full border ${errors.zip ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                          placeholder="کد پستی"
                        />
                        {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-gray-700 mb-1">کشور *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`w-full border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      >
                        <option value="">کشور را انتخاب کنید</option>
                        <option value="IR">ایران</option>
                        <option value="US">ایالات متحده</option>
                        <option value="UK">بریتانیا</option>
                        <option value="CA">کانادا</option>
                      </select>
                      {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                    </div>
                    <div className="mt-4 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="saveAddress"
                          checked={formData.saveAddress}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">ذخیره این آدرس برای سفارش‌های آینده</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="billingSame"
                          checked={formData.billingSame}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">آدرس صورتحساب همان آدرس حمل و نقل است</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-3">
                    <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <h3 className="text-lg font-semibold">روش پرداخت</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-4 mb-6">
                      <button
                        type="button"
                        onClick={() => handlePaymentMethodChange("credit-card")}
                        className={`flex-1 min-w-[120px] p-3 border-2 rounded-lg text-center transition ${
                          formData.paymentMethod === "credit-card"
                            ? "border-teal-600 bg-teal-50 text-teal-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <i className="bi bi-credit-card-2-front text-xl"></i>
                        <span className="block text-sm mt-1">کارت اعتباری</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePaymentMethodChange("paypal")}
                        className={`flex-1 min-w-[120px] p-3 border-2 rounded-lg text-center transition ${
                          formData.paymentMethod === "paypal"
                            ? "border-teal-600 bg-teal-50 text-teal-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <i className="bi bi-paypal text-xl"></i>
                        <span className="block text-sm mt-1">پی‌پال</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePaymentMethodChange("apple-pay")}
                        className={`flex-1 min-w-[120px] p-3 border-2 rounded-lg text-center transition ${
                          formData.paymentMethod === "apple-pay"
                            ? "border-teal-600 bg-teal-50 text-teal-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <i className="bi bi-apple text-xl"></i>
                        <span className="block text-sm mt-1">اپل پی</span>
                      </button>
                    </div>

                    {formData.paymentMethod === "credit-card" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 mb-1">شماره کارت *</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className={`w-full border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            placeholder="۱۲۳۴ ۵۶۷۸ ۹۰۱۲ ۳۴۵۶"
                          />
                          {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-1">تاریخ انقضا *</label>
                            <input
                              type="text"
                              name="expiry"
                              value={formData.expiry}
                              onChange={handleChange}
                              className={`w-full border ${errors.expiry ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                              placeholder="MM/YY"
                            />
                            {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-1">CVV *</label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleChange}
                              className={`w-full border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                              placeholder="۱۲۳"
                            />
                            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">نام روی کارت *</label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            className={`w-full border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            placeholder="John Doe"
                          />
                          {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                        </div>
                      </div>
                    )}
                    {formData.paymentMethod === "paypal" && (
                      <p className="text-gray-600 p-4 bg-gray-50 rounded">پس از ثبت سفارش به درگاه پی‌پال هدایت خواهید شد.</p>
                    )}
                    {formData.paymentMethod === "apple-pay" && (
                      <p className="text-gray-600 p-4 bg-gray-50 rounded">پرداخت با اپل پی پس از تأیید شما انجام خواهد شد.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-3">
                    <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                    <h3 className="text-lg font-semibold">مرور و ثبت سفارش</h3>
                  </div>
                  <div className="p-6">
                    <label className="flex items-start gap-2 cursor-pointer mb-6">
                      <input
                        type="checkbox"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleChange}
                        className="w-4 h-4 mt-1"
                      />
                      <span className="text-sm">
                        من <a href="#" className="text-teal-600 hover:underline">قوانین و مقررات</a> و{" "}
                        <a href="#" className="text-teal-600 hover:underline">سیاست حریم خصوصی</a> را می‌پذیرم.
                      </span>
                    </label>
                    {errors.terms && <p className="text-red-500 text-xs mb-4">{errors.terms}</p>}

                    <button
                      onClick={handleSubmit}
                      className="w-full bg-teal-600 text-white py-3 rounded-full font-semibold text-lg hover:bg-teal-700 transition flex items-center justify-between px-6"
                    >
                      <span>ثبت سفارش</span>
                      <span className="bg-white/20 px-3 py-1 rounded-full">${total.toFixed(2)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-5/12 px-4 mt-8 lg:mt-0">
              <div className="bg-gray-50 rounded-lg shadow-md p-6 sticky top-24" data-aos="fade-left" data-aos-delay="200">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <h3 className="text-xl font-bold">خلاصه سفارش</h3>
                  <span className="text-sm text-gray-500">{orderItems.length} کالا</span>
                </div>

                <div className="space-y-4 mb-6">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={`/src/assets/img/person/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-contain bg-white rounded border p-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.variant}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm">{item.quantity} ×</span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="کد تخفیف"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={applyPromo}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 rounded-lg text-sm transition"
                  >
                    اعمال
                  </button>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>جمع جزء</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>حمل و نقل</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مالیات (۱۰٪)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-teal-600">
                      <span>تخفیف</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>جمع کل</span>
                    <span className="text-teal-700">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t text-center">
                  <div className="flex justify-center gap-3 text-2xl text-gray-500">
                    <i className="bi bi-credit-card"></i>
                    <i className="bi bi-paypal"></i>
                    <i className="bi bi-apple"></i>
                    <i className="bi bi-shield-lock"></i>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">پرداخت امن با درگاه‌های معتبر</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
