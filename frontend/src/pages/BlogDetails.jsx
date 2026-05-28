import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function BlogDetails() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    comment: "",
  });
  const [errors, setErrors] = useState({});

  const [replyTo, setReplyTo] = useState(null);

  const [comments, setComments] = useState([
    {
      id: 1,
      name: "توماس اندرسون",
      avatar: "person-f-2.webp",
      time: "۲ ساعت پیش",
      likes: 24,
      text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
      replies: [
        {
          id: 11,
          name: "ماریا رودریگز",
          avatar: "person-f-3.webp",
          time: "۱ ساعت پیش",
          likes: 8,
          text: "ویوآموس المنتوم سمپر نیسی. انیان ولپوتات الیفند تلوس. انیان لئو لیگولا، پورتیتور ائو، کانسیکوات ویتائه.",
        },
        {
          id: 12,
          name: "الکس چن",
          avatar: "person-f-4.webp",
          time: "۳۰ دقیقه پیش",
          likes: 5,
          text: "کراس داپیبوس. ویوآموس المنتوم سمپر نیسی.",
        },
      ],
    },
    {
      id: 2,
      name: "امیلی واتسون",
      avatar: "person-f-5.webp",
      time: "۳ ساعت پیش",
      likes: 15,
      text: "مایسناس تمپوس، تلوس اگت کاندیمنتوم رونکوس، سم کوام سمپر لیبرو، سیت آمت آدیپیسسینگ سم نکه سد ایپسوم.",
      replies: [],
    },
  ]);

  const handleLike = (commentId, isReply = false, parentId = null) => {
    console.log("Like clicked for:", { commentId, isReply, parentId });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "نام خود را وارد کنید";
    if (!formData.email.trim()) newErrors.email = "ایمیل خود را وارد کنید";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "ایمیل نامعتبر است";
    if (!formData.comment.trim()) newErrors.comment = "متن نظر را وارد کنید";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const newComment = {
      id: Date.now(),
      name: formData.name,
      avatar: "person-default.webp",
      time: "همین الان",
      likes: 0,
      text: formData.comment,
      replies: [],
    };
    setComments([...comments, newComment]);
    setFormData({ name: "", email: "", website: "", comment: "" });
    alert("نظر شما با موفقیت ثبت شد");
  };

  const submitReply = (parentId, replyText) => {
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      name: "کاربر مهمان",
      avatar: "person-default.webp",
      time: "همین الان",
      likes: 0,
      text: replyText,
    };
    const updatedComments = comments.map((comment) =>
      comment.id === parentId
        ? { ...comment, replies: [...comment.replies, newReply] }
        : comment
    );
    setComments(updatedComments);
    setReplyTo(null);
  };

  const tocItems = [
    { id: "introduction", title: "مقدمه" },
    { id: "skeuomorphism", title: "عصر اسکیومورفیسم" },
    { id: "flat-design", title: "انقلاب طراحی تخت" },
    { id: "material-design", title: "طراحی متریال" },
    { id: "neumorphism", title: "ظهور نئومورفیسم" },
    { id: "future", title: "روندهای آینده" },
  ];

  return (
    <main>
      <div className="bg-teal-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">جزئیات مقاله</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><a href="/" className="text-teal-600 hover:underline">خانه</a></li>
              <li className="text-gray-500">/</li>
              <li><a href="/blog" className="text-teal-600 hover:underline">مجله</a></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">جزئیات مقاله</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-4" data-aos="fade-up">
              <a href="#" className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">تکنولوژی</a>
              <a href="#" className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">نوآوری</a>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6" data-aos="fade-up" data-aos-delay="100">
              تکامل طراحی رابط کاربری: از اسکیومورفیسم تا نئومورفیسم
            </h1>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-600" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center gap-3">
                <img src="/src/assets/img/person/person-f-1.webp" alt="نویسنده" className="w-12 h-12 rounded-full object-cover" />
                <div className="text-right">
                  <h4 className="font-bold text-gray-800">دیوید ویلسون</h4>
                  <span className="text-sm">راهنمای طراحی UI/UX</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <span><i className="bi bi-calendar4-week ml-1"></i> ۲۶ فروردین ۱۴۰۴</span>
                <span><i className="bi bi-clock ml-1"></i> ۱۰ دقیقه مطالعه</span>
                <span><i className="bi bi-chat-square-text ml-1"></i> ۳۲ نظر</span>
              </div>
            </div>
          </div>

          <div className="mb-10" data-aos="zoom-in">
            <img src="/src/assets/img/person/person-f-1.webp" alt="تکامل UI" className="w-full rounded-xl shadow-lg" />
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3" data-aos="fade-left">
              <div className="sticky top-24 bg-gray-50 p-5 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg border-r-4 border-teal-600 pr-3 mb-4">فهرست مطالب</h3>
                <nav>
                  <ul className="space-y-2">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-gray-600 hover:text-teal-600 transition block py-1"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            <div className="lg:col-span-9 space-y-10">
              <section id="introduction" className="scroll-mt-24" data-aos="fade-up">
                <p className="text-xl text-gray-700 leading-relaxed mb-4">
                  سفر طراحی رابط کاربری با تغییرات قابل توجهی در رویکردهای زیبایی‌شناختی همراه بوده است؛ هر دوره چشم‌انداز منحصربه‌فرد خود را در مورد ظاهر و احساس رابط‌های دیجیتال ارائه داده است.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  از روزهای اولیه رابط‌های کاربری گرافیکی تا سیستم‌های طراحی پیچیده امروزی، تکامل طراحی UI نه تنها منعکس‌کننده پیشرفت تکنولوژی است، بلکه تغییر انتظارات کاربران و تحولات فرهنگی در نحوه تعامل ما با محصولات دیجیتال را نیز نشان می‌دهد.
                </p>
                <div className="bg-teal-50 border-r-4 border-teal-600 p-5 my-6 italic">
                  <p className="text-gray-700">«طراحی فقط ظاهر و احساس نیست. طراحی نحوه کار کردن است.»</p>
                  <cite className="text-sm text-gray-500 block mt-2">استیو جابز</cite>
                </div>
              </section>

              <section id="skeuomorphism" className="scroll-mt-24" data-aos="fade-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">عصر اسکیومورفیسم</h2>
                <div className="float-left ml-6 mb-4 w-full md:w-64">
                  <img src="/src/assets/img/person/blog-hero-2.webp" alt="اسکیومورفیسم" className="rounded-lg shadow-md" />
                  <p className="text-xs text-gray-500 mt-1 text-center">نمونه‌ای از طراحی اسکیومورفیک در iOS اولیه</p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  طراحی اسکیومورفیک در سال‌های اولیه رابط‌های دیجیتال غالب بود و سعی داشت اشیاء دنیای واقعی را در قالب دیجیتال منعکس کند. این رویکرد به کاربران کمک کرد تا از طریق استعاره‌های بصری آشنا، از تعاملات فیزیکی به دیجیتال گذر کنند.
                </p>
                <div className="grid md:grid-cols-2 gap-4 my-5">
                  <div className="flex gap-3 items-start bg-gray-50 p-3 rounded">
                    <i className="bi bi-layers text-2xl text-teal-600"></i>
                    <div>
                      <h4 className="font-bold">بافت‌های واقع‌گرایانه</h4>
                      <p className="text-sm text-gray-600">نمایش دقیق موادی مانند چرم، فلز و کاغذ</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start bg-gray-50 p-3 rounded">
                    <i className="bi bi-lightbulb text-2xl text-teal-600"></i>
                    <div>
                      <h4 className="font-bold">استعاره‌های آشنا</h4>
                      <p className="text-sm text-gray-600">عناصر دیجیتال تقلیدکننده از نمونه‌های فیزیکی</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="flat-design" className="scroll-mt-24" data-aos="fade-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">انقلاب طراحی تخت</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  با راحت‌تر شدن کاربران با رابط‌های دیجیتال، طراحی به سمت ساده‌سازی حرکت کرد. طراحی تخت (Flat Design) در واکنش به جزئیات آراسته اسکیومورفیسم ظهور کرد و بر وضوح و کارایی تأکید داشت.
                </p>
                <div className="grid md:grid-cols-2 gap-6 my-5">
                  <div className="border rounded-lg p-4 shadow-sm">
                    <i className="bi bi-check-circle text-teal-600 text-xl"></i>
                    <h4 className="font-bold mt-2">مزایا</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      <li>زمان بارگذاری بهبودیافته</li>
                      <li>قابلیت مقیاس‌پذیری بهتر</li>
                      <li>سلسله‌مراتب بصری تمیزتر</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4 shadow-sm">
                    <i className="bi bi-exclamation-circle text-orange-500 text-xl"></i>
                    <h4 className="font-bold mt-2">چالش‌ها</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      <li>کاهش نشانه‌های بصری</li>
                      <li>مشکلات بالقوه قابلیت استفاده</li>
                      <li>درک عمق محدود</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="material-design" className="scroll-mt-24" data-aos="fade-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">طراحی متریال: یافتن تعادل</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  طراحی متریال گوگل به عنوان یک سیستم طراحی جامع ظهور کرد که سادگی طراحی تخت را با نشانه‌های عمق ظریف ترکیب می‌کند و تجربه کاربری بصری‌تری را ایجاد می‌کند و در عین حال زیبایی‌شناسی مدرن را حفظ می‌نماید.
                </p>
                <div className="grid md:grid-cols-3 gap-4 my-5">
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <span className="inline-block bg-teal-600 text-white w-8 h-8 rounded-full leading-8 mb-2">۰۱</span>
                    <h4 className="font-bold">خواص فیزیکی</h4>
                    <p className="text-sm text-gray-600">سطوح و لبه‌ها نشانه‌های تعاملی معنی‌دار ارائه می‌دهند</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <span className="inline-block bg-teal-600 text-white w-8 h-8 rounded-full leading-8 mb-2">۰۲</span>
                    <h4 className="font-bold">گرافیک جسورانه</h4>
                    <p className="text-sm text-gray-600">انتخاب‌های رنگی عمدی و فضای سفید هدفمند</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <span className="inline-block bg-teal-600 text-white w-8 h-8 rounded-full leading-8 mb-2">۰۳</span>
                    <h4 className="font-bold">حرکت معنادار</h4>
                    <p className="text-sm text-gray-600">انیمیشن اعمال کاربر را اطلاع‌رسانی و تقویت می‌کند</p>
                  </div>
                </div>
              </section>

              <section id="neumorphism" className="scroll-mt-24" data-aos="fade-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">ظهور نئومورفیسم</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  نئومورفیسم آخرین تکامل در طراحی UI را نشان می‌دهد و جنبه‌هایی از اسکیومورفیسم را با زیبایی‌شناسی مینیمال مدرن ترکیب می‌کند. این سبک سطوح نرم و بیرون‌زده ایجاد می‌کند که به نظر می‌رسد از پس‌زمینه بیرون آمده‌اند.
                </p>
                <div className="bg-blue-50 border-r-4 border-blue-400 p-4 flex gap-3 items-start">
                  <i className="bi bi-info-circle text-blue-600 text-2xl"></i>
                  <div>
                    <h4 className="font-bold">ویژگی‌های کلیدی</h4>
                    <p className="text-sm text-gray-700">طراحی نئومورفیک بر کار ظریف سایه‌ها برای ایجاد توهم بیرون‌زدگی یا فرو رفتن عناصر از سطح پس‌زمینه تکیه دارد.</p>
                  </div>
                </div>
              </section>

              <section id="future" className="scroll-mt-24" data-aos="fade-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">نگاهی به آینده</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  با پیشرفت تکنولوژی و تغییر انتظارات کاربران، طراحی UI همچنان تکامل می‌یابد. آینده ممکن است رابط‌های شخصی‌سازی شده و تطبیقی بیشتری را به همراه داشته باشد که به ترجیحات و زمینه‌های فردی کاربر پاسخ می‌دهند.
                </p>
                <div className="grid md:grid-cols-3 gap-5 my-5">
                  <div className="text-center p-4 shadow rounded-lg hover:shadow-md transition">
                    <i className="bi bi-phone text-3xl text-teal-600"></i>
                    <h4 className="font-bold mt-2">رابط‌های تطبیقی</h4>
                    <p className="text-sm text-gray-600">رابط‌هایی که بر اساس رفتار و ترجیحات کاربر به طور خودکار تنظیم می‌شوند</p>
                  </div>
                  <div className="text-center p-4 shadow rounded-lg hover:shadow-md transition">
                    <i className="bi bi-eye text-3xl text-teal-600"></i>
                    <h4 className="font-bold mt-2">تجارب فراگیر</h4>
                    <p className="text-sm text-gray-600">ادغام عناصر واقعیت افزوده و واقعیت مجازی در رابط‌های روزمره</p>
                  </div>
                  <div className="text-center p-4 shadow rounded-lg hover:shadow-md transition">
                    <i className="bi bi-hand-index text-3xl text-teal-600"></i>
                    <h4 className="font-bold mt-2">کنترل‌های حرکتی</h4>
                    <p className="text-sm text-gray-600">تعاملات پیشرفته مبتنی بر حرکت و ژست</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t" data-aos="fade-up">
            <div className="mb-6">
              <h4 className="font-bold text-lg mb-3">اشتراک‌گذاری مقاله</h4>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition">
                  <i className="bi bi-twitter-x"></i> <span>اشتراک در X</span>
                </a>
                <a href="#" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition">
                  <i className="bi bi-facebook"></i> <span>اشتراک در فیسبوک</span>
                </a>
                <a href="#" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition">
                  <i className="bi bi-linkedin"></i> <span>اشتراک در لینکدین</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">موضوعات مرتبط</h4>
              <div className="flex flex-wrap gap-2">
                <a href="#" className="bg-gray-100 hover:bg-teal-100 text-gray-700 px-3 py-1 rounded-full text-sm transition">طراحی UI</a>
                <a href="#" className="bg-gray-100 hover:bg-teal-100 text-gray-700 px-3 py-1 rounded-full text-sm transition">تجربه کاربری</a>
                <a href="#" className="bg-gray-100 hover:bg-teal-100 text-gray-700 px-3 py-1 rounded-full text-sm transition">روندهای طراحی</a>
                <a href="#" className="bg-gray-100 hover:bg-teal-100 text-gray-700 px-3 py-1 rounded-full text-sm transition">نوآوری</a>
                <a href="#" className="bg-gray-100 hover:bg-teal-100 text-gray-700 px-3 py-1 rounded-full text-sm transition">تکنولوژی</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">نظرات کاربران</h3>
            <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">{comments.length} نظر</span>
          </div>

          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex gap-4">
                  <img src={`/src/assets/img/person/${comment.avatar}`} alt={comment.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold">{comment.name}</h4>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><i className="bi bi-clock"></i> {comment.time}</span>
                      </div>
                      <button onClick={() => handleLike(comment.id)} className="text-sm text-gray-500 hover:text-red-500">
                        <i className="bi bi-heart"></i> {comment.likes}
                      </button>
                    </div>
                    <p className="text-gray-700 mt-2">{comment.text}</p>
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="mt-3 text-sm text-teal-600 hover:underline flex items-center gap-1"
                    >
                      <i className="bi bi-chat"></i> پاسخ
                    </button>

                    {replyTo === comment.id && (
                      <div className="mt-4 bg-gray-50 p-3 rounded">
                        <textarea
                          rows="2"
                          placeholder="پاسخ خود را بنویسید..."
                          className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                          id={`reply-${comment.id}`}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => {
                              const replyText = document.getElementById(`reply-${comment.id}`).value;
                              submitReply(comment.id, replyText);
                              document.getElementById(`reply-${comment.id}`).value = "";
                            }}
                            className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700"
                          >
                            ارسال پاسخ
                          </button>
                          <button onClick={() => setReplyTo(null)} className="text-gray-500 text-sm">انصراف</button>
                        </div>
                      </div>
                    )}

                    {comment.replies.length > 0 && (
                      <div className="mt-4 mr-8 space-y-4 border-r-2 border-gray-200 pr-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <img src={`/src/assets/img/person/${reply.avatar}`} alt={reply.name} className="w-8 h-8 rounded-full object-cover" />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h5 className="font-semibold text-sm">{reply.name}</h5>
                                <button onClick={() => handleLike(reply.id, true, comment.id)} className="text-xs text-gray-500">
                                  <i className="bi bi-heart"></i> {reply.likes}
                                </button>
                              </div>
                              <span className="text-xs text-gray-400">{reply.time}</span>
                              <p className="text-sm text-gray-700 mt-1">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">ارسال نظر</h3>
            <p className="text-gray-600">آدرس ایمیل شما منتشر نخواهد شد. فیلدهای الزامی با * مشخص شده‌اند</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">نام کامل *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  placeholder="نام خود را وارد کنید"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">آدرس ایمیل *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  placeholder="ایمیل خود را وارد کنید"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">وبسایت (اختیاری)</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="آدرس وبسایت شما"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">متن نظر *</label>
              <textarea
                name="comment"
                rows="5"
                value={formData.comment}
                onChange={handleInputChange}
                className={`w-full border ${errors.comment ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                placeholder="نظر خود را بنویسید..."
              ></textarea>
              {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
            </div>
            <div className="text-center">
              <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full font-semibold transition">
                ارسال نظر
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
