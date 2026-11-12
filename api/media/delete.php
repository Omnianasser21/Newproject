<?php
/**
 * POST /api/media/delete.php   (JSON) — يتطلب تسجيل دخول أدمن
 * body: { id }
 * حذف نهائي للعنصر + حذف الملف من السيرفر
 */
require_once __DIR__ . '/../config.php';
require_method('POST');
require_admin();

$data = input_json();
$id   = (int)($data['id'] ?? 0);
if ($id <= 0) {
    json_error('معرّف العنصر غير صالح', 422);
}

$stmt = db()->prepare('SELECT id, type, filename FROM media WHERE id = ?');
$stmt->execute([$id]);
$item = $stmt->fetch();
if (!$item) {
    json_error('العنصر غير موجود', 404);
}

db()->prepare('DELETE FROM media WHERE id = ?')->execute([$id]);

$folder = $item['type'] === 'pdf' ? 'pdfs' : 'videos';
$path   = uploads_dir($item['type']) . '/' . $item['filename'];
if (is_file($path)) {
    @unlink($path);
}

json_response(['success' => true, 'message' => 'تم الحذف نهائيًا']);
