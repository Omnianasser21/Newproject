import React from "react";
import { Briefcase } from "lucide-react";
import { useMediaList } from "../../hooks/useMedia";
import VideoGrid from "../media/VideoGrid";

export default function GeneralExpenses() {
  const { media: videos, loading, error } = useMediaList("general_expenses", "video");

  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f7fb]">
      <div className="px-4 py-8 md:px-8 lg:px-10">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-l from-slate-900 via-blue-800 to-blue-600 p-8 shadow-xl md:p-10">
          <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
                <Briefcase size={16} />
                الشؤون المالية
              </span>

              <h1 className="text-3xl font-black text-white md:text-5xl">
                المصروفات العامة
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                مكتبة تدريبية لشرح بنود المصروفات العامة، النماذج والدفاتر
                الحسابية، مستندات الحساب الشهري، والتطبيقات العملية الخاصة
                بالمصروفات.
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 px-6 py-5 text-center backdrop-blur">
              <div className="text-4xl font-black text-white">
                {videos.length}
              </div>
              <div className="mt-1 text-sm font-bold text-white/80">
                فيديو تدريبي
              </div>
            </div>
          </div>
        </div>

        <VideoGrid media={videos} loading={loading} error={error} chip="الشؤون المالية" badge="المصروفات" />
      </div>
    </div>
  );
}
