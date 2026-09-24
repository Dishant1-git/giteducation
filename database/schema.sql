-- GIT Education — form submissions
--
-- Run this once in MySQL Workbench (File > Open SQL Script, then the lightning
-- bolt "Execute" button). It creates the database and the single table that
-- every form on the website writes to.
--
-- `form_type` tells the forms apart, e.g. 'book-demo' for the Book Free Demo
-- popup. New forms reuse this table with their own form_type.

CREATE DATABASE IF NOT EXISTS giteducation
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE giteducation;

CREATE TABLE IF NOT EXISTS form_submissions (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_type    VARCHAR(50)  NOT NULL,                 -- which form: 'book-demo', ...
  course       VARCHAR(150) NULL,                     -- course chosen in the dropdown
  name         VARCHAR(120) NOT NULL,
  phone        VARCHAR(15)  NOT NULL,
  email        VARCHAR(190) NULL,
  message      TEXT         NULL,
  page_url     VARCHAR(500) NULL,                     -- page the form was sent from
  user_agent   VARCHAR(500) NULL,
  ip_address   VARCHAR(45)  NULL,
  status       ENUM('new', 'contacted', 'enrolled', 'closed') NOT NULL DEFAULT 'new',
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_form_type (form_type),
  KEY idx_course (course),
  KEY idx_created_at (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Handy queries
-- Latest submissions:        SELECT * FROM form_submissions ORDER BY created_at DESC;
-- Book-demo leads per course: SELECT course, COUNT(*) FROM form_submissions WHERE form_type = 'book-demo' GROUP BY course;
-- Mark a lead contacted:     UPDATE form_submissions SET status = 'contacted' WHERE id = 1;
