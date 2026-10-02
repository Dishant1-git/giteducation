-- Ownership on the record itself.
--
-- The same two columns on every content table rather than a name per module,
-- so the recorder can set them by table name without a lookup table of
-- exceptions — and so "who last touched this" is the same question everywhere.
--
-- Nullable, because every row that already exists predates the tracking and
-- claiming otherwise would be inventing history. The edit screen shows
-- "unknown" for those, which is true.
--
-- ON DELETE SET NULL: removing a person must not remove their content.

ALTER TABLE blogs
  ADD COLUMN created_by CHAR(36) NULL,
  ADD COLUMN updated_by CHAR(36) NULL;

ALTER TABLE blogs
  ADD CONSTRAINT fk_blogs_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_blogs_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE faqs
  ADD COLUMN created_by CHAR(36) NULL,
  ADD COLUMN updated_by CHAR(36) NULL;

ALTER TABLE faqs
  ADD CONSTRAINT fk_faqs_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_faqs_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE reviews
  ADD COLUMN created_by CHAR(36) NULL,
  ADD COLUMN updated_by CHAR(36) NULL;

ALTER TABLE reviews
  ADD CONSTRAINT fk_reviews_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_reviews_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE pages
  ADD COLUMN created_by CHAR(36) NULL,
  ADD COLUMN updated_by CHAR(36) NULL;

ALTER TABLE pages
  ADD CONSTRAINT fk_pages_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_pages_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE testimonials
  ADD COLUMN created_by CHAR(36) NULL,
  ADD COLUMN updated_by CHAR(36) NULL;

ALTER TABLE testimonials
  ADD CONSTRAINT fk_testimonials_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_testimonials_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE gallery_albums
  ADD COLUMN created_by CHAR(36) NULL,
  ADD COLUMN updated_by CHAR(36) NULL;

ALTER TABLE gallery_albums
  ADD CONSTRAINT fk_gallery_albums_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_gallery_albums_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE categories
  ADD COLUMN created_by CHAR(36) NULL,
  ADD COLUMN updated_by CHAR(36) NULL;

ALTER TABLE categories
  ADD CONSTRAINT fk_categories_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_categories_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE media
  ADD COLUMN created_by CHAR(36) NULL,
  ADD COLUMN updated_by CHAR(36) NULL;

ALTER TABLE media
  ADD CONSTRAINT fk_media_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_media_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE redirects
  ADD COLUMN created_by CHAR(36) NULL,
  ADD COLUMN updated_by CHAR(36) NULL;

ALTER TABLE redirects
  ADD CONSTRAINT fk_redirects_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_redirects_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE courses
  ADD COLUMN created_by CHAR(36) NULL,
  ADD COLUMN updated_by CHAR(36) NULL;

ALTER TABLE courses
  ADD CONSTRAINT fk_courses_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_courses_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

-- courses gained author_id / edited_by in 035 and never used them: no writer,
-- no reader, no UI. Two ways to say the same thing is one more than the
-- middleware can keep straight, so the unused pair goes.
ALTER TABLE courses DROP FOREIGN KEY fk_courses_author;
ALTER TABLE courses DROP FOREIGN KEY fk_courses_editor;
ALTER TABLE courses DROP COLUMN author_id, DROP COLUMN edited_by;
