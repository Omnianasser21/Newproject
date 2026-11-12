import React, { useRef, useState } from "react";
import logo from "../../../public/assets/images/Logo.png";

export default function Home() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;
    const videoDuration = videoRef.current.duration || 1;

    setProgress((current / videoDuration) * 100);
    setCurrentTime(formatTime(current));
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  const stats = [
    {
      number: "٣",
      label: "قطاعات تدريبية",
    },
    {
      number: "٢٤",
      label: "دورة تدريبية",
    },
    {
      number: "∞",
      label: "إتاحة مستمرة",
    },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-white text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        {/* Soft Background Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-28 -right-28 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 -left-28 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-70"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-10">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-36 h-36 flex items-center justify-center shrink-0">
                <img
                  src={logo}
                  alt="شعار المنصة"
                  className="w-full h-full object-contain"
                />
              </div>
              <div></div>
            </div>

            <div className="text-right sm:text-left">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold">
                نظام تدريبي رقمي متكامل
              </span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold mb-6">
                قاعدة بيانات الدورات التدريبية
              </span>

              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 leading-tight mb-6">
                منصة رسمية لتطوير مهارات العاملين ورفع كفاءة التدريب
              </h1>

              <p className="text-slate-600 leading-9 text-lg mb-8 max-w-xl">
                منصة إلكترونية تجمع المذكرات العلمية والمحاضرات المرئية والبرامج
                التدريبية الخاصة بالقطاعات المالية والإدارية والقنصلية، لدعم
                العاملين داخل وخارج الدولة.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-7 py-3 rounded-xl font-bold shadow-md transition">
                  استكشف الدورات
                </button>

                <button
                  onClick={togglePlay}
                  className="bg-white hover:bg-slate-50 text-slate-800 px-7 py-3 rounded-xl font-bold border border-slate-300 transition"
                >
                  مشاهدة التعريف
                </button>
              </div>
            </div>

            {/* Video Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xl">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                >
                  <source src="/assets/video/intro.mp4" type="video/mp4" />
                  المتصفح الخاص بك لا يدعم تشغيل الفيديو.
                </video>

                {!playing && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/25"
                    aria-label="تشغيل الفيديو"
                  >
                    <div className="w-20 h-20 rounded-full bg-white hover:bg-blue-50 text-blue-700 flex items-center justify-center text-3xl shadow-xl transition">
                      ▶
                    </div>
                  </button>
                )}
              </div>

              {/* Custom Controls */}
              <div className="pt-4">
                <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                  <span>{currentTime}</span>
                  <span>{duration}</span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-700 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <button
                    onClick={togglePlay}
                    className="text-white bg-blue-700 hover:bg-blue-800 px-5 py-2 rounded-xl font-semibold transition"
                  >
                    {playing ? "إيقاف مؤقت" : "تشغيل الفيديو"}
                  </button>

                  <p className="text-slate-500 text-sm">فيديو تعريفي بالمنصة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-14 bg-white">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* About Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="mb-6">
              <p className="text-blue-700 font-bold mb-2">نبذة عن المنصة</p>
              <h2 className="text-2xl font-extrabold text-slate-950">
                منظومة تعليمية لدعم التدريب المستمر
              </h2>
            </div>

            <div className="space-y-5 text-slate-600 leading-9">
              <p>
                تشتمل قاعدة بيانات الدورات التدريبية على جميع المذكرات العلمية
                في مختلف القطاعات، بما يتيح للمتدربين الوصول إلى المحتوى
                التدريبي بسهولة وتنظيم.
              </p>

              <p>
                تشمل المنصة مواد تدريبية خاصة بقطاعات الشئون المالية، والإدارية،
                والقنصلية، بالإضافة إلى محاضرات مرئية وبرامج تدريبية محدثة.
              </p>

              <p>
                تهدف المنصة إلى رفع كفاءة العاملين وتوفير تجربة تعليمية رقمية
                مرنة تدعم التعلم الذاتي والتطوير المهني المستمر.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-5">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <p className="text-4xl font-extrabold text-blue-700 mb-2">
                  {item.number}
                </p>
                <p className="text-slate-500 font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-14">
        <div className="bg-white rounded-3xl p-8 lg:p-10 overflow-hidden relative border border-slate-200 shadow-sm">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-80"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-blue-700 font-bold mb-2">الأقسام التدريبية</p>

              <h3 className="text-2xl font-extrabold text-slate-950 mb-3">
                ابدأ رحلتك التعليمية الآن
              </h3>

              <p className="text-slate-600 leading-8 max-w-2xl">
                يمكنك استكشاف الدورات والمذكرات والمحاضرات المرئية المتاحة حسب
                القطاع التدريبي المناسب.
              </p>
            </div>

            <button className="bg-blue-700 text-white hover:bg-blue-800 px-8 py-4 rounded-2xl font-extrabold transition shadow-md">
              الانتقال إلى الدورات
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}