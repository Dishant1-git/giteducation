-- Multi-duration plans, and a curriculum module worth the name.
--
-- Plans
-- -----
-- The page already renders three enrolment lengths and a table showing which
-- modules each one reaches. Both were generated, and both were pinned to
-- 3/6/9 months by the types — a course that runs 45 days and 4 months could
-- not describe itself.
--
-- `months` is the number the card prints and the column sorts by; `duration`
-- is what an editor wants it to read ("6 Months", "45 Days"), because the two
-- are not always the same sentence.
--
-- `popular` replaces a hardcoded highlight on the middle card. Three plans
-- happened to make the middle one right; two or four make it arbitrary.
CREATE TABLE IF NOT EXISTS course_plans (
  id           CHAR(36)     NOT NULL PRIMARY KEY,
  course_id    CHAR(36)     NOT NULL,
  -- The level this plan certifies: Practitioner, Professional, Expert.
  label        VARCHAR(80)  NOT NULL,
  months       SMALLINT     NULL,
  duration     VARCHAR(60)  NULL,
  summary      TEXT         NULL,
  -- "Modules 1 – 10". Derived when blank, from which modules the plan reaches.
  range_label  VARCHAR(80)  NULL,
  badge        VARCHAR(24)  NULL,
  popular      TINYINT(1)   NOT NULL DEFAULT 0,
  position     SMALLINT     NOT NULL,
  KEY idx_course_plans_order (course_id, position),
  CONSTRAINT fk_course_plans_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Curriculum modules, with the fields a module actually has.
--
-- `from_plan` is the position of the shortest plan that reaches this module,
-- and it is what drives the comparison table: a module is included in that
-- plan and in every longer one. Stored as a position rather than a plan id
-- because both lists are rewritten wholesale on every save, so an id would not
-- survive the round trip — and because the nesting is an ordering fact.
--
-- This is deliberately not a free include/exclude matrix. The existing type
-- says why: "Storing a range per module instead would let the three columns
-- contradict each other, which is precisely what a comparison table must never
-- do." A shorter plan that taught something a longer one skipped would be a
-- data-entry mistake the page had no way to show honestly.
--
-- NULL means every plan reaches it, which is what the 53 existing courses want
-- — none of them has plans yet.
ALTER TABLE course_syllabus
  ADD COLUMN body      TEXT         NULL,
  ADD COLUMN outcomes  JSON         NULL,
  ADD COLUMN tools     JSON         NULL,
  ADD COLUMN project   VARCHAR(300) NULL,
  ADD COLUMN media_id  CHAR(36)     NULL,
  ADD COLUMN from_plan SMALLINT     NULL;

ALTER TABLE course_syllabus
  ADD CONSTRAINT fk_course_syllabus_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL;

-- Section-level copy for the syllabus ladder.
ALTER TABLE courses
  ADD COLUMN syllabus_intro TEXT         NULL,
  ADD COLUMN syllabus_note  VARCHAR(300) NULL;
