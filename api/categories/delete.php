<?php
/**
 * POST /api/categories/delete.php   (JSON) — يتطلب تسجيل دخول أدمن
 * body: { id }
 * حذف قسم — ممنوع لو فيه وسائط مرتبطة (احذف أو انقل محتواه أولًا)
 */
require_once __DIR__ . '/../config.php';
require_method('POST');
require_admin();

$data = input_json();
$id   = (int)($data['id'] ?? 0);
if ($id <= 0) {
    json_error('معرّف القسم غير صالح', 422);
}

$stmt = db()->prepare('SELECT * FROM categories WHERE id = ?');
$stmt->execute([$id]);
$category = $stmt->fetch();
if (!$category) {
    json_error('القسم غير موجود', 404);
}

$count = db()->prepare('SELECT COUNT(*) FROM media WHERE category_id = ?');
$count->execute([$id]);
$mediaCount = (int)$count->fetchColumn();

if ($mediaCount > 0) {
    json_error("لا يمكن حذف القسم لأن بداخله {$mediaCount} عنصر (فيديو/PDF). احذف محتواه أولًا أو انقله لقسم آخر.", 422);
}

db()->prepare('DELETE FROM categories WHERE id = ?')->execute([$id]);

json_response(['success' => true, 'message' => 'تم حذف القسم']);
