export default function Excel() {
  const videos = [
    {
      title: "إنشاء جدول",
      url: "/assets/video/excel/1.mp4",
    },
    {
      title: "مقدمة الإكسل",
      url: "/assets/video/excel/2.mp4",
    },
    {
      title: "تحرير جدول بملف وورد",
      url: "/assets/video/excel/3.mp4",
    },
    {
      title: "رسم بياني في الإكسل",
      url: "/assets/video/excel/4.mp4",
    },
    {
      title: "مذكرة",
      url: "/assets/video/excel/5.mp4",
    },
    {
      title: "طريقة عمل جدول",
      url: "/assets/video/excel/6.mp4",
    },
    {
      title: "طريقة جمع المبالغ بورد",
      url: "/assets/video/excel/7.mp4",
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f7fb]">
      <div className="px-4 py-8 md:px-8 lg:px-10">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-l from-blue-800 via-blue-700 to-blue-500 p-8 md:p-10 shadow-xl">
          <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
                📚 مكتبة الشروحات
              </span>

              <h1 className="text-3xl font-black text-white md:text-5xl">
                شرح ورد واكسل
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                مجموعة فيديوهات تعليمية مبسطة لشرح أساسيات التعامل مع الجداول،
                الملفات، الرسوم البيانية، وجمع المبالغ بطريقة سهلة ومنظمة.
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 px-6 py-5 text-center backdrop-blur">
              <div className="text-4xl font-black text-white">
                {videos.length}
              </div>
              <div className="mt-1 text-sm font-bold text-white/80">
                فيديو تعليمي
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="mt-10 mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              الفيديوهات المتاحة
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              اختار الفيديو وابدأ المشاهدة مباشرة.
            </p>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Video */}
              <div className="relative bg-slate-900">
                <video
                  controls
                  preload="metadata"
                  className="h-[220px] w-full object-cover"
                >
                  <source src={video.url} type="video/mp4" />
                  المتصفح الخاص بك لا يدعم تشغيل الفيديو.
                </video>

                <div className="absolute right-4 top-4 rounded-full bg-blue-700 px-3 py-1 text-xs font-black text-white shadow">
                  درس {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <h3 className="text-center text-xl font-black leading-8 text-slate-800">
                  {video.title}
                </h3>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                    Word / Excel
                  </span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                    فيديو
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Safety */}
        {videos.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-600">
              لا توجد فيديوهات متاحة حاليًا.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}