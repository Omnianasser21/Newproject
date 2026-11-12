<?php
/**
 * POST /api/categories/update.php   (JSON) — يتطلب تسجيل دخول أدمن
 * body: { id, name?, slug?, sort_order? }
 * تعديل بيانات قسم (الاسم / الـ slug / الترتيب) — الوسائط المرتبطة تفضل سليمة
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

$fields = [];
$params = [];

if (array_key_exists('name', $data)) {
    $name = trim((string)$data['name']);
    if ($name === '') json_error('اسم القسم لا يمكن أن يكون فارغًا', 422);
    if (mb_strlen($name) > 150) json_error('اسم القسم طويل جدًا (بحد أقصى 150 حرفًا)', 422);
    $fields[] = 'name = ?';
    $params[] = $name;
}
if (array_key_exists('slug', $data)) {
    $slug = mb_strtolower(trim((string)$data['slug']));
    if (!preg_match('/^[a-z0-9][a-z0-9_-]{1,49}$/', $slug)) {
        json_error('الـ slug يجب أن يكون بحروف إنجليزية صغيرة وأرقام فقط وشرطات', 422);
    }
    $check = db()->prepare('SELECT id FROM categories WHERE slug = ? AND id <> ?');
    $check->execute([$slug, $id]);
    if ($check->fetch()) {
        json_error('يوجد قسم آخر بهذا الـ slug', 409);
    }
    $fields[] = 'slug = ?';
    $params[] = $slug;
}
if (array_key_exists('sort_order', $data)) {
    $fields[] = 'sort_order = ?';
    $params[] = (int)$data['sort_order'];
}

if (!$fields) {
    json_error('لا توجد بيانات للتحديث', 422);
}

$params[] = $id;
db()->prepare('UPDATE categories SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);

$stmt = db()->prepare('SELECT id, slug, name, sort_order FROM categories WHERE id = ?');
$stmt->execute([$id]);
$row = $stmt->fetch();
$row['id'] = (int)$row['id'];

json_response(['success' => true, 'message' => 'تم حفظ التعديلات', 'category' => $row]);
