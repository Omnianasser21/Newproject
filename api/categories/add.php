<?php
/**
 * POST /api/categories/add.php   (JSON) — يتطلب تسجيل دخول أدمن
 * body: { name, slug?, sort_order? }
 * يضيف قسم جديد (يظهر فورًا في قوائم الرفع بالداشبورد وفي الموقع)
 */
require_once __DIR__ . '/../config.php';
require_method('POST');
require_admin();

$data       = input_json();
$name       = trim((string)($data['name'] ?? ''));
$slug       = trim((string)($data['slug'] ?? ''));
$sortOrder  = (int)($data['sort_order'] ?? 0);

if ($name === '') {
    json_error('أدخل اسم القسم', 422);
}
if (mb_strlen($name) > 150) {
    json_error('اسم القسم طويل جدًا (بحد أقصى 150 حرفًا)', 422);
}

// الـ slug اختياري — يُولّد تلقائيًا لو فاضي
if ($slug === '') {
    $slug = 'section_' . bin2hex(random_bytes(4));
}
$slug = mb_strtolower($slug);
if (!preg_match('/^[a-z0-9][a-z0-9_-]{1,49}$/', $slug)) {
    json_error('الـ slug يجب أن يكون بحروف إنجليزية صغيرة وأرقام فقط وشرطات (بدون مسافات)، مثال: training_videos', 422);
}

$stmt = db()->prepare('SELECT id FROM categories WHERE slug = ?');
$stmt->execute([$slug]);
if ($stmt->fetch()) {
    json_error('يوجد قسم بهذا الـ slug بالفعل', 409);
}

$stmt = db()->prepare('INSERT INTO categories (slug, name, sort_order) VALUES (?, ?, ?)');
$stmt->execute([$slug, $name, $sortOrder]);
$id = (int)db()->lastInsertId();

json_response([
    'success' => true,
    'message' => 'تم إضافة القسم بنجاح',
    'category' => [ 'id' => $id, 'slug' => $slug, 'name' => $name, 'sort_order' => $sortOrder ],
], 201);
