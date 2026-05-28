export default function AddressesTab() {
  const addresses = [
    { id: 1, title: "خانه", isDefault: true, address: "خیابان اصلی ۱۲۳، واحد ۴B، نیویورک، NY 10001، ایالات متحده", name: "سارا اندرسون", phone: "+1 (555) 123-4567" },
    { id: 2, title: "اداره", isDefault: false, address: "خیابان بیزینس ۴۵۶، طبقه ۲۰۰، سانفرانسیسکو، CA 94107، ایالات متحده", name: "سارا اندرسون", phone: "+1 (555) 987-6543" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">آدرس‌های من</h2>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 flex items-center gap-1">
          <i className="bi bi-plus-lg"></i> افزودن آدرس جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className={`border rounded-lg p-4 ${addr.isDefault ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold">{addr.title}</h4>
              {addr.isDefault && <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded">پیش‌فرض</span>}
            </div>
            <p className="text-sm text-gray-700 mt-2">{addr.address}</p>
            <div className="mt-2 text-sm">
              <div><i className="bi bi-person ml-1"></i> {addr.name}</div>
              <div><i className="bi bi-telephone ml-1"></i> {addr.phone}</div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="text-sm text-teal-600 hover:underline"><i className="bi bi-pencil"></i> ویرایش</button>
              <button className="text-sm text-red-600 hover:underline"><i className="bi bi-trash"></i> حذف</button>
              {!addr.isDefault && <button className="text-sm text-teal-600 hover:underline">قرار دادن به عنوان پیش‌فرض</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
