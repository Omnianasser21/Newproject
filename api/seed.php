<?php
/**
 * تشغيل من سطر الأوامر فقط:
 *   php api/seed.php
 *
 * بيعمل:
 *   1) تنفيذ database/schema.sql (ينشئ القاعدة والجداول والأقسام والأدمن الافتراضي)
 *   2) التأكد إن مجلدات الرفع موجودة
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('Run from CLI only');
}

require_once __DIR__ . '/config.php';

$schemaPath = dirname(__DIR__) . '/database/schema.sql';
$sql = file_get_contents($schemaPath);
if ($sql === false) {
    fwrite(STDERR, "تعذر قراءة ملف schema.sql\n");
    exit(1);
}

// احذف الأسطر التي تبدأ بـ -- (تعليقات) ثم قسّم على الفواصل المنقوطة
$lines = preg_split('/\r?\n/', $sql);
$lines = array_filter($lines, fn($l) => !preg_match('/^\s*--/', $l));
$sql   = implode("\n", $lines);

$dsn = 'mysql:host=' . DB_HOST . ';charset=utf8mb4';
$pdo = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

foreach (explode(';', $sql) as $statement) {
    $statement = trim($statement);
    if ($statement !== '') {
        $pdo->exec($statement);
    }
}

foreach (['videos', 'pdfs'] as $sub) {
    $dir = dirname(__DIR__) . '/uploads/' . $sub;
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

echo "تم إعداد قاعدة البيانات والأقسام ومجلدات الرفع بنجاح.\n";
echo "الدخول الافتراضي:  admin / admin123   (غيّر كلمة المرور فورًا)\n";
