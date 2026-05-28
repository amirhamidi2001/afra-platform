export default function WishlistTab() {
  const wishlist = [
    { id: 1, img: "person-f-1.webp", name: "لورم ایپسوم دولور سیت آمیت", rating: 4.5, price: 79.99, originalPrice: 99.99, sale: true },
    { id: 2, img: "person-f-2.webp", name: "کانسکتت آدیپیسینگ الیت", rating: 4.0, price: 149.99, sale: false },
    { id: 3, img: "person-f-3.webp", name: "سد دو اییوسمود تمپور", rating: 5.0, price: 199.99, sale: false, outOfStock: true },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">علاقه‌مندی‌ها</h2>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700">افزودن همه به سبد</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="relative">
              <img src={`/src/assets/img/person/${item.img}`} alt={item.name} className="w-full h-48 object-cover" />
              <button className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow hover:bg-red-50 text-gray-500 hover:text-red-500">
                <i className="bi bi-trash"></i>
              </button>
              {item.sale && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-۲۰٪</span>}
              {item.outOfStock && <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">ناموجود</span>}
            </div>
            <div className="p-4">
              <h4 className="font-semibold line-clamp-1">{item.name}</h4>
              <div className="flex items-center gap-1 mt-1 text-yellow-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`bi ${i < Math.floor(item.rating) ? 'bi-star-fill' : (i < item.rating ? 'bi-star-half' : 'bi-star')}`}></i>
                ))}
                <span className="text-gray-500 text-xs">({item.rating})</span>
              </div>
              <div className="mt-2">
                <span className="font-bold text-teal-700">${item.price.toFixed(2)}</span>
                {item.originalPrice && <span className="text-gray-400 line-through text-sm mr-2">${item.originalPrice.toFixed(2)}</span>}
              </div>
              {!item.outOfStock ? (
                <button className="mt-3 w-full bg-teal-600 text-white py-2 rounded-lg text-sm hover:bg-teal-700">افزودن به سبد</button>
              ) : (
                <button className="mt-3 w-full bg-gray-200 text-gray-600 py-2 rounded-lg text-sm cursor-not-allowed">اطلاع رسانی در زمان موجودی</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
