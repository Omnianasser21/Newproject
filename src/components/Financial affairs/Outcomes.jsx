import React from "react";
import { Loader2, AlertTriangle, VideoOff } from "lucide-react";
import { useMediaList } from "../../hooks/useMedia";

export default function Outcomes() {
  const { media: videos, loading, error } = useMediaList("outcome", "video");

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-blue-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
            منصة التدريب القنصلي
          </span>

          <h1 className="mb-3 text-3xl font-extrabold text-slate-800 md:text-4xl">
            فيديوهات المتحصلات
          </h1>

          <p className="mx-auto max-w-2xl leading-8 text-slate-500">
            مجموعة منظمة من الشروحات التعليمية لمادة المتحصلات، مرتبة بطريقة سهلة وواضحة للمراجعة والتدريب.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white py-16 text-slate-500">
            <Loader2 size={26} className="animate-spin text-blue-700" />
            <span className="font-semibold">جارٍ تحميل الفيديوهات...</span>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <AlertTriangle className="mx-auto mb-2 text-red-500" size={34} />
            <p className="font-bold text-red-700">{error}</p>
            <p className="mt-1 text-sm text-red-400">حاول تحديث الصفحة</p>
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <VideoOff className="mx-auto mb-3 text-slate-300" size={44} />
            <p className="text-lg font-bold text-slate-600">لا توجد فيديوهات متاحة حاليًا</p>
            <p className="mt-1 text-sm text-slate-400">سيتم إضافة محتوى جديد قريبًا.</p>
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <article
              key={video.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Video */}
              <div className="relative bg-slate-900">
                <video
                  controls
                  preload="metadata"
                  className="h-56 w-full object-cover"
                  aria-label={video.title}
                >
                  <source src={video.url} type="video/mp4" />
                  المتصفح الخاص بك لا يدعم تشغيل الفيديو.
                </video>

                <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-slate-700 shadow backdrop-blur">
                  الحلقة {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white transition group-hover:bg-slate-900">
                    ▶
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-extrabold leading-8 text-slate-800 transition group-hover:text-blue-700" dir="auto">
                      {video.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {video.description || "اضغط على الفيديو لبدء المشاهدة"}
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
