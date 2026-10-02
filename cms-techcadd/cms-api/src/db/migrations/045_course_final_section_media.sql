-- The last four section slots on the course page.
--
-- Same shape and naming as 043 and 044: `<section>_media_id` beside
-- `thumbnail_id`, `<section>_video_url` beside `video_url`, every column
-- nullable and optional.
--
--   cert_media_id          the course completion certificate
--   cert_project_media_id  the project certificate — a separate field, because
--                          they are two different documents
--   career_media_id        the career / future-scope section
--   reviews_media_id       the student reviews band
--
-- The certificates are drawn in CSS today (see CertificateMock). A photograph
-- of the real thing replaces the drawing when one is uploaded; with none, the
-- drawing stays, so nothing changes for a course that sets nothing.

ALTER TABLE courses
  ADD COLUMN cert_media_id         CHAR(36)     NULL,
  ADD COLUMN cert_project_media_id CHAR(36)     NULL,
  ADD COLUMN cert_video_url        VARCHAR(500) NULL,
  ADD COLUMN career_media_id       CHAR(36)     NULL,
  ADD COLUMN career_video_url      VARCHAR(500) NULL,
  ADD COLUMN reviews_media_id      CHAR(36)     NULL,
  ADD COLUMN reviews_video_url     VARCHAR(500) NULL;

ALTER TABLE courses
  ADD CONSTRAINT fk_courses_cert_media
    FOREIGN KEY (cert_media_id) REFERENCES media(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_courses_cert_project_media
    FOREIGN KEY (cert_project_media_id) REFERENCES media(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_courses_career_media
    FOREIGN KEY (career_media_id) REFERENCES media(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_courses_reviews_media
    FOREIGN KEY (reviews_media_id) REFERENCES media(id) ON DELETE SET NULL;
