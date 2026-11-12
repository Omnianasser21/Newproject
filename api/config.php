<?php
/**
 * إعدادات الاتصال بقاعدة البيانات + دوال مساعدة مشتركة.
 *
 * غيّر القيم دي حسب بيئة التشغيل (أو استخدم متغيرات البيئة DB_HOST / DB_NAME / DB_USER / DB_PASS):
 *   - XAMPP الافتراضي: المضيف 127.0.0.1 ، المستخدم root ، بدون كلمة مرور
 */

// ملاحظة: أسماء المتغيرات ببادئة MINISTRY_ عشان ما تتعارضش مع أي مشروع آخر على نفس الجهاز
define('DB_HOST', getenv('MINISTRY_DB_HOST') ?: '127.0.0.1');
define('DB_NAME', getenv('MINISTRY_DB_NAME') ?: 'ministry_media');
define('DB_USER', getenv('MINISTRY_DB_USER') ?: 'root');
define('DB_PASS', getenv('MINISTRY_DB_PASS') !== false ? getenv('MINISTRY_DB_PASS') : '');

// لا تطبع أي تحذيرات/أخطاء داخل مخرجات JSON
ini_set('display_errors', '0');
error_reporting(E_ALL);

// عمر الجلسة 8 ساعات (كوكي + ملفات على السيرفر)
ini_set('session.gc_maxlifetime', (string)(60 * 60 * 8));
ini_set('session.cookie_lifetime', (string)(60 * 60 * 8));

// الجلسات (نفس النطاق في التطوير عبر Vite proxy) — غير مطلوبة في CLI
if (session_status() === PHP_SESSION_NONE && PHP_SAPI !== 'cli' && !headers_sent()) {
    session_set_cookie_params([
        'lifetime' => 60 * 60 * 8, // 8 ساعات
        'path'     => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        // 'secure' => true, // فعّلها عند استخدام HTTPS
    ]);
    session_start();
}

/** @return PDO */
function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

/** إرسال استجابة JSON وإنهاء الطلب */
function json_response($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/** إرسال خطأ JSON وإنهاء الطلب */
function json_error(string $message, int $status = 400): void {
    json_response(['success' => false, 'error' => $message], $status);
}

/** قراءة جسم الطلب كـ JSON */
function input_json(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/** الأدمن الحالي من الجلسة (أو null) */
function current_admin(): ?array {
    if (empty($_SESSION['admin_id'])) return null;
    static $admin = null;
    if ($admin === null) {
        $stmt = db()->prepare('SELECT id, username, full_name, role, created_at FROM admins WHERE id = ?');
        $stmt->execute([$_SESSION['admin_id']]);
        $admin = $stmt->fetch() ?: false;
        if ($admin === false) {
            $admin = null;
            unset($_SESSION['admin_id']);
        }
    }
    return $admin;
}

/** يتطلب تسجيل دخول أدمن — وإلا 401 */
function require_admin(): array {
    $admin = current_admin();
    if (!$admin) {
        json_error('غير مصرح لك، سجّل الدخول أولًا', 401);
    }
    return $admin;
}

/** يتطلب صلاحية super_admin — وإلا 403 */
function require_super_admin(): array {
    $admin = require_admin();
    if ($admin['role'] !== 'super_admin') {
        json_error('هذه العملية تتطلب صلاحية مدير النظام (super_admin)', 403);
    }
    return $admin;
}

/** التأكد أن الطلب بنفس النطاق / طريقة POST عند الحاجة */
function require_method(string $method): void {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== $method) {
        json_error('طريقة الطلب غير مسموحة', 405);
    }
}

/** مسار مجلد الرفع بالنسبة لجذر المشروع */
function uploads_dir(string $type): string {
    $base = dirname(__DIR__) . '/uploads';
    return $base . '/' . ($type === 'pdf' ? 'pdfs' : 'videos');
}

/** تحويل حجم الملف بالبايت لصيغة مقروءة */
function format_size(int|float $bytes): string {
    $units = ['B', 'KB', 'MB', 'GB'];
    $i = 0;
    while ($bytes >= 1024 && $i < count($units) - 1) {
        $bytes /= 1024;
        $i++;
    }
    return round($bytes, 1) . ' ' . $units[$i];
}
