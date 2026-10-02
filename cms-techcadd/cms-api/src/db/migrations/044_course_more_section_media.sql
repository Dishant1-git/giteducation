-- Two more section slots on the course page.
--
-- Same shape and naming as 043: a `<section>_media_id` beside `thumbnail_id`
-- and a `<section>_video_url` beside `video_url`, both nullable and optional.
--
--   highlights  the wide band under the hero — "Industry-Ready Training in …"
--               with the tick list beside it. It has always reused the hero
--               picture, which is why an editor could not give it its own.
--   case_pitch  the banner directly below "Why this programme".
--
-- Both were previously drawn from `galleryRotation`, the shared pool of campus
-- photographs picked by hashing the slug — so two courses could show the same
-- photograph and no editor could choose either. A slot left empty still does
-- exactly that, so nothing changes for a course that sets nothing.

ALTER TABLE courses
  ADD COLUMN highlights_media_id  CHAR(36)     NULL,
  ADD COLUMN highlights_video_url VARCHAR(500) NULL,
  ADD COLUMN case_media_id        CHAR(36)     NULL,
  ADD COLUMN case_video_url       VARCHAR(500) NULL;

ALTER TABLE courses
  ADD CONSTRAINT fk_courses_highlights_media
    FOREIGN KEY (highlights_media_id) REFERENCES media(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_courses_case_media
    FOREIGN KEY (case_media_id) REFERENCES media(id) ON DELETE SET NULL;
