-- Course fields the website never rendered.
--
-- Audited field by field against the site's course template: of roughly
-- seventy fields on a course record, twenty-four reach a page. These are the
-- ones with no consumer at all and no plausible one — an editor filling them
-- in was writing into a box that changed nothing, which is worse than the box
-- not existing.
--
-- Deliberately NOT dropped, though they are also unrendered today: the hero
-- copy (eyebrow, intro), eligibility, the quick-facts strip, the CTA buttons,
-- benefits, workflow, the comparison rows, plans, and the per-course FAQ,
-- review and related-course links. Those are real features that belong on the
-- page; they need wiring, not deleting.

-- The media slots carry foreign keys to the media library; MySQL will not
-- drop a column an index still needs, so the constraints go first.
ALTER TABLE courses
  DROP FOREIGN KEY fk_courses_why_media,
  DROP FOREIGN KEY fk_courses_syllabus_media,
  DROP FOREIGN KEY fk_courses_learning_media,
  DROP FOREIGN KEY fk_courses_highlights_media,
  DROP FOREIGN KEY fk_courses_case_media,
  DROP FOREIGN KEY fk_courses_cert_media,
  DROP FOREIGN KEY fk_courses_cert_project_media,
  DROP FOREIGN KEY fk_courses_career_media,
  DROP FOREIGN KEY fk_courses_reviews_media;

ALTER TABLE courses
  -- Free-text fields with nowhere to go. `salary` here is the course-level
  -- figure; the per-role salaries on course_careers are rendered and stay.
  DROP COLUMN tagline,
  DROP COLUMN demand,
  DROP COLUMN salary,
  -- Section intros. The rows beneath each of these render; the introductory
  -- paragraph above them never did.
  DROP COLUMN audience_intro,
  DROP COLUMN why_intro,
  DROP COLUMN syllabus_intro,
  DROP COLUMN syllabus_note,
  DROP COLUMN comparison_intro,
  DROP COLUMN comparison_others,
  DROP COLUMN comparison_note,
  -- Section ordering and visibility. The site renders its own fixed order.
  DROP COLUMN hidden_sections,
  DROP COLUMN section_order,
  DROP COLUMN featured,
  -- Seventeen per-section image and video slots. The course template has one
  -- thumbnail and one intro video; none of these had a home.
  DROP COLUMN why_media_id,
  DROP COLUMN why_video_url,
  DROP COLUMN syllabus_media_id,
  DROP COLUMN syllabus_video_url,
  DROP COLUMN learning_media_id,
  DROP COLUMN learning_video_url,
  DROP COLUMN highlights_media_id,
  DROP COLUMN highlights_video_url,
  DROP COLUMN case_media_id,
  DROP COLUMN case_video_url,
  DROP COLUMN cert_media_id,
  DROP COLUMN cert_project_media_id,
  DROP COLUMN cert_video_url,
  DROP COLUMN career_media_id,
  DROP COLUMN career_video_url,
  DROP COLUMN reviews_media_id,
  DROP COLUMN reviews_video_url;

-- `toolItems` duplicated the `tools` JSON column, which is what the page
-- reads. Two lists of the same tools is one list too many.
DROP TABLE IF EXISTS course_tools;
