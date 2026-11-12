import React from "react";
import { Video } from "lucide-react";
import { useMediaList } from "../../hooks/useMedia";
import VideoGrid from "./VideoGrid";

/**
 * صفحة قسم فيديوهات كاملة (هيدر + شبكة فيديوهات من الـ API)
 * props:
 *   category     slug القسم في قاعدة البيانات
 *   badge        نص الشارة أعلى الهيدر
 *   title        العنوان الرئيسي
 *   description  النص التوضيحي
 *   chip         نص الشريحة أسفل كل بطاقة
 *   gradient     كلاسات التدرج للهيدر (اختياري)
 */
export default function CategoryVideoPage({
  category,
  badge = "الشؤون المالية",
  title,
  description,
  chip,
  gradient = "from-blue-800 via-blue-700 to-blue-500",
}) {
  const { media, loading, error } = useMediaList(category, "video");

  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f7fb]">
      <div className="px-4 py-8 md:px-8 lg:px-10">
        {/* الهيدر */}
        <div
          className={`relative overflow-hidden rounded-[28px] bg-gradient-to-l ${gradient} p-8 shadow-xl md:p-10`}
        >
          <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
                <Video size={16} />
                {badge}
              </span>
              <h1 className="text-3xl font-black text-white md:text-5xl">{title}</h1>
              {description && (
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                  {description}
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-white/15 px-6 py-5 text-center backdrop-blur">
              <div className="text-4xl font-black text-white">{media.length}</div>
              <div className="mt-1 text-sm font-bold text-white/80">فيديو متاح</div>
            </div>
          </div>
        </div>

        <VideoGrid media={media} loading={loading} error={error} chip={chip} badge={badge} />
      </div>
    </div>
  );
}
