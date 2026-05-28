export default function PaymentMethodsTab() {
  const cards = [
    { id: 1, type: "Visa", last4: "4589", expiry: "09/2026", isDefault: true },
    { id: 2, type: "Mastercard", last4: "7821", expiry: "05/2025", isDefault: false },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">روش‌های پرداخت</h2>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 flex items-center gap-1">
          <i className="bi bi-plus-lg"></i> افزودن کارت جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div key={card.id} className={`border rounded-lg p-4 ${card.isDefault ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start mb-3">
              <i className="bi bi-credit-card text-2xl text-gray-600"></i>
              <div className="flex gap-2">
                {card.isDefault && <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded">پیش‌فرض</span>}
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{card.type}</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="text-lg tracking-wider">•••• •••• •••• {card.last4}</div>
              <div className="text-sm text-gray-500">انقضا: {card.expiry}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-sm text-gray-600 hover:text-teal-600"><i className="bi bi-pencil"></i> ویرایش</button>
              <button className="text-sm text-red-600 hover:text-red-800"><i className="bi bi-trash"></i> حذف</button>
              {!card.isDefault && <button className="text-sm text-teal-600 hover:text-teal-800">قرار دادن به عنوان پیش‌فرض</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
