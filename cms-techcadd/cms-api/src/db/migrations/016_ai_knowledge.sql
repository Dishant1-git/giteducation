CREATE TABLE IF NOT EXISTS ai_knowledge (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  content    LONGTEXT     NOT NULL,
  category   VARCHAR(80)  NOT NULL DEFAULT 'General',
  sort_order INT          NOT NULL DEFAULT 0,
  status     ENUM('published','draft','review') NOT NULL DEFAULT 'draft',
  created_at DATETIME(3)  NOT NULL,
  updated_at DATETIME(3)  NOT NULL,
  KEY idx_ai_knowledge_status (status),
  FULLTEXT KEY ft_ai_knowledge (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
