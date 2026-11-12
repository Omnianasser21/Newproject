import React from "react";
import { useParams, Link } from "react-router-dom";
import { FolderOpen, FileText, Download, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { useCategories, useMediaList } from "../../hooks/useMedia";
import VideoGrid from "./VideoGrid";

/**
 * صفحة عامة لأي قسم أُضيف من لوحة التحكم
 * تعرض الفيديوهات والملفات (PDF) المرتبطة بالقسم — تظهر تلقائيًا بدون أي تغيير في الكود
 */
export default function GenericSectionPage() {
  const { slug } = useParams();
  const { categories, loading: catLoading } = useCategories();
  const { media: videos, loading: videoLoading, error: videoError } = useMediaList(slug, "video");
  const { media: pdfs, loading: pdfLoading } = useMediaList(slug, "pdf");

  const category = categories.find((c) => c.slug === slug);

  if (catLoading) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center bg-[#f4f7fb]">
        <Loader2 size={32} className="animate-spin text-blue-700" />
      </div>
    );
  }

  if (!category) {
    return (
      <div dir="rtl" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#f4f7fb] p-10 text-center">
        <AlertTriangle size={44} className="text-amber-500" />
        <h1 className="text-2xl font-black text-slate-800">هذا القسم غير موجود</h1>
        <p className="text-slate-500">قد يكون القسم اتمسح من لوحة التحكم، أو الرابط غير صحيح.</p>
        <Link to="/" className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800">
          <ArrowRight size={18} />
          الرجوع للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f7fb]">
      <div className="px-4 py-8 md:px-8 lg:px-10">
        {/* الهيدر */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-l from-indigo-900 via-blue-800 to-blue-600 p-8 shadow-xl md:p-10">
          <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
                <FolderOpen size={16} />
                قسم
              </span>
              <h1 className="text-3xl font-black text-white md:text-5xl">{category.name}</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                محتوى هذا القسم (فيديوهات وملفات PDF) يُدار بالكامل من خلال لوحة تحكم الوزارة.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="rounded-2xl bg-white/15 px-6 py-5 text-center backdrop-blur">
                <div className="text-4xl font-black text-white">{videos.length}</div>
                <div className="mt-1 text-sm font-bold text-white/80">فيديو</div>
              </div>
              <div className="rounded-2xl bg-white/15 px-6 py-5 text-center backdrop-blur">
                <div className="text-4xl font-black text-white">{pdfs.length}</div>
                <div className="mt-1 text-sm font-bold text-white/80">PDF</div>
              </div>
            </div>
          </div>
        </div>

        <VideoGrid media={videos} loading={videoLoading} error={videoError} chip={category.name} badge="قسم" />

        {/* ملفات PDF */}
        {!pdfLoading && pdfs.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-2xl font-black text-slate-800">ملفات PDF</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pdfs.map((pdf) => (
                <a
                  key={pdf.id}
                  href={pdf.url}
                  download={pdf.original_name || true}
                  className="group flex items-center gap-4 rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-lg"
                >
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-red-50 text-red-500 transition group-hover:bg-red-100">
                    <FileText size={26} />
                    <span className="text-[10px] font-black">PDF</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-slate-800" dir="auto" title={pdf.title}>
                      {pdf.title}
                    </p>
                    {pdf.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500" dir="auto">
                        {pdf.description}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] font-bold text-slate-400">
                      {pdf.file_size_human}
                    </p>
                  </div>
                  <Download size={20} className="shrink-0 text-slate-300 transition group-hover:text-red-500" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
