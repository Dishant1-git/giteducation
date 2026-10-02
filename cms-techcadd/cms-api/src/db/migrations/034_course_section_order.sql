-- The order a course's sections appear in.
--
-- The Page Layout tab could already switch a section off; it could not move
-- one. That is the half of "page layout" an editor actually reaches for —
-- putting career outcomes above the syllabus for a course people take for the
-- job rather than the subject.
--
-- A JSON list of DOM ids rather than a position column per section: the set of
-- sections is decided by the template, not by the data, so a column each would
-- need a migration every time one was added, and a child table would model an
-- ordering of things that have no rows of their own.
--
-- NULL means the order they are written in, which is what all 53 courses have
-- today and what a course nobody has reordered should keep. A list that names
-- a section the template no longer has, or omits one it gained, still renders
-- correctly — see components/ordered-sections.tsx.
ALTER TABLE courses
  ADD COLUMN section_order JSON NULL AFTER hidden_sections;
