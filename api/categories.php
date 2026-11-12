<?php
/**
 * GET /api/categories.php
 * يرجّع كل الأقسام مرتبة حسب sort_order
 */
require_once __DIR__ . '/config.php';

$rows = db()->query('SELECT id, slug, name, sort_order FROM categories ORDER BY sort_order, id')->fetchAll();
json_response(['success' => true, 'categories' => $rows]);
