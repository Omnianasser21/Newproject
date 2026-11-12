<?php
/**
 * POST /api/admins/delete.php   (JSON) — يتطلب تسجيل دخول أدمن
 * body: { id }
 *
 * القواعد:
 *   - لا يمكن حذف حسابك الحالي
 *   - حذف حساب super_admin يتطلب أن تكون أنت super_admin
 *   - لا يمكن حذف آخر super_admin في النظام
 */
require_once __DIR__ . '/../config.php';
require_method('POST');
$current = require_admin();

$data = input_json();
$id   = (int)($data['id'] ?? 0);
if ($id <= 0) {
    json_error('معرّف الأدمن غير صالح', 422);
}
if ($id === (int)$current['id']) {
    json_error('لا يمكنك حذف حسابك الحالي — اطلب من super_admin آخر', 422);
}

$stmt = db()->prepare('SELECT * FROM admins WHERE id = ?');
$stmt->execute([$id]);
$target = $stmt->fetch();
if (!$target) {
    json_error('الأدمن غير موجود', 404);
}
if ($target['role'] === 'super_admin') {
    if ($current['role'] !== 'super_admin') {
        json_error('حذف حساب super_admin يتطلب صلاحية super_admin', 403);
    }
    $count = (int)db()->query("SELECT COUNT(*) FROM admins WHERE role = 'super_admin'")->fetchColumn();
    if ($count <= 1) {
        json_error('لا يمكن حذف آخر مدير نظام (super_admin) في النظام', 422);
    }
}

db()->prepare('DELETE FROM admins WHERE id = ?')->execute([$id]);

json_response(['success' => true, 'message' => 'تم حذف الأدمن بنجاح']);
