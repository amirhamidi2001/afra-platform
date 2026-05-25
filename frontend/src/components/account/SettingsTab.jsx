import { useState } from "react";

export default function SettingsTab() {
  const [personalInfo, setPersonalInfo] = useState({ firstName: "سارا", lastName: "اندرسون", email: "sarah@example.com", phone: "+1 (555) 123-4567" });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [preferences, setPreferences] = useState({ orderUpdates: true, promotions: false, newsletter: true });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: "success", message: "اطلاعات با موفقیت به‌روزرسانی شد" });
    setTimeout(() => setStatus({}), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setStatus({ type: "error", message: "رمز عبور جدید با تکرار مطابقت ندارد" });
      return;
    }
    setStatus({ type: "success", message: "رمز عبور با موفقیت تغییر کرد" });
    setPassword({ current: "", new: "", confirm: "" });
    setTimeout(() => setStatus({}), 3000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">تنظیمات حساب</h2>

      <div className="border rounded-lg p-5 mb-6">
        <h3 className="font-bold text-lg mb-4">اطلاعات شخصی</h3>
        <form onSubmit={handlePersonalSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">نام</label>
              <input type="text" value={personalInfo.firstName} onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})} className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">نام خانوادگی</label>
              <input type="text" value={personalInfo.lastName} onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})} className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ایمیل</label>
              <input type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})} className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">تلفن</label>
              <input type="tel" value={personalInfo.phone} onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})} className="w-full border rounded-lg p-2" />
            </div>
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700">ذخیره تغییرات</button>
        </form>
      </div>

      <div className="border rounded-lg p-5 mb-6">
        <h3 className="font-bold text-lg mb-4">تنظیمات ایمیل</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div><h4 className="font-medium">به‌روزرسانی سفارش</h4><p className="text-sm text-gray-500">دریافت اطلاعیه درباره وضعیت سفارش</p></div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={preferences.orderUpdates} onChange={() => setPreferences({...preferences, orderUpdates: !preferences.orderUpdates})} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-[-100%]"></div>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <div><h4 className="font-medium">تخفیف‌ها و پیشنهادات</h4><p className="text-sm text-gray-500">دریافت ایمیل درباره تخفیف‌ها</p></div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={preferences.promotions} onChange={() => setPreferences({...preferences, promotions: !preferences.promotions})} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-[-100%]"></div>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <div><h4 className="font-medium">خبرنامه</h4><p className="text-sm text-gray-500">عضو خبرنامه هفتگی</p></div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={preferences.newsletter} onChange={() => setPreferences({...preferences, newsletter: !preferences.newsletter})} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-[-100%]"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-5 mb-6">
        <h3 className="font-bold text-lg mb-4">تغییر رمز عبور</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">رمز عبور فعلی</label>
            <input type="password" value={password.current} onChange={(e) => setPassword({...password, current: e.target.value})} className="w-full border rounded-lg p-2" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">رمز عبور جدید</label>
              <input type="password" value={password.new} onChange={(e) => setPassword({...password, new: e.target.value})} className="w-full border rounded-lg p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">تکرار رمز عبور جدید</label>
              <input type="password" value={password.confirm} onChange={(e) => setPassword({...password, confirm: e.target.value})} className="w-full border rounded-lg p-2" required />
            </div>
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700">به‌روزرسانی رمز عبور</button>
        </form>
      </div>

      <div className="border border-red-200 rounded-lg p-5 bg-red-50">
        <h3 className="font-bold text-red-700 text-lg mb-2">حذف حساب کاربری</h3>
        <p className="text-sm text-gray-700 mb-4">پس از حذف حساب، تمام اطلاعات شما برای همیشه پاک خواهد شد. این عملیات غیرقابل بازگشت است.</p>
        <button className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700">حذف حساب کاربری</button>
      </div>

      {status.message && (
        <div className={`mt-4 p-3 rounded-lg text-center ${status.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}
