@echo off
REM ============================================================
REM  تشغيل الباك إند PHP (للتطوير المحلي مع XAMPP)
REM  يقدّم /api و /uploads على http://127.0.0.1:8000
REM  حدود رفع الفيديوهات: 512MB (عدّلها حسب الحاجة)
REM ============================================================
php -S 127.0.0.1:8000 -t "%~dp0" -d upload_max_filesize=512M -d post_max_size=512M -d max_execution_time=900 -d max_input_time=900
