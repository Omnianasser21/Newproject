import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Users,
  UserPlus,
  Trash2,
  Pencil,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { apiFetch, ApiError } from "../api/client";

export default function AdminAdmins() {
  const { admin: currentAdmin } = useOutletContext();
  const isSuper = currentAdmin?.role === "super_admin";

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // نموذج الإضافة
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  // نموذج التعديل (modal)
  const [editing, setEditing] = useState(null);
  const [editFullName, setEditFullName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("admin");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const showToast = (kind, text) => {
    setToast({ kind, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 4000);
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/admins/list.php");
      setAdmins(data.admins ?? []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذر تحميل قائمة الأدمنز");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddError("");
    setAdding(true);
    try {
      await apiFetch("/api/admins/add.php", {
        method: "POST",
        body: { username: username.trim(), full_name: fullName.trim(), password, role },
      });
      setUsername("");
      setFullName("");
      setPassword("");
      setRole("admin");
      showToast("success", "تم إضافة الأدمن بنجاح");
      load();
    } catch (err) {
      setAddError(err instanceof ApiError ? err.message : "تعذر إضافة الأدمن");
    } finally {
      setAdding(false);
    }
  };

  const openEdit = (admin) => {
    setEditing(admin);
    setEditFullName(admin.full_name);
    setEditPassword("");
    setEditRole(admin.role);
    setEditError("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditError("");
    setSaving(true);
    try {
      const body = { id: editing.id, full_name: editFullName.trim() };
      if (editPassword) body.password = editPassword;
      if (isSuper) body.role = editRole;
      await apiFetch("/api/admins/update.php", { method: "POST", body });
      setEditing(null);
      showToast("success", "تم حفظ التعديلات");
      load();
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
      await apiFetch("/api/admins/delete.php", {
        method: "POST",
        body: { id: deleting.id },
      });
      setDeleting(null);
      showToast("success", "تم حذف الأدمن");
      load();
    } catch (err) {
      showToast("error", err instanceof ApiError ? err.message : "تعذر الحذف");
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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">إدارة الأدمنز</h1>
            <p className="text-sm text-slate-500">
              حسابك: {currentAdmin?.full_name} —{" "}
              {isSuper ? "مدير نظام (super_admin)" : "أدمن"}
            </p>
          </div>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-800"
        >
          <RefreshCw size={18} />
          تحديث
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* نموذج إضافة أدمن */}
        <form
          onSubmit={handleAdd}
          className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">إضافة أدمن جديد</h2>
              <p className="text-xs text-slate-500">هيبقى يقدر يسجل دخول ويتحكم في الموقع</p>
            </div>
          </div>

          {addError && (
            <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
              {addError}
            </p>
          )}

          <label htmlFor="new-username" className="mb-1.5 block text-sm font-bold text-slate-700">
            اسم المستخدم (إنجليزي) *
          </label>
          <input
            id="new-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="مثال: mona_editor"
            required
            dir="ltr"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <label htmlFor="new-fullname" className="mb-1.5 mt-4 block text-sm font-bold text-slate-700">
            الاسم الكامل *
          </label>
          <input
            id="new-fullname"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="مثال: منى أحمد الشافعي"
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <label htmlFor="new-password" className="mb-1.5 mt-4 block text-sm font-bold text-slate-700">
            كلمة المرور * <span className="font-normal text-slate-400">(8 أحرف على الأقل)</span>
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              dir="ltr"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-left outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "إخفاء" : "إظهار"}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isSuper && (
            <>
              <label htmlFor="new-role" className="mb-1.5 mt-4 block text-sm font-bold text-slate-700">
                الصلاحية
              </label>
              <select
                id="new-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="admin">أدمن</option>
                <option value="super_admin">مدير نظام (super_admin)</option>
              </select>
            </>
          )}

          <button
            type="submit"
            disabled={adding}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {adding ? <Loader2 size={20} className="animate-spin" /> : <UserPlus size={20} />}
            {adding ? "جارٍ الإضافة..." : "إضافة الأدمن"}
          </button>
        </form>

        {/* قائمة الأدمنز */}
        <div className="xl:col-span-3">
          {loading && (
            <div className="flex items-center justify-center gap-3 rounded-[24px] border border-slate-200 bg-white py-16 text-slate-500">
              <Loader2 size={26} className="animate-spin text-blue-700" />
              <span className="font-semibold">جارٍ التحميل...</span>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-[24px] border border-red-200 bg-red-50 p-8 text-center">
              <AlertTriangle className="mx-auto mb-2 text-red-500" size={32} />
              <p className="font-bold text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            {admins.map((admin) => {
              const isSelf = admin.id === currentAdmin?.id;
              return (
                <div
                  key={admin.id}
                  className="flex flex-col gap-4 rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 text-lg font-black text-white">
                    {(admin.full_name || admin.username).trim().charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 font-black text-slate-800">
                      {admin.full_name}
                      {isSelf && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                          أنت
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500" dir="ltr">@{admin.username}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
                          admin.role === "super_admin"
                            ? "bg-amber-50 text-amber-800"
                            : "bg-blue-50 text-blue-800"
                        }`}
                      >
                        <ShieldCheck size={11} />
                        {admin.role === "super_admin" ? "مدير نظام" : "أدمن"}
                      </span>
                      {admin.created_at && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500" dir="ltr">
                          {String(admin.created_at).slice(0, 10)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => openEdit(admin)}
                      title="تعديل"
                      aria-label="تعديل"
                      className="rounded-2xl bg-blue-50 p-2.5 text-blue-700 transition hover:bg-blue-100"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => setDeleting(admin)}
                      disabled={isSelf}
                      title={isSelf ? "لا يمكنك حذف حسابك" : "حذف"}
                      aria-label="حذف"
                      className="rounded-2xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-30"
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
          aria-label="تعديل الأدمن"
          onClick={() => !saving && setEditing(null)}
        >
          <form
            onSubmit={handleSaveEdit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">
                تعديل «{editing.username}»
              </h3>
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

            <label htmlFor="edit-fn" className="mb-1.5 block text-sm font-bold text-slate-700">
              الاسم الكامل
            </label>
            <input
              id="edit-fn"
              type="text"
              value={editFullName}
              onChange={(e) => setEditFullName(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <label htmlFor="edit-pw" className="mb-1.5 mt-4 block text-sm font-bold text-slate-700">
              كلمة مرور جديدة <span className="font-normal text-slate-400">(اتركها فارغة بدون تغيير)</span>
            </label>
            <input
              id="edit-pw"
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              minLength={8}
              dir="ltr"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            {isSuper && (
              <>
                <label htmlFor="edit-role" className="mb-1.5 mt-4 block text-sm font-bold text-slate-700">
                  الصلاحية
                </label>
                <select
                  id="edit-role"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="admin">أدمن</option>
                  <option value="super_admin">مدير نظام (super_admin)</option>
                </select>
              </>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-700 py-3 font-black text-white transition hover:bg-blue-800 disabled:opacity-60"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                {saving ? "جارٍ الحفظ..." : "حفظ"}
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

      {/* نافذة تأكيد حذف أدمن */}
      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="تأكيد الحذف"
          onClick={() => !deleteBusy && setDeleting(null)}
        >
          <div
            className="w-full max-w-md rounded-[24px] bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={30} className="text-red-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800">حذف الأدمن «{deleting.username}»؟</h3>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              لن يقدر على تسجيل الدخول مرة أخرى. الفيديوهات والملفات التي رفعها تظل موجودة.
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
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-2xl ${
            toast.kind === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
