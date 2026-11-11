import React from "react";

export default function Outcomes() {
  const videos = [
    {
      title: "مقدمة لمادة المتحصلات",
      url: "/assets/video/المتحصلات/1.mp4",
    },
    {
      title: "تابع المقدمة وسعر التحصيل",
      url: "/assets/video/المتحصلات/2.mp4",
    },
    {
      title: "سعر تحصيل الجنيه وقسيمة 33 ع ح اعادة",
      url: "/assets/video/المتحصلات/3.mp4",
    },
    {
      title: "نموذج 76 سجل قيد العمليات القنصلية",
      url: "/assets/video/المتحصلات/4.mp4",
    },
    {
      title: "تابع سجل القيد نموذج 76",
      url: "/assets/video/المتحصلات/5.mp4",
    },
    {
      title: "الرسم النسبي الزواج وقسيمة التحصيل",
      url: "/assets/video/المتحصلات/6.mp4",
    },
    {
      title: "نماذج 72 علي واحد اثنين ثلاثة",
      url: "/assets/video/المتحصلات/7.mp4",
    },
    {
      title: "ضبط 504 المتحصلات القنصلية",
      url: "/assets/video/المتحصلات/8.mp4",
    },
    {
      title: "للدولار والدينار الكويتي - شرح مبسط حساب سعر الجنيه أمام العملة المحلية",
      url: "/assets/video/المتحصلات/9.mp4",
    },
    {
      title: "مقدمة للتمارين",
      url: "/assets/video/المتحصلات/10.mp4",
    },
    {
      title: "شرح 504 متحصلات",
      url: "/assets/video/المتحصلات/11.mp4",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-blue-50 py-10 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center justify-center px-4 py-2 mb-4 text-sm font-bold text-blue-700 bg-blue-100 rounded-full">
            منصة التدريب القنصلي
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
            فيديوهات المتحصلات
          </h1>

          <p className="text-slate-500 max-w-2xl mx-auto leading-8">
            مجموعة منظمة من الشروحات التعليمية لمادة المتحصلات، مرتبة بطريقة سهلة وواضحة للمراجعة والتدريب.
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {videos.map((video, index) => (
            <article
              key={index}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Video */}
              <div className="relative bg-slate-900">
                <video
                  controls
                  preload="metadata"
                  className="w-full h-56 object-cover"
                >
                  <source src={video.url} type="video/mp4" />
                  المتصفح الخاص بك لا يدعم تشغيل الفيديو.
                </video>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-slate-700 shadow">
                  الحلقة {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 group-hover:bg-slate-900 transition">
                    ▶
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800 leading-8 group-hover:text-blue-700 transition">
                      {video.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      اضغط على الفيديو لبدء المشاهدة
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}