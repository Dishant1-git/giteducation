-- GIT Education: the facts its course page prints that this schema never held.
--
-- The CMS was built for a site whose course pages state no price and no batch
-- timetable — 017 dropped the fee columns outright. giteducation.org prints
-- both, along with the seat limit, the weekly class load and the languages a
-- course is taught in, on every course page and in the JSON-LD beside it. Left
-- in the website's source they could only be changed by a developer, and a fee
-- is the one figure an institute revises most often.
--
-- All nullable: a course with none of these filled in renders the section
-- without the line rather than printing a zero.

ALTER TABLE courses
  -- Key into the website's line-icon set ("monitor", "receipt", "cube").
  ADD COLUMN icon             VARCHAR(40)      NULL AFTER segment,
  -- Free text, because the site says "Beginner to Advanced" and the `level`
  -- enum can only say one of the three.
  ADD COLUMN level_label      VARCHAR(80)      NULL AFTER level,
  -- Whole rupees. The site formats it; an indicative fee has no paise.
  ADD COLUMN fee_amount       INT UNSIGNED     NULL AFTER level_label,
  ADD COLUMN fee_installments VARCHAR(160)     NULL AFTER fee_amount,
  ADD COLUMN seats            SMALLINT UNSIGNED NULL AFTER fee_installments,
  ADD COLUMN next_batch       VARCHAR(160)     NULL AFTER seats,
  ADD COLUMN weekly_hours     VARCHAR(160)     NULL AFTER next_batch,
  ADD COLUMN rating_value     DECIMAL(2,1)     NULL AFTER weekly_hours,
  ADD COLUMN rating_count     INT UNSIGNED     NULL AFTER rating_value,
  -- Short flat lists, always read whole and never queried — JSON, as `tools`
  -- and `careers` already are.
  ADD COLUMN modes            JSON             NULL AFTER rating_count,
  ADD COLUMN languages        JSON             NULL AFTER modes,
  -- [{ name, days, time, mode, seats }] — the timetable rows.
  ADD COLUMN batches          JSON             NULL AFTER languages,
  -- The site lists entry requirements one per line, and four of them do not
  -- fit in 255 characters.
  MODIFY COLUMN eligibility   TEXT             NULL;

-- "What you will learn" lines on this site are full sentences; several pass
-- 300 characters, and 160 would have cut them mid-clause.
ALTER TABLE course_highlights
  MODIFY COLUMN value VARCHAR(600) NOT NULL;
