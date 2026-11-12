import React, { useEffect, useState } from "react";
import logo from "/assets/images/Logo.png";
import {
  ChevronDown,
  Menu,
  X,
  Home,
  Wallet,
  Store,
  Building,
  Users,
  Phone,
  FileText,
  Shield,
  FolderOpen,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { apiFetch } from "../../api/client";

// الأقسام التي لها روابط ثابتة في القائمة — الباقي يظهر تلقائيًا تحت «الأقسام»
const DEDICATED_ROUTES = {
  general_expenses: "/general_expenses",
  outcome: "/outcome",
  excel: "/excel",
  budget_bulletin: "/budget_bulletin",
  scientific_material: "/scientific_material",
  visual_explanation: "/visual_explanation",
  expenses_programme: "/expenses_programme",
  first_chapter_expenses: "/first_chapter_expenses",
  stores: "/stores",
};
const SHOWN_STATICALLY = new Set(["excel", "outcome", "budget_bulletin", "general_expenses"]);

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // الأقسام القادمة من قاعدة البيانات (تُضاف من لوحة التحكم)
  const [dbCategories, setDbCategories] = useState([]);
  useEffect(() => {
    let mounted = true;
    apiFetch("/api/categories.php")
      .then((data) => {
        if (mounted) setDbCategories(data?.categories ?? []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // الأقسام غير الظاهرة في الروابط الثابتة — تظهر هنا تلقائيًا (بما فيها الأقسام الجديدة)
  const extraCategories = dbCategories.filter((c) => !SHOWN_STATICALLY.has(c.slug));

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // عنصر فيه submenu
  const MenuItem = ({ title, name, icon: Icon, children }) => (
    <div className="w-full">
      <button
        onClick={() => toggleMenu(name)}
        className={`flex items-center p-3 rounded-xl transition-all w-full
        ${sidebarOpen ? "gap-3 justify-between" : "justify-center"}
        text-white hover:bg-blue-600`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} />
          {sidebarOpen && <span>{title}</span>}
        </div>

        {sidebarOpen && (
          <ChevronDown
            size={16}
            className={`transition-transform ${
              openMenu === name ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {openMenu === name && sidebarOpen && (
        <div className="mt-1 space-y-1 pr-6">{children}</div>
      )}
    </div>
  );

  // لينك عادي
  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center p-3 rounded-xl transition-all
        ${sidebarOpen ? "gap-3" : "justify-center"}
        ${
          isActive
            ? "bg-blue-800 text-white"
            : "text-white hover:bg-blue-600"
        }`}
      >
        <Icon size={22} />
        {sidebarOpen && <span>{label}</span>}
      </Link>
    );
  };

  // لينك داخلي
  const SubLink = ({ to, label }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`block p-2 rounded-lg text-sm transition
        ${
          isActive
            ? "bg-blue-800 text-white"
            : "text-white hover:bg-blue-600"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside
      className={`min-h-screen bg-gradient-to-b from-blue-700 to-blue-700 shadow-lg 
      transition-all duration-300 flex flex-col items-center
      ${sidebarOpen ? "w-72 px-3 items-start" : "w-20 py-4 items-center"}`}
    >
      <div className="flex items-center justify-between p-4 w-full  border-b border-blue-400/30">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          {sidebarOpen && (
            <img
              src={logo}
              alt="شعار المنصة"
              className="h-14 w-auto max-w-[180px] object-contain"
            />
          )}
        </Link>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-xl text-white hover:bg-white/15 active:scale-95 transition-all duration-200 shrink-0"
          aria-label={sidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-2 space-y-1 w-full">
        <NavLink to="/" icon={Home} label="الرئيسية" />

        {/* ورد واكسل ظاهر في السايد بار */}
        <NavLink to="/excel" icon={FileText} label="شرح ورد-اكسل" />

        {/* الشؤون المالية */}
        <MenuItem title="الشؤون المالية" name="finance" icon={Wallet}>
          <SubLink to="/budget_bulletin" label="نشرة الميزانية" />
          <SubLink to="/outcome" label="المتحصلات" />
        </MenuItem>

        {/* المصروفات العامة */}
        <MenuItem title="المصروفات العامة" name="expenses" icon={Store}>
          <SubLink to="/general_expenses" label="المصروفات العامة" />
          {/* <SubLink to="/first_chapter_expenses" label="المصروفات باب أول" /> */}
        </MenuItem>

        {/* <MenuItem title="الإدارية" name="admin" icon={Users}>
          <SubLink to="#" label="الموظفين" />
        </MenuItem>  */}

        {/* الأقسام القادمة من قاعدة البيانات */}
        {extraCategories.length > 0 && (
          <MenuItem title="الأقسام" name="sections" icon={FolderOpen}>
            {extraCategories.map((cat) => (
              <SubLink
                key={cat.id}
                to={DEDICATED_ROUTES[cat.slug] ?? `/section/${cat.slug}`}
                label={cat.name}
              />
            ))}
          </MenuItem>
        )}

        <NavLink to="/contact" icon={Phone} label="اتصل بنا" />
      </nav>

      {/* زر لوحة التحكم */}
      <div className={sidebarOpen ? "p-3 w-full" : "p-3"}>
        <Link
          to="/admin"
          title="لوحة التحكم"
          aria-label="دخول لوحة التحكم"
          className={`flex items-center gap-2 justify-center rounded-xl bg-white py-2 font-bold text-blue-700 transition hover:bg-blue-50 ${
            sidebarOpen ? "w-full px-3" : "px-3"
          }`}
        >
          <Shield size={18} />
          {sidebarOpen && <span>لوحة التحكم</span>}
        </Link>
      </div>
    </aside>
  );
}