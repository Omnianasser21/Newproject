@echo off
chcp 65001 >nul
cd /d "%~dp0"
title وزارة الخارجية - الشؤون المالية

echo.
echo   ╔═══════════════════════════════════════╗
echo   ║   وزارة الخارجية - الشؤون المالية   ║
echo   ╚═══════════════════════════════════════╝
echo.

REM === 1) التحقق من MySQL ===
echo   التحقق من قاعدة البيانات...
powershell -command "try { $p = Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if ($p) { exit 0 } else { exit 1 } }"
if errorlevel 1 (
    echo.
    echo   ⚠️  قاعدة البيانات (MySQL) غير شغالة!
    echo   من فضلك افتح XAMPP Control Panel واضغط Start أمام MySQL
    echo   ثم أغلق هذه النافذة وشغّل "ابدأ الموقع" مرة أخرى.
    echo.
    pause
    exit /b 1
)
echo   ✓ قاعدة البيانات شغالة

REM === 2) التأكد من وجود node_modules ===
if not exist node_modules (
    echo   أول مرة — هيتم تحميل ملفات الموقع (ممكن تأخذ دقيقة)...
    npm install
    echo   ✓ تم تحميل الملفات
)

REM === 3) تشغيل الباك إند PHP لو مش شغال ===
echo   تشغيل الخادم...
powershell -command "try { $p = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if (-not $p) { Start-Process -FilePath 'php' -ArgumentList '-S','127.0.0.1:8000','-t','.','-d','upload_max_filesize=512M','-d','post_max_size=512M','-d','max_execution_time=900','-d','max_input_time=900' -WindowStyle Hidden } }"
echo   ✓ الخادم شغال

REM === 4) تشغيل الموقع لو مش شغال ===
echo   تشغيل الموقع...
start "الموقع" cmd /c "npm run dev"

REM === 5) الانتظار حتى يشتغل الموقع ثم فتح المتصفح ===
echo   في انتظار الموقع...
powershell -command ^
  "for ($i=0; $i -lt 60; $i++) { ^
     try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:5174' -TimeoutSec 2; exit 0 } ^
     catch { Start-Sleep -Seconds 1 } ^
   }; exit 1"
if errorlevel 1 (
    echo.
    echo   ⚠️  الموقع اتأخر شوية. جرّب فتح المتصفح يدويًا على:
    echo   http://localhost:5174
    echo.
    pause
    exit /b 1
)

echo   ✓ الموقع جاهز
start "" "http://localhost:5174"
echo.
echo   تم! الموقع هيفتح في المتصفح تلقائيًا.
echo   لإغلاق الموقع: أغلق نافذة "الموقع" السوداء.
echo.
timeout /t 5 >nul
