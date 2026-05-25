export default function ProfileSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "orders", label: "سفارشات من", icon: "bi-box-seam", badge: 3 },
    { id: "wishlist", label: "علاقه‌مندی‌ها", icon: "bi-heart", badge: 12 },
    { id: "payment", label: "روش‌های پرداخت", icon: "bi-wallet2", badge: null },
    { id: "reviews", label: "نظرات من", icon: "bi-star", badge: null },
    { id: "addresses", label: "آدرس‌ها", icon: "bi-geo-alt", badge: null },
    { id: "settings", label: "تنظیمات حساب", icon: "bi-gear", badge: null },
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-5 sticky top-24">
      <div className="text-center pb-5 mb-5 border-b border-gray-200">
        <div className="relative w-24 h-24 mx-auto mb-3">
          <img
            src="/src/assets/img/person/person-f-1.webp"
            alt="پروفایل"
            className="w-full h-full rounded-full object-cover border-4 border-white shadow"
          />
          <span className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
            <i className="bi bi-shield-check text-white text-sm"></i>
          </span>
        </div>
        <h4 className="font-bold text-lg">سارا اندرسون</h4>
        <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs mt-2">
          <i className="bi bi-award"></i>
          <span>کاربر ویژه</span>
        </div>
      </div>

      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                  activeTab === item.id
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className={`bi ${item.icon} text-lg`}></i>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-4 border-t border-gray-200 space-y-1">
          <a href="#" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <i className="bi bi-question-circle text-lg"></i>
            <span>مرکز راهنمایی</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg">
            <i className="bi bi-box-arrow-right text-lg"></i>
            <span>خروج از حساب</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
