import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { version } from "pdfjs-dist/package.json";
import { Loader2, AlertTriangle, FileText, Download, Printer } from "lucide-react";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { useMediaList } from "../../hooks/useMedia";

export default function Budgetbulletin() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { media: pdfs, loading, error } = useMediaList("budget_bulletin", "pdf");

  const currentPdf = pdfs[0] ?? null;

  return (
    <div dir="rtl" className="mt-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex flex-col items-center justify-between border-b bg-gray-50 p-6 md:flex-row">
          <div className="text-right">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-blue-700 md:text-3xl">
              <FileText size={30} />
              نشرة الموازنة
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {currentPdf ? currentPdf.title : "النشرة الرسمية للموازنة"}
            </p>
          </div>

          {currentPdf && (
            <div className="mt-4 flex gap-3 md:mt-0">
              <a
                href={currentPdf.url}
                download={currentPdf.original_name || true}
                className="flex items-center gap-2 rounded-lg border border-blue-900 px-4 py-2 text-blue-700 shadow transition hover:bg-blue-100"
              >
                <Download size={18} />
                تحميل
              </a>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
              >
                <Printer size={18} />
                طباعة
              </button>
            </div>
          )}
        </div>

        {/* المحتوى */}
        {loading && (
          <div className="flex h-[60vh] items-center justify-center gap-3 text-slate-500">
            <Loader2 size={28} className="animate-spin text-blue-700" />
            <span className="font-semibold">جارٍ تحميل نشرة الموازنة...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
            <AlertTriangle size={40} className="text-red-500" />
            <p className="font-bold text-red-700">{error}</p>
            <p className="text-sm text-slate-400">حاول تحديث الصفحة</p>
          </div>
        )}

        {!loading && !error && !currentPdf && (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
            <FileText size={44} className="text-slate-300" />
            <p className="text-lg font-bold text-slate-600">لا توجد نشرة موازنة مرفوعة حاليًا</p>
            <p className="max-w-md text-sm leading-7 text-slate-400">
              بمجرد أن يقوم الأدمن برفع ملف PDF لقسم «نشرة الموازنة» من لوحة التحكم، ستظهر هنا تلقائيًا.
            </p>
          </div>
        )}

        {!loading && !error && currentPdf && (
          <>
            {currentPdf.description && (
              <p className="border-b bg-white px-6 py-3 text-sm leading-7 text-slate-500" dir="auto">
                {currentPdf.description}
              </p>
            )}
            <div className="h-[80vh] bg-gray-100 p-4">
              <div className="h-full overflow-hidden rounded-xl border bg-white shadow-inner">
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`}
                >
                  <Viewer
                    fileUrl={currentPdf.url}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </Worker>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
