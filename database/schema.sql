-- ============================================================
-- قاعدة بيانات منصة وزارة الخارجية - الشؤون المالية
-- الجدول: الأدمنز، الأقسام، الوســائط (فيديو / PDF)
-- ============================================================

CREATE DATABASE IF NOT EXISTS ministry_media
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ministry_media;

-- ------------------------------------------------------------
-- جدول الأقسام (نفس أقسام الموقع الحالي)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  name       VARCHAR(150) NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- جدول الأدمنز
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  role          ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- جدول الوسائط (فيديوهات + ملفات PDF)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  category_id   INT          NOT NULL,
  type          ENUM('video', 'pdf') NOT NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT         NULL,
  filename      VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NULL,
  file_size     BIGINT       NOT NULL DEFAULT 0,
  is_visible    TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order    INT          NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_media_category_type (category_id, type, is_visible),
  CONSTRAINT fk_media_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- زرع الأقسام
-- ------------------------------------------------------------
INSERT INTO categories (slug, name, sort_order) VALUES
  ('general_expenses',      'المصروفات العامة',        10),
  ('outcome',               'المتحصلات',               20),
  ('excel',                 'شرح مايكروسوفت Excel',    30),
  ('budget_bulletin',       'نشرة الموازنة',           40),
  ('scientific_material',   'المادة العلمية',          50),
  ('visual_explanation',    'التوضيح المرئي',          60),
  ('expenses_programme',    'برنامج المصروفات',        70),
  ('first_chapter_expenses','المصروفات باب أول',       80),
  ('stores',                'المخازن',                 90)
ON DUPLICATE KEY UPDATE name = VALUES(name), sort_order = VALUES(sort_order);

-- ------------------------------------------------------------
-- أدمن افتراضي (غيّر كلمة المرور فورًا بعد أول دخول)
--   username: admin   |   password: admin123
-- ------------------------------------------------------------
INSERT INTO admins (username, password_hash, full_name, role)
SELECT 'admin', '$2y$10$Xyg/p2cb7QPZNMUXjV92LewHfPFxzkDHPhB.FEMYoqGrMM/moS.7O', 'مدير النظام', 'super_admin'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');
