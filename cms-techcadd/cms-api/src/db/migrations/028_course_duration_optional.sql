-- "Not stated" has to be storable for duration too.
--
-- 019_course_level_mode_optional.sql made exactly this argument about level and
-- mode: the site's full catalogue was imported, fifty-odd courses had to be
-- given *something*, and whatever was chosen became a claim on that many live
-- pages. It fixed those two columns and left duration NOT NULL alongside them.
--
-- The result is that 51 of the 53 imported courses hold an empty duration,
-- which the column tolerated only because the import wrote '' rather than NULL.
-- Validation does not tolerate it: `duration: z.string().min(1)` rejects the
-- record on save, so opening any imported course and pressing Save fails with
-- "Duration is required" — on a field the editor never filled in and has no
-- particular reason to know. The module is unusable for most of the catalogue
-- until that is either answered fifty times or allowed to be absent.
--
-- Allowed to be absent, for the same reason as level and mode: the facts strip
-- already falls back to the segment's generic wording when a value is missing.

ALTER TABLE courses
  MODIFY COLUMN duration VARCHAR(80) NULL;

-- The import's placeholder becomes a real absence, so "not stated" has one
-- representation rather than two.
UPDATE courses SET duration = NULL WHERE duration = '';
