<?php
/**
 * GET /api/admins/list.php — يتطلب تسجيل دخول أدمن
 * يرجّع كل الأدمنز (بدون كلمات المرور)
 */
require_once __DIR__ . '/../config.php';
require_method('GET');
require_admin();

$rows = db()->query('SELECT id, username, full_name, role, created_at FROM admins ORDER BY id')->fetchAll();
foreach ($rows as &$r) { $r['id'] = (int)$r['id']; }
unset($r);

json_response(['success' => true, 'admins' => $rows]);
