-- Quick facts and the page-layout editor, removed at the office's request.
--
-- `facts` drove the "Course at a glance" strip. The four values it showed are
-- already on the record — duration, mode, eligibility, certification — so the
-- strip was a second place to type the same things and a second place for them
-- to disagree.
--
-- `sections`, `hidden_sections` and `section_order` were the "Page layout"
-- card: reorder the generated sections, switch one off, insert your own blocks
-- between them. 049 kept the last two only because they were coupled to
-- `sections`; with the whole feature going, all three go together as that
-- migration said they should.
DROP TABLE IF EXISTS course_facts;
DROP TABLE IF EXISTS course_sections;

ALTER TABLE courses
  DROP COLUMN hidden_sections,
  DROP COLUMN section_order;
