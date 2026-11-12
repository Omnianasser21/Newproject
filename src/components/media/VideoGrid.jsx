import React from "react";
import { Loader2, AlertTriangle, VideoOff, Video } from "lucide-react";

/**
 * شبكة عرض الفيديوهات القادمة من الـ API
 * props:
 *   media     array<MediaItem>
 *   loading   bool
 *   error     string | null
 *   chip      نص الشريحة أسفل البطاقة (مثل: "المصروفات العامة")
 *   badge     نص الشارة أعلى البطاقة (افتراضي: "فيديو")
 */
export default function VideoGrid({ media = [], loading, error, chip, badge = "فيديو" }) {
  return (
    <>
      {/* عنوان القسم */}
      <div className="mt-10 mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">الفيديوهات المتاحة</h2>
          <p className="mt-2 text-sm text-slate-500">
            اختار الفيديو وابدأ المشاهدة مباشرة — والقائمة بتتحدث من خلال لوحة التحكم.
          </p>
        </div>
        {!loading && !error && (
          <div className="inline-flex w-fit rounded-full bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700">
            إجمالي العدد: {media.length}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-[24px] border border-slate-200 bg-white py-16 text-slate-500">
          <Loader2 size={26} className="animate-spin text-blue-700" />
          <span className="font-semibold">جارٍ تحميل الفيديوهات...</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-[24px] border border-red-200 bg-red-50 p-10 text-center">
          <AlertTriangle className="mx-auto mb-2 text-red-500" size={34} />
          <p className="font-bold text-red-700">{error}</p>
          <p className="mt-1 text-sm text-red-400">حاول تحديث الصفحة</p>
        </div>
      )}

      {!loading && !error && media.length === 0 && (
        <div className="mt-2 rounded-[24px] border border-slate-200 bg-white p-12 text-center shadow-sm">
          <VideoOff className="mx-auto mb-3 text-slate-300" size={44} />
          <p className="text-lg font-bold text-slate-600">لا توجد فيديوهات متاحة حاليًا</p>
          <p className="mt-1 text-sm text-slate-400">سيتم إضافة محتوى جديد قريبًا.</p>
        </div>
      )}

      {/* شبكة البطاقات */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {media.map((video, index) => (
          <article
            key={video.id}
            className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative bg-slate-900">
              <video
                controls
                preload="metadata"
                className="h-[220px] w-full object-cover"
                aria-label={video.title}
              >
                <source src={video.url} type="video/mp4" />
                المتصفح الخاص بك لا يدعم تشغيل الفيديو.
              </video>

              <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-blue-700 px-3 py-1 text-xs font-black text-white shadow">
                درس {String(index + 1).padStart(2, "0")}
              </div>
              <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800">
                <Video size={12} />
                {badge}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-center text-xl font-black leading-8 text-slate-800" dir="auto">
                {video.title}
              </h3>

              {video.description && (
                <p className="mt-3 min-h-[52px] text-center text-sm leading-7 text-slate-500" dir="auto">
                  {video.description}
                </p>
              )}

              <div className="mt-4 flex items-center justify-center gap-2">
                {chip && (
                  <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                    {chip}
                  </span>
                )}
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                  فيديو
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
