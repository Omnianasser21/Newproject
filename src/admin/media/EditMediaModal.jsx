import React, { useEffect, useState } from "react";
import { X, Loader2, Save } from "lucide-react";
import { apiFetch, ApiError } from "../../api/client";

/**
 * نافذة تعديل عنصر وسائط
 * props: item, categories, onClose, onSaved(updatedItem)
 */
export default function EditMediaModal({ item, categories, onClose, onSaved }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || "");
  const [category, setCategory] = useState(item.category_slug);
  const [isVisible, setIsVisible] = useState(item.is_visible);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // إغلاق بزر Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("العنوان لا يمكن أن يكون فارغًا");

    setSaving(true);
    try {
      const data = await apiFetch("/api/media/update.php", {
        method: "POST",
        body: {
          id: item.id,
          title: title.trim(),
          description: description.trim(),
          category,
          is_visible: isVisible,
        },
      });
      onSaved(data.media);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذر حفظ التعديلات");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="تعديل العنصر"
      onClick={onClose}
    >
      <form
        onSubmit={handleSave}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800">تعديل البيانات</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <label htmlFor="edit-title" className="mb-1.5 block text-sm font-bold text-slate-700">
          العنوان *
        </label>
        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

        <label htmlFor="edit-desc" className="mb-1.5 mt-4 block text-sm font-bold text-slate-700">
          الوصف
        </label>
        <textarea
          id="edit-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

        <label htmlFor="edit-cat" className="mb-1.5 mt-4 block text-sm font-bold text-slate-700">
          القسم
        </label>
        <select
          id="edit-cat"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span>
            <span className="block text-sm font-bold text-slate-800">ظاهر في الموقع</span>
            <span className="block text-xs text-slate-500">
              إلغاء الاختيار = إخفاء مؤقت بدون حذف الملف
            </span>
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="h-6 w-6 accent-blue-700"
          />
        </label>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-700 py-3 font-black text-white transition hover:bg-blue-800 disabled:opacity-60"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {saving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
