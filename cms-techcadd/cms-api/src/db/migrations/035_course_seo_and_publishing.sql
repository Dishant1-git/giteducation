-- The rest of the SEO tab, and publishing with a date on it.
--
-- SEO
-- ---
-- The CMS held a meta title, a description, keywords and a canonical. The page
-- also emits OpenGraph and Twitter cards and three blocks of structured data,
-- all derived and none of them adjustable — so a course whose social card
-- should read differently from its <title>, or which should not be indexed
-- yet, had no way to say so.
--
-- Every field is nullable and every toggle defaults to what the page does
-- today: index, include in the sitemap, emit FAQ schema. A course nobody has
-- opened is unchanged.
ALTER TABLE courses
  ADD COLUMN og_title            VARCHAR(120) NULL,
  ADD COLUMN og_description      VARCHAR(300) NULL,
  ADD COLUMN twitter_title       VARCHAR(120) NULL,
  ADD COLUMN twitter_description VARCHAR(300) NULL,
  ADD COLUMN twitter_image_id    CHAR(36)     NULL,
  -- Defaults chosen so existing behaviour is what an untouched row describes.
  ADD COLUMN robots_index        TINYINT(1)   NOT NULL DEFAULT 1,
  ADD COLUMN in_sitemap          TINYINT(1)   NOT NULL DEFAULT 1,
  -- An empty FAQ block is a structured-data error rather than a neutral
  -- omission, so this only ever suppresses a block that would otherwise emit.
  ADD COLUMN faq_schema          TINYINT(1)   NOT NULL DEFAULT 1;

ALTER TABLE courses
  ADD CONSTRAINT fk_courses_twitter_image FOREIGN KEY (twitter_image_id) REFERENCES media(id) ON DELETE SET NULL;

-- Publishing
-- ----------
-- `status` said draft, review or published and nothing about when. There was
-- no way to write a course now and have it appear on Monday, and no record of
-- who wrote it or who touched it last — which is the first question asked when
-- a page changes and nobody owns up.
ALTER TABLE courses
  MODIFY COLUMN status ENUM('draft','review','scheduled','published') NOT NULL DEFAULT 'draft';

ALTER TABLE courses
  -- When it first went live. Distinct from created_at, which is when the row
  -- appeared, and from updated_at, which moves on every save.
  ADD COLUMN published_at  DATETIME(3) NULL,
  ADD COLUMN scheduled_for DATETIME(3) NULL,
  ADD COLUMN author_id     CHAR(36)    NULL,
  ADD COLUMN edited_by     CHAR(36)    NULL;

ALTER TABLE courses
  ADD CONSTRAINT fk_courses_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_courses_editor FOREIGN KEY (edited_by) REFERENCES users(id) ON DELETE SET NULL;

-- Backfilled so the column means something on day one: a course that is
-- already published has been published since its last save, which is the
-- closest true statement available.
UPDATE courses SET published_at = updated_at WHERE status = 'published' AND published_at IS NULL;

-- The scheduler's index: "anything due yet?" runs on every public read.
CREATE INDEX idx_courses_due ON courses (status, scheduled_for);
