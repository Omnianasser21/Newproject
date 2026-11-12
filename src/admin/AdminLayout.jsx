import React, { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  FileText,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { apiFetch } from "../api/client";

const NAV_ITEMS = [
  { to: "/admin", icon: LayoutDashboard, label: "نظرة عامة", end: true },
  { to: "/admin/videos", icon: Video, label: "الفيديوهات" },
  { to: "/admin/pdfs", icon: FileText, label: "ملفات PDF" },
  { to: "/admin/categories", icon: FolderOpen, label: "الأقسام" },
  { to: "/admin/admins", icon: Users, label: "الأدمنز" },
];

export default function AdminLayout() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    apiFetch("/api/auth/me.php")
      .then((data) => {
        if (!mounted) return;
        if (data?.authenticated && data?.admin) {
          setAdmin(data.admin);
        } else {
          navigate("/admin/login", {
            replace: true,
            state: { from: location.pathname },
          });
        }
      })
      .catch(() => {
        if (mounted) {
          navigate("/admin/login", {
            replace: true,
            state: { from: location.pathname },
          });
        }
      })
      .finally(() => {
        if (mounted) setChecking(false);
      });
    return () => {
      mounted = false;
    };
    // نتحقق مرة واحدة عند فتح لوحة التحكم
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiFetch("/api/auth/logout.php", { method: "POST" });
    } catch {
      /* حتى لو فشل الطلب، نوجه المستخدم لصفحة الدخول */
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  if (checking) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center bg-[#f4f7fb]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-700" size={40} />
          <p className="font-semibold text-slate-500">جارٍ التحقق من صلاحية الدخول...</p>
        </div>
      </div>
    );
  }

  if (!admin) return null; // سيتم التوجيه إلى /admin/login

  return (
    <div dir="rtl" className="flex min-h-screen bg-[#f4f7fb] font-sans">
      {/* القائمة الجانبية */}
      <aside
        className={`sticky top-0 flex h-screen flex-col bg-gradient-to-b from-slate-900 via-blue-900 to-blue-800 text-white shadow-2xl transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        {/* اللوجو + زر الطي */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 p-4">
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="truncate text-base font-black leading-6">لوحة تحكم الوزارة</p>
              <p className="truncate text-[11px] text-blue-200/80">الشؤون المالية — إدارة الوسائط</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "طي القائمة" : "فتح القائمة"}
            className="rounded-xl p-2 text-blue-100 transition hover:bg-white/10"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* بيانات الأدمن */}
        <div className={`border-b border-white/10 p-4 ${sidebarOpen ? "" : "flex justify-center"}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-black text-lg">
                {(admin.full_name || admin.username || "?").trim().charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold">{admin.full_name}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    admin.role === "super_admin"
                      ? "bg-amber-400/20 text-amber-300"
                      : "bg-blue-400/20 text-blue-200"
                  }`}
                >
                  <ShieldCheck size={11} />
                  {admin.role === "super_admin" ? "مدير النظام" : "أدمن"}
                </span>
              </div>
            </div>
          ) : (
            <div
              title={admin.full_name}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 font-black"
            >
              {(admin.full_name || admin.username || "?").trim().charAt(0)}
            </div>
          )}
        </div>

        {/* روابط التنقل */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={!sidebarOpen ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl p-3 font-semibold transition-all ${
                  sidebarOpen ? "" : "justify-center"
                } ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
                    : "text-blue-100/85 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <item.icon size={21} className="shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* أسفل القائمة */}
        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            to="/"
            title={!sidebarOpen ? "عرض الموقع" : undefined}
            className={`flex items-center gap-3 rounded-2xl p-3 font-semibold text-blue-100/85 transition hover:bg-white/10 hover:text-white ${
              sidebarOpen ? "" : "justify-center"
            }`}
          >
            <ExternalLink size={21} className="shrink-0" />
            {sidebarOpen && <span>عرض الموقع</span>}
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title={!sidebarOpen ? "تسجيل الخروج" : undefined}
            className={`flex w-full items-center gap-3 rounded-2xl p-3 font-semibold text-red-300 transition hover:bg-red-500/15 hover:text-red-200 disabled:opacity-60 ${
              sidebarOpen ? "" : "justify-center"
            }`}
          >
            {loggingOut ? (
              <Loader2 size={21} className="shrink-0 animate-spin" />
            ) : (
              <LogOut size={21} className="shrink-0" />
            )}
            {sidebarOpen && <span>{loggingOut ? "جارٍ الخروج..." : "تسجيل الخروج"}</span>}
          </button>
        </div>
      </aside>

      {/* محتوى الصفحة */}
      <main className="min-w-0 flex-1 overflow-y-auto">
        <Outlet context={{ admin }} />
      </main>
    </div>
  );
}
