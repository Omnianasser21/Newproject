<?php
/**
 * GET /api/auth/me.php
 * يرجّع بيانات الأدمن الحالي من الجلسة (أو authenticated=false)
 */
require_once __DIR__ . '/../config.php';

$admin = current_admin();
if (!$admin) {
    json_response(['authenticated' => false]);
}

json_response([
    'authenticated' => true,
    'admin'         => [
        'id'        => (int)$admin['id'],
        'username'  => $admin['username'],
        'full_name' => $admin['full_name'],
        'role'      => $admin['role'],
    ],
]);
