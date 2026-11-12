<?php
/**
 * POST /api/admins/add.php   (JSON) — يتطلب تسجيل دخول أدمن
 * body: { username, full_name, password, role? }
 * صلاحية super_admin فقط تقدر تنشئ حساب super_admin
 */
require_once __DIR__ . '/../config.php';
require_method('POST');
$current = require_admin();

$data     = input_json();
$username = trim((string)($data['username'] ?? ''));
$fullName = trim((string)($data['full_name'] ?? ''));
$password = (string)($data['password'] ?? '');
$role     = ($data['role'] ?? 'admin') === 'super_admin' ? 'super_admin' : 'admin';

if ($username === '' || $fullName === '') {
    json_error('أدخل اسم المستخدم والاسم الكامل', 422);
}
if (!preg_match('/^[a-zA-Z0-9_.-]{3,50}$/', $username)) {
    json_error('اسم المستخدم يجب أن يكون من حروف/أرقام إنجليزية فقط (3–50 حرفًا)', 422);
}
if (mb_strlen($password) < 8) {
    json_error('كلمة المرور يجب ألا تقل عن 8 أحرف', 422);
}
if ($role === 'super_admin' && $current['role'] !== 'super_admin') {
    json_error('إنشاء حساب مدير نظام (super_admin) يتطلب أن تكون أنت super_admin', 403);
}

$stmt = db()->prepare('SELECT id FROM admins WHERE username = ?');
$stmt->execute([$username]);
if ($stmt->fetch()) {
    json_error('اسم المستخدم مستخدم بالفعل', 409);
}

$stmt = db()->prepare('INSERT INTO admins (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)');
$stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT), $fullName, $role]);

json_response([
    'success' => true,
    'message' => 'تم إنشاء حساب الأدمن بنجاح',
    'admin'   => [
        'id'        => (int)db()->lastInsertId(),
        'username'  => $username,
        'full_name' => $fullName,
        'role'      => $role,
    ],
], 201);
