import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "اقتراح",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact Form Data:", formData);

    alert("تم إرسال رسالتك بنجاح، شكرًا لتواصلك معنا.");

    setFormData({
      name: "",
      phone: "",
      type: "اقتراح",
      message: "",
    });
  };

  return (
    <main dir="rtl" className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-28 -right-28 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 -left-28 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-70"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold mb-5">
            تواصل معنا
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 mb-5">
            الشكاوى والاقتراحات
          </h1>

          <p className="text-slate-600 leading-9 text-lg max-w-2xl">
            يسعدنا تلقي ملاحظاتكم واقتراحاتكم لتحسين تجربة استخدام منصة التدريب
            والتطوير.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
              <h2 className="text-2xl font-extrabold text-slate-950 mb-4">
                بيانات التواصل
              </h2>

              <p className="text-slate-600 leading-8 mb-6">
                يمكنكم التواصل معنا من خلال رقم الهاتف التالي أو إرسال رسالة من
                خلال النموذج.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
                    <PhoneIcon />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      رقم التواصل
                    </p>
                    <p className="text-lg font-extrabold text-slate-900" dir="ltr">
                      +20 10 22245386
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <MailIcon />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      نوع الخدمة
                    </p>
                    <p className="text-base font-bold text-slate-900">
                      شكاوى ومقترحات المنصة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-700 rounded-3xl p-7 text-white shadow-sm">
              <h3 className="text-xl font-extrabold mb-3">
                ملاحظتك تهمنا
              </h3>

              <p className="text-blue-100 leading-8 text-sm">
                نعمل دائمًا على تطوير المنصة وتحسين المحتوى التدريبي بما يخدم
                العاملين ويجعل الوصول للمعلومات أسهل وأسرع.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-7 lg:p-9">
            <div className="mb-8">
              <p className="text-blue-700 font-bold mb-2">
                نموذج التواصل
              </p>

              <h2 className="text-2xl font-extrabold text-slate-950">
                أرسل شكوى أو اقتراح
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    الاسم
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="اكتب الاسم"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="اكتب رقم الهاتف"
                    dir="ltr"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  نوع الرسالة
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                >
                  <option value="اقتراح">اقتراح</option>
                  <option value="شكوى">شكوى</option>
                  <option value="استفسار">استفسار</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  الرسالة
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="اكتب رسالتك هنا..."
                  required
                  rows="7"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none resize-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <p className="text-sm text-slate-500">
                  سيتم مراجعة الرسالة والرد عليها في أقرب وقت ممكن.
                </p>

                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-2xl font-extrabold shadow-md transition"
                >
                  إرسال الرسالة
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.38 2 2 0 0 1 3.55 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6.29 6.29l.89-.89a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}