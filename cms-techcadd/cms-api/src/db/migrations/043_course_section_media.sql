-- Optional media on three course-page sections.
--
-- Columns on `courses` rather than a table of their own, because these belong
-- to the course the way `thumbnail_id`, `video_url` and `video_title` already
-- do — one value per course, not a list. The same naming: `<section>_media_id`
-- beside the existing `thumbnail_id`, and `<section>_video_url` beside the
-- existing `video_url`.
--
-- No alt-text column, deliberately. `thumbnail_id` has never had one either:
-- the description lives on the file in the media library, which is where an
-- editor changes it once for every place it is used. Adding one here would
-- give the same picture two descriptions and no rule about which wins.
--
-- Every column is nullable and every one is optional. A course that sets none
-- renders exactly as it does today — see the note in course-page-view.tsx on
-- each of these sections.
--
-- ON DELETE SET NULL: removing a file from the library empties the slot rather
-- than leaving a section pointing at something that is gone.

ALTER TABLE courses
  ADD COLUMN why_media_id        CHAR(36)     NULL,
  ADD COLUMN why_video_url       VARCHAR(500) NULL,
  ADD COLUMN syllabus_media_id   CHAR(36)     NULL,
  ADD COLUMN syllabus_video_url  VARCHAR(500) NULL,
  ADD COLUMN learning_media_id   CHAR(36)     NULL,
  ADD COLUMN learning_video_url  VARCHAR(500) NULL;

ALTER TABLE courses
  ADD CONSTRAINT fk_courses_why_media
    FOREIGN KEY (why_media_id) REFERENCES media(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_courses_syllabus_media
    FOREIGN KEY (syllabus_media_id) REFERENCES media(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_courses_learning_media
    FOREIGN KEY (learning_media_id) REFERENCES media(id) ON DELETE SET NULL;
