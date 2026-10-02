-- Puts `hidden_sections` and `section_order` back.
--
-- 048 dropped them as unrendered, which they are — the website lays a course
-- page out in its own fixed order and reads neither. But they are not
-- independently removable: the admin's "Page layout" card drives all three of
-- `section_order`, `hidden_sections` and `sections` through one editor, and
-- `sections` is staying until someone decides whether the custom blocks belong
-- on the page. Removing two legs of a three-legged editor breaks the third.
--
-- So they come back as the lesser evil, and go out together with `sections` if
-- that feature is retired.
ALTER TABLE courses
  ADD COLUMN hidden_sections JSON NULL AFTER video_title,
  ADD COLUMN section_order   JSON NULL AFTER hidden_sections;
