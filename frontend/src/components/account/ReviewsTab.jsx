export default function ReviewsTab() {
  const reviews = [
    { id: 1, productImg: "person-f-1.webp", productName: "لورم ایپسوم دولور", rating: 5, date: "۱۵ بهمن ۱۴۰۳", text: "محصول عالی بود، کیفیت بالایی داشت." },
    { id: 2, productImg: "person-f-2.webp", productName: "کانسکتت آدیپیسینگ", rating: 4, date: "۱۰ بهمن ۱۴۰۳", text: "کیفیت خوب، اما ارسال کمی دیر بود." },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">نظرات من</h2>
        <select className="border rounded-lg py-2 px-3 text-sm">
          <option>مرتب‌سازی: جدیدترین</option>
          <option>بالاترین امتیاز</option>
          <option>پایین‌ترین امتیاز</option>
        </select>
      </div>

      <div className="space-y-5">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex gap-4">
              <img src={`/src/assets/img/person/${review.productImg}`} alt="" className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <h4 className="font-semibold">{review.productName}</h4>
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                  ))}
                  <span className="text-gray-400 text-xs mr-2">({review.rating}.0)</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{review.date}</div>
                <p className="text-gray-700 mt-2">{review.text}</p>
                <div className="flex gap-3 mt-3">
                  <button className="text-sm text-emerald-600 hover:underline">ویرایش نظر</button>
                  <button className="text-sm text-red-600 hover:underline">حذف</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
