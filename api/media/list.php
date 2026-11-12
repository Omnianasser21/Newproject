<?php
/**
 * GET /api/media/list.php?category=general_expenses&type=video&all=1
 *
 * بدون all=1  → يرجّع العناصر الظاهرة فقط (is_visible = 1)   — للاستخدام العام في الموقع
 * مع    all=1 → يرجّع كل العناصر (ويتطلب تسجيل دخول أدمن)    — للوحة التحكم
 */
require_once __DIR__ . '/../config.php';

$categorySlug = isset($_GET['category']) ? trim((string)$_GET['category']) : null;
$type         = isset($_GET['type']) ? trim((string)$_GET['type']) : null;
$all          = isset($_GET['all']) && $_GET['all'] === '1';

if ($type !== null && !in_array($type, ['video', 'pdf'], true)) {
    json_error('نوع الوسائط غير صالح', 422);
}

$where  = [];
$params = [];

if ($all) {
    require_admin(); // عرض المخفي يتطلب صلاحيات أدمن
} else {
    $where[] = 'm.is_visible = 1';
}
if ($categorySlug) {
    $where[]  = 'c.slug = ?';
    $params[] = $categorySlug;
}
if ($type) {
    $where[]  = 'm.type = ?';
    $params[] = $type;
}

$sql = 'SELECT m.id, m.type, m.title, m.description, m.filename, m.original_name,
               m.file_size, m.is_visible, m.sort_order, m.created_at,
               c.slug AS category_slug, c.name AS category_name
        FROM media m
        JOIN categories c ON c.id = m.category_id';
if ($where) {
    $sql .= ' WHERE ' . implode(' AND ', $where);
}
$sql .= ' ORDER BY m.sort_order, m.id DESC';

$stmt = db()->prepare($sql);
$stmt->execute($params);
$media = $stmt->fetchAll();

foreach ($media as &$item) {
    $folder = $item['type'] === 'pdf' ? 'pdfs' : 'videos';
    $item['url']              = '/uploads/' . $folder . '/' . $item['filename'];
    $item['file_size']        = (int)$item['file_size'];
    $item['file_size_human']  = format_size($item['file_size']);
    $item['is_visible']       = (bool)$item['is_visible'];
    $item['id']               = (int)$item['id'];
}
unset($item);

json_response(['success' => true, 'media' => $media]);
