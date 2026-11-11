import React from "react";
import { Link } from "react-router-dom";

const logo = "/assets/images/Logo.png";

export default function Footer() {
  const quickLinks = [
    { label: "الصفحة الرئيسية", to: "/" },
    { label: "نشرة الميزانية", to: "/budget_bulletin" },
    { label: "شرح إكسل وورد", to: "/excel" },
    { label: "المصروفات العامة", to: "/general_expenses" },
    { label: "اتصل بنا", to: "/contact" },
  ];

  return (
    <footer dir="rtl" className="mt-auto bg-blue-100 border-t border-blue-100">
      {/* Main Footer */}
      <div className="max-w-screen-xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & Description */}
          <div className="text-right space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 flex items-center justify-center shrink-0">
                <img
                  src={logo}
                  alt="شعار المنصة"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[#173c9c]">
                  منصة التدريب والتطوير
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  نظام تدريبي رقمي متكامل
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-8 max-w-sm">
              قاعدة بيانات الدورات التدريبية للعاملين بوزارة الخارجية والملاحق
              الإداريين بالخارج، لدعم التدريب والتطوير المستمر.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-[#214ed8] text-xs font-bold">
                منصة تدريبية رقمية
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-right space-y-6">
            <FooterTitle title="روابط سريعة" />

            <ul className="space-y-3">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm text-slate-600 bg-white border border-blue-50 hover:border-blue-200 hover:bg-blue-50 hover:text-[#214ed8] hover:translate-x-[-3px] transition-all duration-300"
                  >
                    <span>{label}</span>
                    <span className="text-blue-400 group-hover:text-[#214ed8] transition">
                      ←
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-right space-y-6">
            <FooterTitle title="تواصل معنا" />

            <ul className="space-y-4">
              <ContactItem
                title="العنوان"
                firstLine="القاهرة، جمهورية مصر العربية"
                secondLine="كورنيش النيل، ماسبيرو"
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                }
              />

              <ContactItem
                title="البريد الإلكتروني"
                firstLine="info@mfa.gov.eg"
                ltr
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2-2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
              />

              <ContactItem
                title="الهاتف"
                firstLine="+20 2 2574 9820"
                ltr
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.38 2 2 0 0 1 3.55 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6.29 6.29l.89-.89a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                }
              />
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#173caa]">
        <div className="max-w-screen-xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-blue-100 text-xs text-center">
            جميع الحقوق محفوظة © {new Date().getFullYear()} — منصة التدريب
            والتطوير
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/excel"
              className="text-blue-100 hover:text-white text-xs transition-colors"
            >
              شرح إكسل وورد
            </Link>

            <span className="text-blue-300">|</span>

            <Link
              to="/budget_bulletin"
              className="text-blue-100 hover:text-white text-xs transition-colors"
            >
              نشرة الميزانية
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterTitle({ title }) {
  return (
    <div>
      <h3 className="font-extrabold text-[#173c9c] text-lg">{title}</h3>
      <div className="flex items-center gap-2 mt-3">
        <div className="w-10 h-1 bg-[#214ed8] rounded-full"></div>
        <div className="w-2 h-1 bg-blue-300 rounded-full"></div>
      </div>
    </div>
  );
}

function ContactItem({ title, firstLine, secondLine, icon, ltr = false }) {
  return (
    <li className="flex items-start gap-3 bg-white border border-blue-50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
      <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#214ed8] flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-slate-800 text-sm font-bold mb-1">{title}</p>

        <p
          className="text-slate-500 text-xs leading-6"
          dir={ltr ? "ltr" : "rtl"}
        >
          {firstLine}
        </p>

        {secondLine && (
          <p className="text-slate-400 text-xs leading-6">{secondLine}</p>
        )}
      </div>
    </li>
  );
}
