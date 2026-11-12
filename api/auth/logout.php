<?php
/**
 * POST /api/auth/logout.php
 * تسجيل خروج الأدمن الحالي
 */
require_once __DIR__ . '/../config.php';
require_method('POST');

$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'] ?? '', (bool)$p['secure'], (bool)$p['httponly']);
}
session_destroy();

json_response(['success' => true]);
