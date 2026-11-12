<?php
/**
 * POST /api/media/update.php   (JSON) — يتطلب تسجيل دخول أدمن
 * body: { id, title?, description?, category?, is_visible?, sort_order? }
 * تحديث بيانات عنصر (العنوان / الوصف / القسم / الإظهار أو الإخفاء / الترتيب)
 */
require_once __DIR__ . '/../config.php';
require_method('POST');
require_admin();

$data = input_json();
$id   = (int)($data['id'] ?? 0);
if ($id <= 0) {
    json_error('معرّف العنصر غير صالح', 422);
}

$stmt = db()->prepare('SELECT * FROM media WHERE id = ?');
$stmt->execute([$id]);
$item = $stmt->fetch();
if (!$item) {
    json_error('العنصر غير موجود', 404);
}

$fields = [];
$params = [];

if (array_key_exists('title', $data)) {
    $title = trim((string)$data['title']);
    if ($title === '') json_error('العنوان لا يمكن أن يكون فارغًا', 422);
    $fields[] = 'title = ?';
    $params[] = $title;
}
if (array_key_exists('description', $data)) {
    $desc = trim((string)$data['description']);
    $fields[] = 'description = ?';
    $params[] = $desc !== '' ? $desc : null;
}
if (array_key_exists('category', $data)) {
    $slug = trim((string)$data['category']);
    $cat  = db()->prepare('SELECT id FROM categories WHERE slug = ?');
    $cat->execute([$slug]);
    $catRow = $cat->fetch();
    if (!$catRow) json_error('القسم المختار غير موجود', 422);
    $fields[] = 'category_id = ?';
    $params[] = (int)$catRow['id'];
}
if (array_key_exists('is_visible', $data)) {
    $fields[] = 'is_visible = ?';
    $params[] = $data['is_visible'] ? 1 : 0;
}
if (array_key_exists('sort_order', $data)) {
    $fields[] = 'sort_order = ?';
    $params[] = (int)$data['sort_order'];
}

if (!$fields) {
    json_error('لا توجد بيانات للتحديث', 422);
}

$params[] = $id;
db()->prepare('UPDATE media SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);

$stmt = db()->prepare(
    'SELECT m.id, m.type, m.title, m.description, m.filename, m.original_name,
            m.file_size, m.is_visible, m.sort_order, m.created_at,
            c.slug AS category_slug, c.name AS category_name
     FROM media m JOIN categories c ON c.id = m.category_id WHERE m.id = ?'
);
$stmt->execute([$id]);
$row = $stmt->fetch();
$folder = $row['type'] === 'pdf' ? 'pdfs' : 'videos';
$row['url']             = '/uploads/' . $folder . '/' . $row['filename'];
$row['file_size_human'] = format_size((int)$row['file_size']);
$row['is_visible']      = (bool)$row['is_visible'];
$row['id']              = (int)$row['id'];

json_response(['success' => true, 'message' => 'تم تحديث البيانات بنجاح', 'media' => $row]);
