import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Login() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [activeForm, setActiveForm] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (loginErrors[name]) setLoginErrors({ ...loginErrors, [name]: "" });
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (registerErrors[name]) setRegisterErrors({ ...registerErrors, [name]: "" });
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginData.email) errors.email = "ایمیل را وارد کنید";
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errors.email = "ایمیل نامعتبر است";
    if (!loginData.password) errors.password = "رمز عبور را وارد کنید";
    return errors;
  };

  const validateRegister = () => {
    const errors = {};
    if (!registerData.firstName) errors.firstName = "نام را وارد کنید";
    if (!registerData.lastName) errors.lastName = "نام خانوادگی را وارد کنید";
    if (!registerData.email) errors.email = "ایمیل را وارد کنید";
    else if (!/\S+@\S+\.\S+/.test(registerData.email)) errors.email = "ایمیل نامعتبر است";
    if (!registerData.password) errors.password = "رمز عبور را وارد کنید";
    else if (registerData.password.length < 6) errors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    if (registerData.password !== registerData.confirmPassword)
      errors.confirmPassword = "رمز عبور با تکرار آن مطابقت ندارد";
    if (!registerData.terms) errors.terms = "باید قوانین را بپذیرید";
    return errors;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errors = validateLogin();
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }
    alert("ورود موفقیت‌آمیز بود!");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const errors = validateRegister();
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }
    alert("ثبت‌نام با موفقیت انجام شد!");
  };

  return (
    <main>
      <div className="bg-emerald-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {activeForm === "login" ? "ورود" : "ثبت‌نام"}
          </h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-emerald-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">{activeForm === "login" ? "ورود" : "ثبت‌نام"}</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-md" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
            <div className={`p-6 md:p-8 ${activeForm === "login" ? "block" : "hidden"}`}>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">خوش آمدید</h3>
                <p className="text-gray-500">به حساب خود وارد شوید</p>
              </div>
              <form onSubmit={handleLoginSubmit}>
                <div className="relative mb-4">
                  <i className="bi bi-envelope absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className={`w-full border ${loginErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg py-3 pr-10 pl-3 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="آدرس ایمیل"
                  />
                  {loginErrors.email && <p className="text-red-500 text-xs mt-1">{loginErrors.email}</p>}
                </div>

                <div className="relative mb-4">
                  <i className="bi bi-lock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className={`w-full border ${loginErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="رمز عبور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                  >
                    <i className={`bi ${showLoginPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                  {loginErrors.password && <p className="text-red-500 text-xs mt-1">{loginErrors.password}</p>}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={loginData.remember}
                      onChange={handleLoginChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">مرا به خاطر بسپار</span>
                  </label>
                  <a href="#" className="text-sm text-emerald-600 hover:underline">رمز عبور را فراموش کرده‌اید؟</a>
                </div>

                <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                  ورود <i className="bi bi-arrow-left"></i>
                </button>

                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <span className="relative bg-white px-4 text-sm text-gray-500">یا</span>
                </div>

                <button type="button" className="w-full border border-gray-300 py-3 rounded-full font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <i className="bi bi-google"></i> ادامه با گوگل
                </button>

                <div className="text-center mt-6">
                  <span className="text-gray-600">حساب کاربری ندارید؟</span>
                  <button type="button" onClick={() => setActiveForm("register")} className="text-emerald-600 font-semibold mr-1 hover:underline">
                    ثبت‌نام کنید
                  </button>
                </div>
              </form>
            </div>

            <div className={`p-6 md:p-8 ${activeForm === "register" ? "block" : "hidden"}`}>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">ایجاد حساب کاربری</h3>
                <p className="text-gray-500">همین حالا به ما بپیوندید</p>
              </div>
              <form onSubmit={handleRegisterSubmit}>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="relative">
                    <i className="bi bi-person absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      name="firstName"
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                      className={`w-full border ${registerErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg py-3 pr-10 pl-3 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      placeholder="نام"
                    />
                    {registerErrors.firstName && <p className="text-red-500 text-xs mt-1">{registerErrors.firstName}</p>}
                  </div>
                  <div className="relative">
                    <i className="bi bi-person absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      name="lastName"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                      className={`w-full border ${registerErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg py-3 pr-10 pl-3 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      placeholder="نام خانوادگی"
                    />
                    {registerErrors.lastName && <p className="text-red-500 text-xs mt-1">{registerErrors.lastName}</p>}
                  </div>
                </div>

                <div className="relative mb-4">
                  <i className="bi bi-envelope absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className={`w-full border ${registerErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg py-3 pr-10 pl-3 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="آدرس ایمیل"
                  />
                  {registerErrors.email && <p className="text-red-500 text-xs mt-1">{registerErrors.email}</p>}
                </div>

                <div className="relative mb-4">
                  <i className="bi bi-lock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className={`w-full border ${registerErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="رمز عبور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                  >
                    <i className={`bi ${showRegisterPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                  {registerErrors.password && <p className="text-red-500 text-xs mt-1">{registerErrors.password}</p>}
                </div>

                <div className="relative mb-4">
                  <i className="bi bi-lock-fill absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type={showRegisterConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className={`w-full border ${registerErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="تکرار رمز عبور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                  >
                    <i className={`bi ${showRegisterConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                  {registerErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{registerErrors.confirmPassword}</p>}
                </div>

                <div className="mb-6">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={registerData.terms}
                      onChange={handleRegisterChange}
                      className="w-4 h-4 mt-1"
                    />
                    <span className="text-sm text-gray-600">
                      من <a href="#" className="text-emerald-600 hover:underline">قوانین و مقررات</a> و{" "}
                      <a href="#" className="text-emerald-600 hover:underline">سیاست حریم خصوصی</a> را می‌پذیرم.
                    </span>
                  </label>
                  {registerErrors.terms && <p className="text-red-500 text-xs mt-1">{registerErrors.terms}</p>}
                </div>

                <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                  ایجاد حساب <i className="bi bi-arrow-left"></i>
                </button>

                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <span className="relative bg-white px-4 text-sm text-gray-500">یا</span>
                </div>

                <button type="button" className="w-full border border-gray-300 py-3 rounded-full font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <i className="bi bi-google"></i> ثبت‌نام با گوگل
                </button>

                <div className="text-center mt-6">
                  <span className="text-gray-600">قبلاً حساب کاربری دارید؟</span>
                  <button type="button" onClick={() => setActiveForm("login")} className="text-emerald-600 font-semibold mr-1 hover:underline">
                    وارد شوید
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
