import React, { useState } from "react";
import {
  Video,
  FileText,
  Search,
  RefreshCw,
  Loader2,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { useMediaList, useCategories } from "../../hooks/useMedia";
import { apiFetch, ApiError } from "../../api/client";
import UploadCard from "./UploadCard";
import MediaRow from "./MediaRow";
import EditMediaModal from "./EditMediaModal";

/**
 * صفحة إدارة الوسائط — تُستخدم للفيديو (/admin/videos) ولملفات PDF (/admin/pdfs)
 * props: type: "video" | "pdf"
 */
export default function MediaAdmin({ type }) {
  const isVideo = type === "video";
  const { categories } = useCategories();
  const { media, loading, error, refresh } = useMediaList(null, type, true);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (kind, text) => {
    setToast({ kind, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 4000);
  };

  const filtered = media.filter((item) => {
    if (categoryFilter && item.category_slug !== categoryFilter) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.description || "").toLowerCase().includes(q)
    );
  });

  const handleToggle = async (item) => {
    setBusyId(item.id);
    try {
      const data = await apiFetch("/api/media/update.php", {
        method: "POST",
        body: { id: item.id, is_visible: !item.is_visible },
      });
      showToast("success", data.media.is_visible ? "تم إظهار العنصر في الموقع" : "تم إخفاء العنصر من الموقع");
      refresh();
    } catch (err) {
      showToast("error", err instanceof ApiError ? err.message : "تعذر تغيير حالة الإظهار");
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setDeleteBusy(true);
    try {
      await apiFetch("/api/media/delete.php", {
        method: "POST",
        body: { id: deletingItem.id },
      });
      showToast("success", "تم الحذف نهائيًا");
      setDeletingItem(null);
      refresh();
    } catch (err) {
      showToast("error", err instanceof ApiError ? err.message : "تعذر الحذف");
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      {/* الترويسة */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/25">
            {isVideo ? <Video size={28} /> : <FileText size={28} />}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">
              {isVideo ? "إدارة الفيديوهات" : "إدارة ملفات PDF"}
            </h1>
            <p className="text-sm text-slate-500">
              {media.length} {isVideo ? "فيديو" : "ملف"} — {media.filter((m) => m.is_visible).length} ظاهر في الموقع
            </p>
          </div>
        </div>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-800"
        >
          <RefreshCw size={18} />
          تحديث القائمة
        </button>
      </div>

      {/* التخطيط: رفع + قائمة */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <UploadCard
            type={type}
            categories={categories}
            onUploaded={() => {
              refresh();
              showToast("success", isVideo ? "تم رفع الفيديو بنجاح" : "تم رفع الملف بنجاح");
            }}
          />
        </div>

        <div className="xl:col-span-3">
          {/* أدوات البحث والفلترة */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالعنوان أو الوصف..."
                aria-label="بحث"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-11 pl-4 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="فلترة حسب القسم"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:w-56"
            >
              <option value="">كل الأقسام</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* حالات التحميل/الخطأ/الفراغ */}
          {loading && (
            <div className="flex items-center justify-center gap-3 rounded-[24px] border border-slate-200 bg-white py-16 text-slate-500">
              <Loader2 size={26} className="animate-spin text-blue-700" />
              <span className="font-semibold">جارٍ تحميل القائمة...</span>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-[24px] border border-red-200 bg-red-50 p-8 text-center">
              <AlertTriangle className="mx-auto mb-2 text-red-500" size={32} />
              <p className="font-bold text-red-700">{error}</p>
              <button
                onClick={refresh}
                className="mt-4 rounded-2xl bg-red-600 px-5 py-2.5 font-bold text-white hover:bg-red-700"
              >
                حاول مرة أخرى
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="rounded-[24px] border border-slate-200 bg-white p-12 text-center text-slate-500">
              <p className="font-bold">{query || categoryFilter ? "لا توجد نتائج مطابقة" : "لا توجد عناصر بعد"}</p>
              <p className="mt-1 text-sm">
                {query || categoryFilter
                  ? "جرّب تغيير كلمة البحث أو الفلتر"
                  : isVideo
                    ? "ارفع أول فيديو من النموذج على الجنب"
                    : "ارفع أول ملف PDF من النموذج على الجنب"}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {filtered.map((item) => (
              <MediaRow
                key={item.id}
                item={item}
                busy={busyId === item.id}
                onToggle={handleToggle}
                onEdit={setEditingItem}
                onDelete={setDeletingItem}
              />
            ))}
          </div>
        </div>
      </div>

      {/* نافذة التعديل */}
      {editingItem && (
        <EditMediaModal
          item={editingItem}
          categories={categories}
          onClose={() => setEditingItem(null)}
          onSaved={() => {
            setEditingItem(null);
            refresh();
            showToast("success", "تم حفظ التعديلات");
          }}
        />
      )}

      {/* نافذة تأكيد الحذف */}
      {deletingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="تأكيد الحذف"
          onClick={() => !deleteBusy && setDeletingItem(null)}
        >
          <div
            className="w-full max-w-md rounded-[24px] bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={30} className="text-red-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800">حذف نهائي؟</h3>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              سيتم حذف «<span className="font-bold text-slate-700">{deletingItem.title}</span>»
              نهائيًا من قاعدة البيانات والسيرفر. هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteBusy}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 font-black text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleteBusy ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                {deleteBusy ? "جارٍ الحذف..." : "نعم، احذف"}
              </button>
              <button
                onClick={() => setDeletingItem(null)}
                disabled={deleteBusy}
                className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* توست */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-2xl ${
            toast.kind === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          <span>{toast.text}</span>
          <button onClick={() => setToast(null)} aria-label="إغلاق">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
