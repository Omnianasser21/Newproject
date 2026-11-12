import React from "react";
import {
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  FileText,
  Loader2,
} from "lucide-react";

/**
 * صف عنصر وسائط واحد في جدول الإدارة
 * props: item, busy (bool), onToggle, onEdit, onDelete
 */
export default function MediaRow({ item, busy, onToggle, onEdit, onDelete }) {
  const isVideo = item.type === "video";

  return (
    <div
      className={`flex flex-col gap-4 rounded-[20px] border bg-white p-4 shadow-sm transition sm:flex-row sm:items-center ${
        item.is_visible ? "border-slate-200" : "border-amber-200 bg-amber-50/40"
      }`}
    >
      {/* المصغّرة */}
      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-900 sm:h-24 sm:w-40">
        {isVideo ? (
          <video
            src={item.url}
            preload="metadata"
            muted
            className="h-full w-full object-cover"
            aria-label={item.title}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-red-50 text-red-500">
            <FileText size={34} />
            <span className="text-[11px] font-black tracking-wide">PDF</span>
          </div>
        )}
        {!item.is_visible && (
          <span className="absolute right-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-amber-950 shadow">
            مخفي
          </span>
        )}
      </div>

      {/* البيانات */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-black text-slate-800" dir="auto" title={item.title}>
          {item.title}
        </p>
        {item.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500" dir="auto">
            {item.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-800">
            {item.category_name}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            {item.file_size_human}
          </span>
          {item.created_at && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500" dir="ltr">
              {String(item.created_at).slice(0, 10)}
            </span>
          )}
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
        <button
          type="button"
          onClick={() => onToggle(item)}
          disabled={busy}
          title={item.is_visible ? "إخفاء من الموقع" : "إظهار في الموقع"}
          aria-label={item.is_visible ? "إخفاء من الموقع" : "إظهار في الموقع"}
          className={`rounded-2xl p-2.5 transition disabled:opacity-50 ${
            item.is_visible
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
          }`}
        >
          {busy ? <Loader2 size={20} className="animate-spin" /> : item.is_visible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>

        <button
          type="button"
          onClick={() => onEdit(item)}
          disabled={busy}
          title="تعديل"
          aria-label="تعديل"
          className="rounded-2xl bg-blue-50 p-2.5 text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
        >
          <Pencil size={20} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(item)}
          disabled={busy}
          title="حذف نهائي"
          aria-label="حذف نهائي"
          className="rounded-2xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
