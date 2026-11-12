<?php
/**
 * POST /api/admins/update.php   (JSON) — يتطلب تسجيل دخول أدمن
 * body: { id, full_name?, password?, role? }
 *
 * القواعد:
 *   - أي أدمن يقدر يغير اسمه الكامل وكلمة مروره
 *   - تغيير الأدوار (role) أو بيانات أدمن آخر يتطلب super_admin
 */
require_once __DIR__ . '/../config.php';
require_method('POST');
$current = require_admin();

$data = input_json();
$id   = (int)($data['id'] ?? 0);
if ($id <= 0) {
    json_error('معرّف الأدمن غير صالح', 422);
}

$stmt = db()->prepare('SELECT * FROM admins WHERE id = ?');
$stmt->execute([$id]);
$target = $stmt->fetch();
if (!$target) {
    json_error('الأدمن غير موجود', 404);
}

$isSelf = (int)$target['id'] === (int)$current['id'];

$fields = [];
$params = [];

if (array_key_exists('full_name', $data)) {
    $fullName = trim((string)$data['full_name']);
    if ($fullName === '') json_error('الاسم الكامل لا يمكن أن يكون فارغًا', 422);
    if (!$isSelf && $current['role'] !== 'super_admin') {
        json_error('تعديل بيانات أدمن آخر يتطلب صلاحية super_admin', 403);
    }
    $fields[] = 'full_name = ?';
    $params[] = $fullName;
}
if (array_key_exists('password', $data)) {
    $password = (string)$data['password'];
    if ($password !== '') { // كلمة المرور الفارغة = بدون تغيير
        if (mb_strlen($password) < 8) json_error('كلمة المرور يجب ألا تقل عن 8 أحرف', 422);
        if (!$isSelf && $current['role'] !== 'super_admin') {
            json_error('تغيير كلمة مرور أدمن آخر يتطلب صلاحية super_admin', 403);
        }
        $fields[] = 'password_hash = ?';
        $params[] = password_hash($password, PASSWORD_DEFAULT);
    }
}
if (array_key_exists('role', $data)) {
    $role = $data['role'] === 'super_admin' ? 'super_admin' : 'admin';
    if ($current['role'] !== 'super_admin') {
        json_error('تغيير الأدوار يتطلب صلاحية super_admin', 403);
    }
    if ($isSelf && $role !== 'super_admin') {
        json_error('لا يمكنك إزالة صلاحية super_admin عن حسابك أنت', 422);
    }
    $fields[] = 'role = ?';
    $params[] = $role;
}

if (!$fields) {
    json_error('لا توجد بيانات للتحديث', 422);
}

$params[] = $id;
db()->prepare('UPDATE admins SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);

json_response(['success' => true, 'message' => 'تم حفظ التعديلات بنجاح']);
