import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { version } from "pdfjs-dist/package.json";

// styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function Budgetbulletin() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const pdfUrl = "/pdfs/events112.pdf";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 mt-20">

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* 🔹 Header */}
        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b bg-gray-50">

          <div className="text-right">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700">
              نشرة الميزانية
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              السنة المالية 2014 / 2013
            </p>
          </div>

          {/* 🔹 Buttons */}
          <div className="flex gap-3 mt-4 md:mt-0">

            <a
              href={pdfUrl}
              download
              className="px-4 py-2  border border-blue-900 text-blue-700 rounded-lg shadow hover:bg-blue-100 transition"
            >
              تحميل
            </a>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              طباعة
            </button>

          </div>
        </div>

        {/* 🔹 PDF Viewer */}
        <div className="h-[80vh] p-4 bg-gray-100">
          <div className="h-full border rounded-xl overflow-hidden shadow-inner bg-white">

            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`}
            >
              <Viewer
                fileUrl={pdfUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>

          </div>
        </div>

      </div>

    </div>
  );
}