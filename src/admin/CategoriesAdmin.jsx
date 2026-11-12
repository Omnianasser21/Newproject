import React, { useMemo, useState } from "react";
import {
  FolderOpen,
  FolderPlus,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  Save,
  X,
  AlertTriangle,
  FileText,
  Video,
} from "lucide-react";
import { useCategories, useMediaList } from "../hooks/useMedia";
import { apiFetch, ApiError } from "../api/client";

export default function CategoriesAdmin() {
  const { categories, loading, refresh } = useCategories();
  const { media, refresh: refreshMedia } = useMediaList(null, null, true);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editSort, setEditSort] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (kind, text) => {
    setToast({ kind, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 4000);
  };

  const counts = useMemo(() => {
    const map = {};
    for (const item of media) {
      if (!map[item.category_slug]) map[item.category_slug] = { video: 0, pdf: 0 };
      map[item.category_slug][item.type === "pdf" ? "pdf" : "video"] += 1;
    }
    return map;
  }, [media]);

  const reloadAll = () => {
    refresh();
    refreshMedia();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddError("");
    setAdding(true);
    try {
      await apiFetch("/api/categories/add.php", {
        method: "POST",
        body: {
          name: name.trim(),
          slug: slug.trim() || undefined,
          sort_order: sortOrder === "" ? 0 : Number(sortOrder),
        },
      });
      setName("");
      setSlug("");
      setSortOrder("");
      showToast("success", "تم إضافة القسم — هيظهر في قوائم الرفع والموقع فورًا");
      reloadAll();
    } catch (err) {
      setAddError(err instanceof ApiError ? err.message : "تعذر إضافة القسم");
    } finally {
      setAdding(false);
    }
  };

  const openEdit = (category) => {
    setEditing(category);
    setEditName(category.name);
    setEditSlug(category.slug);
    setEditSort(String(category.sort_order ?? 0));
    setEditError("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditError("");
    setSaving(true);
    try {
      await apiFetch("/api/categories/update.php", {
        method: "POST",
        body: {
          id: editing.id,
          name: editName.trim(),
          slug: editSlug.trim(),
          sort_order: Number(editSort || 0),
        },
      });
      setEditing(null);
      showToast("success", "تم حفظ التعديلات");
      reloadAll();
    } catch (err) {
      setEditError(err instanceof ApiError ? err.message : "تعذر حفظ التعديلات");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await apiFetch("/api/categories/delete.php", {
        method: "POST",
        body: { id: deleting.id },
      });
      setDeleting(null);
      showToast("success", "تم حذف القسم");
      reloadAll();
    } catch (err) {
      showToast("error", err instanceof ApiError ? err.message : "تعذر حذف القسم");
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      {/* الترويسة */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-700 text-white shadow-lg shadow-indigo-700/25">
            <FolderOpen size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">إدارة الأقسام</h1>
            <p className="text-sm text-slate-500">
              {categories.length} قسم — القسم الجديد يظهر في قوائم الرفع والموقع تلقائيًا
            </p>
          </div>
        </div>
        <button
          onClick={reloadAll}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-800"
        >
          <RefreshCw size={18} />
          تحديث
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* نموذج إضافة قسم */}
        <form
          onSubmit={handleAdd}
          className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-700 text-white">
              <FolderPlus size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">إضافة قسم جديد</h2>
              <p className="text-xs text-slate-500">مثال: التدريب، الموارد البشرية، المعارض...</p>
            </div>
          </div>

          {addError && (
            <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
              {addError}
            </p>
          )}

          <label htmlFor="cat-name" className="mb-1.5 block text-sm font-bold text-slate-700">
            اسم القسم *
          </label>
          <input
            id="cat-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: التدريب والبعثات"
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <label htmlFor="cat-slug" className="mb-1.5 mt-4 block text-sm font-bold text-slate-700">
            الـ Slug <span className="font-normal text-slate-400">(إنجليزي، اختياري — يتولّد تلقائيًا لو تركته فاضي)</span>
          </label>
          <input
            id="cat-slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="مثال: training_missions"
            dir="ltr"
            pattern="[a-z0-9][a-z0-9_-]{1,49}"
            title="حروف إنجليزية صغيرة وأرقام فقط مع شرطات"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <label htmlFor="cat-sort" className="mb-1.5 mt-4 block text-sm font-bold text-slate-700">
            ترتيب الظهور <span className="font-normal text-slate-400">(رقم، اختياري)</span>
          </label>
          <input
            id="cat-sort"
            type="number"
            min="0"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            placeholder="مثال: 100"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={adding}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-700 py-3.5 font-black text-white shadow-lg shadow-indigo-700/25 transition hover:bg-indigo-800 disabled:opacity-60"
          >
            {adding ? <Loader2 size={20} className="animate-spin" /> : <FolderPlus size={20} />}
            {adding ? "جارٍ الإضافة..." : "إضافة القسم"}
          </button>

          <p className="mt-4 rounded-2xl bg-indigo-50 px-4 py-3 text-xs leading-6 text-indigo-900">
            بعد الإضافة: القسم يظهر في قائمة «القسم» عند رفع فيديو أو PDF، ويظهر في
            الـ Sidebar في الموقع ويفتح صفحة خاصة يعرض محتواه — كل ده من غير أي تغيير في الكود.
          </p>
        </form>

        {/* قائمة الأقسام */}
        <div className="xl:col-span-3">
          {loading && (
            <div className="flex items-center justify-center gap-3 rounded-[24px] border border-slate-200 bg-white py-16 text-slate-500">
              <Loader2 size={26} className="animate-spin text-blue-700" />
              <span className="font-semibold">جارٍ التحميل...</span>
            </div>
          )}

          <div className="space-y-3">
            {categories.map((category) => {
              const count = counts[category.slug] ?? { video: 0, pdf: 0 };
              const total = count.video + count.pdf;
              return (
                <div
                  key={category.id}
                  className="flex flex-col gap-4 rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-700 to-blue-600 font-black text-xl text-white">
                    {(category.name || "?").trim().charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-800" dir="auto">{category.name}</p>
                    <p className="text-xs text-slate-400" dir="ltr">/{category.slug}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-blue-800">
                        <Video size={11} /> {count.video} فيديو
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-red-700">
                        <FileText size={11} /> {count.pdf} PDF
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">
                        ترتيب: {category.sort_order}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => openEdit(category)}
                      title="تعديل"
                      aria-label="تعديل"
                      className="rounded-2xl bg-blue-50 p-2.5 text-blue-700 transition hover:bg-blue-100"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => setDeleting(category)}
                      title={total > 0 ? "القسم فيه محتوى — احذف محتواه أولًا" : "حذف"}
                      aria-label="حذف"
                      className="rounded-2xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* نافذة التعديل */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="تعديل القسم"
          onClick={() => !saving && setEditing(null)}
        >
          <form
            onSubmit={handleSaveEdit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">تعديل القسم</h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="إغلاق"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {editError && (
              <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
                {editError}
              </p>
            )}

            <label htmlFor="edit-cat-name" className="mb-1.5 block text-sm font-bold text-slate-700">
              اسم القسم *
            </label>
            <input
              id="edit-cat-name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <label htmlFor="edit-cat-slug" className="mb-1.5 mt-4 block text-sm font-bold text-slate-700">
              الـ Slug
            </label>
            <input
              id="edit-cat-slug"
              type="text"
              dir="ltr"
              value={editSlug}
              onChange={(e) => setEditSlug(e.target.value)}
              pattern="[a-z0-9][a-z0-9_-]{1,49}"
              title="حروف إنجليزية صغيرة وأرقام فقط"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <label htmlFor="edit-cat-sort" className="mb-1.5 mt-4 block text-sm font-bold text-slate-700">
              ترتيب الظهور
            </label>
            <input
              id="edit-cat-sort"
              type="number"
              min="0"
              value={editSort}
              onChange={(e) => setEditSort(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

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
                onClick={() => setEditing(null)}
                className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* نافذة تأكيد الحذف */}
      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="تأكيد حذف القسم"
          onClick={() => !deleteBusy && setDeleting(null)}
        >
          <div
            className="w-full max-w-md rounded-[24px] bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={30} className="text-red-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800">حذف القسم «{deleting.name}»؟</h3>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              الحذف متاح فقط لو القسم فارغ — أي محتوى مرتبط بيمنع الحذف.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteBusy}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 font-black text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleteBusy ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                {deleteBusy ? "جارٍ الحذف..." : "نعم، احذف"}
              </button>
              <button
                onClick={() => setDeleting(null)}
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
