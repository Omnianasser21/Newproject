<?php
/**
 * POST /api/media/upload.php   (multipart/form-data) — يتطلب تسجيل دخول أدمن
 *
 * الحقول:
 *   file          الملف (فيديو أو PDF)   [مطلوب]
 *   title         العنوان                 [مطلوب]
 *   description   الوصف                   [اختياري]
 *   category      slug القسم              [مطلوب]
 *   type          video | pdf             [مطلوب]
 *
 * ملاحظة: تقدّم الرفع يتم تتبعه من المتصفح عبر XMLHttpRequest
 * (upload.onprogress) — راجع src/api/client.js
 */
require_once __DIR__ . '/../config.php';
require_method('POST');
require_admin();

// ---- إن لم يصل الملف بسبب تجاوز حدود php.ini ----
if (empty($_FILES) && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    $limit = ini_get('post_max_size');
    json_error("الملف أكبر من الحد الأقصى المسموح به في إعدادات PHP (post_max_size = {$limit}). راجع README.md لضبط الحدود.", 413);
}

if (empty($_FILES['file'])) {
    json_error('لم يتم استلام أي ملف', 422);
}

$file = $_FILES['file'];

// ---- أخطاء الرفع من PHP نفسه ----
switch ($file['error']) {
    case UPLOAD_ERR_OK:
        break;
    case UPLOAD_ERR_INI_SIZE:
    case UPLOAD_ERR_FORM_SIZE:
        json_error('الملف أكبر من الحد الأقصى المسموح به على السيرفر. راجع README.md لضبط upload_max_filesize في php.ini', 413);
    case UPLOAD_ERR_PARTIAL:
        json_error('انقطع الرفع أثناء نقل الملف — حاول مرة أخرى', 400);
    case UPLOAD_ERR_NO_FILE:
        json_error('لم يتم استلام أي ملف', 422);
    default:
        json_error('فشل رفع الملف (رمز الخطأ: ' . (int)$file['error'] . ')', 400);
}

$title       = trim((string)($_POST['title'] ?? ''));
$description = trim((string)($_POST['description'] ?? ''));
$category    = trim((string)($_POST['category'] ?? ''));
$type        = trim((string)($_POST['type'] ?? ''));

if ($title === '') {
    json_error('أدخل عنوان الفيديو/الملف', 422);
}
if (!in_array($type, ['video', 'pdf'], true)) {
    json_error('نوع الوسائط غير صالح', 422);
}

// ---- التحقق من القسم ----
$stmt = db()->prepare('SELECT id FROM categories WHERE slug = ?');
$stmt->execute([$category]);
$categoryRow = $stmt->fetch();
if (!$categoryRow) {
    json_error('القسم المختار غير موجود', 422);
}

// ---- الامتدادات المسموحة ----
$allowed = [
    'video' => ['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v'],
    'pdf'   => ['pdf'],
];
$ext = strtolower(pathinfo((string)$file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowed[$type], true)) {
    json_error('امتداد الملف غير مسموح به. المسموح: ' . implode(', ', $allowed[$type]), 422);
}

$tmpPath = $file['tmp_name'];
$size    = (int)$file['size'];
if ($size <= 0) {
    json_error('الملف فارغ', 422);
}

// ---- فحص محتوى الملف ----
if ($type === 'pdf') {
    $head = file_get_contents($tmpPath, false, null, 0, 5);
    if ($head !== '%PDF-') {
        json_error('الملف المرفوع ليس PDF صالحًا', 422);
    }
} else {
    // mp4/mov/m4v تحتوي "ftyp" عند الإزاحة 4 ، وباقي الصيغ نفحص أن الملف ليس ملف PHP مقنّع
    $head = file_get_contents($tmpPath, false, null, 0, 64);
    if ($head === false || stripos($head, '<?php') !== false) {
        json_error('محتوى الملف غير صالح', 422);
    }
}

// ---- حفظ الملف باسم آمن وفريد ----
$dir = uploads_dir($type);
if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
    json_error('تعذر إنشاء مجلد الرفع على السيرفر', 500);
}
$filename = bin2hex(random_bytes(16)) . '.' . $ext;
$dest     = $dir . '/' . $filename;

if (!move_uploaded_file($tmpPath, $dest)) {
    json_error('تعذر حفظ الملف على السيرفر', 500);
}
@chmod($dest, 0644);

// ---- إدخال السجل في قاعدة البيانات ----
try {
    $stmt = db()->prepare(
        'INSERT INTO media (category_id, type, title, description, filename, original_name, file_size, is_visible)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)'
    );
    $stmt->execute([
        (int)$categoryRow['id'],
        $type,
        $title,
        $description !== '' ? $description : null,
        $filename,
        (string)$file['name'],
        $size,
    ]);
    $id = (int)db()->lastInsertId();
} catch (Throwable $e) {
    @unlink($dest); // تراجع عن حفظ الملف إذا فشلت قاعدة البيانات
    json_error('تعذر حفظ بيانات الملف في قاعدة البيانات', 500);
}

$folder = $type === 'pdf' ? 'pdfs' : 'videos';
json_response([
    'success' => true,
    'message' => 'تم رفع الملف بنجاح',
    'media'   => [
        'id'              => $id,
        'type'            => $type,
        'title'           => $title,
        'description'     => $description !== '' ? $description : null,
        'filename'        => $filename,
        'original_name'   => (string)$file['name'],
        'file_size'       => $size,
        'file_size_human' => format_size($size),
        'url'             => '/uploads/' . $folder . '/' . $filename,
        'category'        => $category,
        'is_visible'      => true,
    ],
], 201);
