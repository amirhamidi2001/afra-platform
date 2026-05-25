import { useState } from "react";

export default function OrdersTab() {
  const [openTracking, setOpenTracking] = useState({});
  const [openDetails, setOpenDetails] = useState({});

  const toggleTracking = (id) => {
    setOpenTracking((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleDetails = (id) => {
    setOpenDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const orders = [
    {
      id: 1,
      orderId: "#ORD-2024-1278",
      date: "۲۰ بهمن ۱۴۰۳",
      status: "processing",
      statusText: "در حال پردازش",
      items: [
        { img: "person-f-1.webp", name: "لورم ایپسوم", sku: "PRD-001", qty: 1, price: 899.99 },
        { img: "person-f-2.webp", name: "کانسکتت آدیپیسینگ", sku: "PRD-002", qty: 2, price: 599.95 },
        { img: "person-f-3.webp", name: "لورم ایپسوم", sku: "PRD-003", qty: 1, price: 129.99 },
      ],
      subtotal: 1929.93,
      shipping: 15.99,
      tax: 159.98,
      total: 2105.9,
      shippingAddress: "سارا اندرسون، خیابان اصلی ۱۲۳، واحد ۴B، نیویورک، NY 10001، ایالات متحده",
      paymentMethod: "کارت اعتباری (**** 4589)",
      shippingMethod: "ارسال سریع (۲-۳ روز)",
      tracking: {
        steps: [
          { title: "تأیید سفارش", date: "۲۰ بهمن - ۱۰:۳۰", completed: true },
          { title: "در حال پردازش", date: "۲۰ بهمن - ۱۴:۴۵", completed: true },
          { title: "بسته‌بندی", date: "۲۰ بهمن - ۱۶:۱۵", completed: false, active: true },
          { title: "در حال ارسال", date: null, completed: false },
          { title: "تحویل", date: null, completed: false },
        ],
      },
    },
    {
      id: 2,
      orderId: "#ORD-2024-1265",
      date: "۱۵ بهمن ۱۴۰۳",
      status: "shipped",
      statusText: "ارسال شده",
      items: [
        { img: "person-f-4.webp", name: "لورم ایپسوم", sku: "PRD-004", qty: 1, price: 299.99 },
        { img: "person-f-5.webp", name: "لورم ایپسوم", sku: "PRD-005", qty: 1, price: 159.99 },
      ],
      subtotal: 459.98,
      shipping: 9.99,
      tax: 38.02,
      total: 459.99,
      shippingAddress: "سارا اندرسون، خیابان اصلی ۱۲۳، واحد ۴B، نیویورک، NY 10001",
      paymentMethod: "کارت اعتباری (**** 7821)",
      shippingMethod: "ارسال معمولی (۳-۵ روز)",
      tracking: {
        steps: [
          { title: "تأیید سفارش", date: "۱۵ بهمن - ۰۹:۱۵", completed: true },
          { title: "در حال پردازش", date: "۱۵ بهمن - ۱۱:۳۰", completed: true },
          { title: "بسته‌بندی", date: "۱۵ بهمن - ۱۴:۴۵", completed: true },
          { title: "در حال ارسال", date: "۱۶ بهمن - ۱۰:۲۰", completed: false, active: true, trackingNumber: "1Z999AA1234567890" },
          { title: "تحویل", date: null, completed: false },
        ],
      },
    },
    {
      id: 3,
      orderId: "#ORD-2024-1252",
      date: "۱۰ بهمن ۱۴۰۳",
      status: "delivered",
      statusText: "تحویل شده",
      items: [{ img: "person-f-6.webp", name: "لورم ایپسوم", sku: "PRD-006", qty: 1, price: 129.99 }],
      subtotal: 129.99,
      shipping: 0,
      tax: 0,
      total: 129.99,
      shippingAddress: "سارا اندرسون، خیابان اصلی ۱۲۳",
      paymentMethod: "کارت اعتباری (**** 4589)",
      shippingMethod: "ارسال رایگان",
    },
    {
      id: 4,
      orderId: "#ORD-2024-1245",
      date: "۵ بهمن ۱۴۰۳",
      status: "cancelled",
      statusText: "لغو شده",
      items: [
        { img: "person-f-7.webp", name: "لورم ایپسوم", qty: 1, price: 299.99 },
        { img: "person-f-8.webp", name: "لورم ایپسوم", qty: 1, price: 399.99 },
      ],
      subtotal: 1299.99,
      shipping: 0,
      tax: 0,
      total: 1299.99,
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-emerald-100 text-emerald-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold">سفارشات من</h2>
        <div className="flex gap-2">
          <div className="relative">
            <i className="bi bi-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" placeholder="جستجوی سفارش..." className="border rounded-lg py-2 pr-10 pl-3 text-sm" />
          </div>
          <select className="border rounded-lg py-2 px-3 text-sm">
            <option>همه سفارشات</option>
            <option>در حال پردازش</option>
            <option>ارسال شده</option>
            <option>تحویل شده</option>
            <option>لغو شده</option>
          </select>
        </div>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center gap-3">
              <div>
                <span className="text-sm text-gray-500">کد سفارش:</span>
                <span className="font-semibold mr-1">{order.orderId}</span>
                <div className="text-xs text-gray-400 mt-1">{order.date}</div>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(order.status)}`}>
                  {order.statusText}
                </span>
                <button
                  onClick={() => toggleTracking(order.id)}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  پیگیری سفارش
                </button>
                <button
                  onClick={() => toggleDetails(order.id)}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  جزئیات
                </button>
              </div>
            </div>

            <div className="p-4 border-b flex flex-wrap justify-between items-center">
              <div className="flex gap-2">
                {order.items.slice(0, 3).map((item, idx) => (
                  <img
                    key={idx}
                    src={`/src/assets/img/person/${item.img}`}
                    alt=""
                    className="w-12 h-12 object-cover rounded border"
                  />
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-sm font-bold">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-600">تعداد اقلام: {order.items.length}</div>
                <div className="font-bold">${order.total.toFixed(2)}</div>
              </div>
            </div>

            {openTracking[order.id] && order.tracking && (
              <div className="p-4 bg-gray-50 border-b">
                <div className="relative pr-8 space-y-6">
                  {order.tracking.steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute right-0 w-4 h-4 rounded-full border-2 ${step.completed ? 'bg-emerald-500 border-emerald-500' : (step.active ? 'bg-blue-500 border-blue-500 animate-pulse' : 'bg-white border-gray-300')}`}></div>
                      <div className="mr-6">
                        <h5 className="font-semibold">{step.title}</h5>
                        {step.date && <p className="text-sm text-gray-500">{step.date}</p>}
                        {step.trackingNumber && (
                          <p className="text-xs text-gray-400 mt-1">شماره پیگیری: {step.trackingNumber}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {openDetails[order.id] && (
              <div className="p-4 space-y-4">
                <div>
                  <h5 className="font-semibold mb-2">اطلاعات سفارش</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">روش پرداخت:</span> {order.paymentMethod}</div>
                    <div><span className="text-gray-500">روش ارسال:</span> {order.shippingMethod}</div>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">اقلام سفارش</h5>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center border-b pb-2">
                        <img src={`/src/assets/img/person/${item.img}`} alt="" className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.sku && `SKU: ${item.sku}`}</div>
                        </div>
                        <div className="text-left">
                          <div>{item.qty} ×</div>
                          <div className="font-bold">${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">جزئیات قیمت</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>جمع جزء</span><span>${order.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>حمل و نقل</span><span>${order.shipping.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>مالیات</span><span>${order.tax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold pt-1 border-t"><span>جمع کل</span><span>${order.total.toFixed(2)}</span></div>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">آدرس ارسال</h5>
                  <p className="text-sm">{order.shippingAddress}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        <button disabled className="px-3 py-1 border rounded disabled:opacity-50"><i className="bi bi-chevron-right"></i></button>
        <button className="px-3 py-1 bg-emerald-600 text-white rounded">1</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
        <span className="px-3 py-1">...</span>
        <button className="px-3 py-1 border rounded hover:bg-gray-100">۱۲</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100"><i className="bi bi-chevron-left"></i></button>
      </div>
    </div>
  );
}
