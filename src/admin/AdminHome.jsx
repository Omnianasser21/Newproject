import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Video,
  FileText,
  Users,
  ChevronLeft,
  Loader2,
  UploadCloud,
  FolderOpen,
} from "lucide-react";
import { apiFetch } from "../api/client";

export default function AdminHome() {
  const { admin } = useOutletContext();
  const [stats, setStats] = useState({ videos: null, pdfs: null, admins: null, categories: null });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [videos, pdfs, admins, categories] = await Promise.all([
          apiFetch("/api/media/list.php?type=video&all=1"),
          apiFetch("/api/media/list.php?type=pdf&all=1"),
          apiFetch("/api/admins/list.php"),
          apiFetch("/api/categories.php"),
        ]);
        if (!mounted) return;
        setStats({
          videos: videos.media?.length ?? 0,
          pdfs: pdfs.media?.length ?? 0,
          admins: admins.admins?.length ?? 0,
          categories: categories.categories?.length ?? 0,
        });
      } catch {
        if (mounted) setStats({ videos: 0, pdfs: 0, admins: 0, categories: 0 });
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const cards = [
    {
      to: "/admin/videos",
      icon: Video,
      label: "الفيديوهات",
      value: stats.videos,
      color: "bg-blue-700",
      hint: "رفع وتعديل وإخفاء وحذف الفيديوهات",
    },
    {
      to: "/admin/pdfs",
      icon: FileText,
      label: "ملفات PDF",
      value: stats.pdfs,
      color: "bg-red-600",
      hint: "نشرة الموازنة والمواد العلمية",
    },
    {
      to: "/admin/categories",
      icon: FolderOpen,
      label: "الأقسام",
      value: stats.categories,
      color: "bg-indigo-700",
      hint: "إضافة وتعديل وحذف أقسام الموقع",
    },
    {
      to: "/admin/admins",
      icon: Users,
      label: "الأدمنز",
      value: stats.admins,
      color: "bg-emerald-600",
      hint: "إضافة وإدارة حسابات الأدمنز",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      {/* ترحيب */}
      <div className="overflow-hidden rounded-[28px] bg-gradient-to-l from-slate-900 via-blue-800 to-blue-600 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold text-blue-200">مرحبًا بعودتك،</p>
        <h1 className="mt-1 text-3xl font-black">{admin.full_name}</h1>
        <p className="mt-3 max-w-2xl leading-8 text-blue-100/90">
          من هنا تقدر تضيف فيديوهات وملفات PDF جديدة على الموقع، تعدّل بياناتها،
          تخفيها مؤقتًا أو تمسحها، وكمان تقدر تضيف أدمنز تانيين يساعدوك في الإدارة.
        </p>
        <Link
          to="/admin/videos"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-blue-800 shadow transition hover:bg-blue-50"
        >
          <UploadCloud size={20} />
          ارفع فيديو جديد
        </Link>
      </div>

      {/* كروت الإحصائيات */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${card.color}`}>
                <card.icon size={26} />
              </div>
              {card.value === null ? (
                <Loader2 size={22} className="animate-spin text-slate-300" />
              ) : (
                <span className="text-4xl font-black tabular-nums text-slate-800">{card.value}</span>
              )}
            </div>
            <p className="mt-4 flex items-center justify-between font-black text-slate-800">
              {card.label}
              <ChevronLeft size={18} className="text-slate-300 transition group-hover:-translate-x-1 group-hover:text-blue-600" />
            </p>
            <p className="mt-1 text-xs leading-6 text-slate-500">{card.hint}</p>
          </Link>
        ))}
      </div>

      {/* تعليمات سريعة */}
      <div className="mt-6 rounded-[24px] border border-blue-100 bg-blue-50/60 p-6">
        <h2 className="font-black text-blue-900">ملاحظات مهمة</h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm leading-7 text-blue-900/80">
          <li>الفيديوهات المرفوعة تظهر فورًا في القسم المحدد داخل الموقع.</li>
          <li>زر «العين» يخفي العنصر مؤقتًا بدون حذفه، وزر سلة المهملات يحذفه نهائيًا.</li>
          <li>أول دخول بـ admin / admin123 — غيّر كلمة المرور من صفحة الأدمنز فورًا.</li>
        </ul>
      </div>
    </div>
  );
}
