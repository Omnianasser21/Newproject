import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, User, Eye, EyeOff, LogIn, ShieldCheck, AlertCircle } from "lucide-react";
import { apiFetch } from "../api/client";
import logo from "/assets/images/Logo.png";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/auth/login.php", {
        method: "POST",
        body: { username: username.trim(), password },
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "تعذر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex font-sans">
      {/* الجانب التسويقي */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 items-center justify-center">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute bottom-[-6rem] left-[-6rem] h-96 w-96 rounded-full bg-blue-500/10" />
        <div className="absolute top-1/3 left-1/4 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative z-10 text-center px-12">
          <img
            src={logo}
            alt="شعار الوزارة"
            className="h-28 w-auto mx-auto mb-8 drop-shadow-2xl"
          />
          <h1 className="text-4xl font-black text-white leading-snug">
            لوحة تحكم الوزارة
          </h1>
          <p className="mt-4 text-lg text-blue-100/90 leading-8">
            إدارة الفيديوهات والملفات العلمية (PDF)
            <br />
            للشؤون المالية — وزارة الخارجية
          </p>

          <div className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 backdrop-blur">
            <ShieldCheck className="text-emerald-400" size={28} />
            <span className="text-sm font-semibold text-blue-100">
              منطقة محمية — للأدمنز المصرّح لهم فقط
            </span>
          </div>
        </div>
      </div>

      {/* نموذج الدخول */}
      <div className="flex-1 flex items-center justify-center bg-[#f4f7fb] px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <img src={logo} alt="شعار الوزارة" className="h-20 w-auto mx-auto" />
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/30">
                <Lock size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">تسجيل الدخول</h2>
                <p className="text-sm text-slate-500">أدخل بيانات حساب الأدمن الخاص بك</p>
              </div>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-bold text-slate-700">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <User
                    size={20}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    dir="auto"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="مثال: admin"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-12 pl-4 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-700">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-12 pl-14 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 py-4 text-lg font-black text-white shadow-lg shadow-blue-700/30 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <LogIn size={22} />
                )}
                {loading ? "جارٍ تسجيل الدخول..." : "دخول"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              هذه الصفحة مخصصة للأدمنز فقط — أي محاولة دخول غير مصرّح بها تُسجّل
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            وزارة الخارجية — الإدارة العامة للشؤون المالية © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
