<?php
/**
 * POST /api/auth/login.php
 * body: { username, password }
 * يحافظ على محاولات فاشلة محدودة داخل الجلسة (حماية بسيطة من التخمين)
 */
require_once __DIR__ . '/../config.php';
require_method('POST');

// --- حماية بسيطة من محاولات التخمين ---
$now = time();
$_SESSION['login_attempts'] = $_SESSION['login_attempts'] ?? [];
// احتفظ بالمحاولات خلال آخر 5 دقائق فقط
$_SESSION['login_attempts'] = array_filter(
    $_SESSION['login_attempts'],
    fn($t) => $t > $now - 300
);
if (count($_SESSION['login_attempts']) >= 8) {
    json_error('تم إيقاف تسجيل الدخول مؤقتًا بسبب كثرة المحاولات الفاشلة. حاول بعد 5 دقائق.', 429);
}

$data = input_json();
$username = trim((string)($data['username'] ?? ''));
$password = (string)($data['password'] ?? '');

if ($username === '' || $password === '') {
    json_error('أدخل اسم المستخدم وكلمة المرور', 422);
}

$stmt = db()->prepare('SELECT * FROM admins WHERE username = ?');
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    $_SESSION['login_attempts'][] = $now;
    json_error('اسم المستخدم أو كلمة المرور غير صحيحة', 401);
}

// نجاح: امسح سجل المحاولات الفاشلة وجدّد معرّف الجلسة
$_SESSION['login_attempts'] = [];
session_regenerate_id(true);
$_SESSION['admin_id'] = (int)$admin['id'];

json_response([
    'success' => true,
    'admin'   => [
        'id'        => (int)$admin['id'],
        'username'  => $admin['username'],
        'full_name' => $admin['full_name'],
        'role'      => $admin['role'],
    ],
]);
