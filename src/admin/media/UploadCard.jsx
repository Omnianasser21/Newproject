import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  Video,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck2,
} from "lucide-react";
import { apiFetch, uploadWithProgress, formatBytes, ApiError } from "../../api/client";

/**
 * كرت رفع ملف جديد (فيديو أو PDF)
 * props:
 *   type        "video" | "pdf"
 *   categories  الأقسام المتاحة
 *   onUploaded  callback(mediaItem) بعد نجاح الرفع
 */
export default function UploadCard({ type, categories, onUploaded }) {
  const isVideo = type === "video";
  const accept = isVideo
    ? ".mp4,.webm,.mov,.mkv,.avi,.m4v,video/*"
    : ".pdf,application/pdf";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [message, setMessage] = useState(null); // { kind: 'success'|'error', text }

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setFile(null);
    setProgress(0);
    setUploadedBytes(0);
    setTotalBytes(0);
    const input = document.getElementById(`file-input-${type}`);
    if (input) input.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!file) return setMessage({ kind: "error", text: "اختار ملف للرفع أولًا" });
    if (!title.trim()) return setMessage({ kind: "error", text: "أدخل عنوان الملف" });
    if (!category) return setMessage({ kind: "error", text: "اختار القسم" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("type", type);

    setUploading(true);
    setProgress(0);
    try {
      const result = await uploadWithProgress(
        "/api/media/upload.php",
        formData,
        ({ loaded, total, percent }) => {
          setProgress(percent);
          setUploadedBytes(loaded);
          setTotalBytes(total);
        }
      );
      setMessage({ kind: "success", text: result.message || "تم الرفع بنجاح" });
      resetForm();
      onUploaded?.(result.media);
    } catch (err) {
      const text =
        err instanceof ApiError ? err.message : "فشل الرفع — حاول مرة أخرى";
      setMessage({ kind: "error", text });
    } finally {
      setUploading(false);
    }
  };

  const remaining = totalBytes && uploadedBytes ? formatBytes(totalBytes - uploadedBytes) : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white">
          {isVideo ? <Video size={24} /> : <FileText size={24} />}
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800">
            {isVideo ? "رفع فيديو جديد" : "رفع ملف PDF جديد"}
          </h2>
          <p className="text-xs text-slate-500">
            {isVideo ? "MP4 / WEBM / MOV — حتى الحد الأقصى للسيرفر" : "ملفات PDF فقط"}
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            message.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.kind === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          )}
          <span className="flex-1">{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} aria-label="إغلاق">
            <X size={16} />
          </button>
        </div>
      )}

      {/* اختيار الملف */}
      <label
        htmlFor={`file-input-${type}`}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-6 text-center transition ${
          file
            ? "border-blue-400 bg-blue-50/60"
            : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40"
        }`}
      >
        {file ? (
          <>
            <FileCheck2 size={34} className="text-blue-700" />
            <p className="max-w-full truncate text-sm font-bold text-slate-800" dir="auto">
              {file.name}
            </p>
            <p className="text-xs text-slate-500">
              {formatBytes(file.size)} — اضغط لاختيار ملف آخر
            </p>
          </>
        ) : (
          <>
            <UploadCloud size={34} className="text-slate-400" />
            <p className="text-sm font-bold text-slate-700">اضغط لاختيار ملف{isVideo ? " فيديو" : " PDF"}</p>
            <p className="text-xs text-slate-400">سيظهر شريط التقدم أثناء الرفع</p>
          </>
        )}
        <input
          id={`file-input-${type}`}
          type="file"
          accept={accept}
          className="sr-only"
          aria-label={isVideo ? "اختيار ملف فيديو للرفع" : "اختيار ملف PDF للرفع"}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {/* العنوان */}
      <div className="mt-4">
        <label htmlFor={`title-${type}`} className="mb-1.5 block text-sm font-bold text-slate-700">
          العنوان *
        </label>
        <input
          id={`title-${type}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isVideo ? "مثال: تسجيل مصور — مادة المتحصلات" : "مثال: نشرة الموازنة 2026"}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          required
        />
      </div>

      {/* الوصف */}
      <div className="mt-4">
        <label htmlFor={`desc-${type}`} className="mb-1.5 block text-sm font-bold text-slate-700">
          الوصف <span className="font-normal text-slate-400">(اختياري)</span>
        </label>
        <textarea
          id={`desc-${type}`}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="وصف مختصر يظهر أسفل الملف في الموقع"
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* القسم */}
      <div className="mt-4">
        <label htmlFor={`cat-${type}`} className="mb-1.5 block text-sm font-bold text-slate-700">
          القسم *
        </label>
        <select
          id={`cat-${type}`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          required
        >
          <option value="">— اختار القسم —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* شريط التقدم */}
      {uploading && (
        <div className="mt-5" aria-live="polite">
          <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
            <span className="text-blue-800">
              {progress < 100 ? "جارٍ رفع الملف..." : "اكتمل الرفع، جارٍ الحفظ..."}
            </span>
            <span className="tabular-nums text-blue-900">{progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-3.5 w-full overflow-hidden rounded-full bg-slate-100"
          >
            <div
              className="h-full rounded-full bg-gradient-to-l from-blue-700 to-blue-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          {totalBytes > 0 && (
            <p className="mt-1.5 text-[11px] tabular-nums text-slate-500" dir="ltr">
              {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}
              {remaining && progress < 100 ? ` — متبقي ${remaining}` : ""}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 py-3.5 font-black text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
        {uploading ? `جارٍ الرفع... ${progress}%` : "رفع وحفظ"}
      </button>
    </form>
  );
}
