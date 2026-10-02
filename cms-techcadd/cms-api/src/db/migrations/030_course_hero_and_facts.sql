-- The hero an editor can actually write, and facts they can actually list.
--
-- Hero
-- ----
-- Until now the heading, the label above it and the lead paragraph were all
-- generated: "Best <label> Course & Training in Jalandhar" from the segment's
-- template, with the nav label as the eyebrow. That is a reasonable floor and a
-- poor ceiling — it cannot say "Artificial Intelligence Course in Jalandhar
-- with Live Projects & Placement Support", and there was no field to say it in.
--
-- All nullable: an empty column falls through to the generated value, so the
-- 53 existing courses keep exactly the page they have today.
--
-- `intro` is separate from `short_description` on purpose. The short
-- description is the card copy — it appears in listings and has to stay short.
-- The hero lead is a paragraph, and making one field do both jobs means one of
-- them is always the wrong length.

ALTER TABLE courses
  -- Small label above the heading.
  ADD COLUMN eyebrow    VARCHAR(80)  NULL AFTER title,
  -- Optional pill beside it: Hot, New, Trending.
  ADD COLUMN badge      VARCHAR(24)  NULL AFTER eyebrow,
  -- The page's <h1>.
  ADD COLUMN h1         VARCHAR(200) NULL AFTER badge,
  -- The hero's lead paragraph.
  ADD COLUMN intro      TEXT         NULL AFTER h1;

-- Both hero buttons, editable.
--
-- Columns rather than a child table: there are exactly two, they are not
-- reordered, and a table whose row count can only ever be 0, 1 or 2 costs a
-- join on every course read to model something a pair of columns already says.
--
-- `type` decides what the button does, so a URL is only meaningful for
-- 'internal' and 'external' — 'enquiry' opens the enquiry dialog and 'contact'
-- goes to /contact, neither of which an editor should have to know the address
-- of. The API rejects a url that is neither site-relative nor http(s), which is
-- what keeps `javascript:` out of an href.
ALTER TABLE courses
  ADD COLUMN cta_primary_text     VARCHAR(60)  NULL AFTER intro,
  ADD COLUMN cta_primary_type     ENUM('enquiry','contact','internal','external') NULL AFTER cta_primary_text,
  ADD COLUMN cta_primary_url      VARCHAR(500) NULL AFTER cta_primary_type,
  ADD COLUMN cta_secondary_text   VARCHAR(60)  NULL AFTER cta_primary_url,
  ADD COLUMN cta_secondary_type   ENUM('enquiry','contact','internal','external') NULL AFTER cta_secondary_text,
  ADD COLUMN cta_secondary_url    VARCHAR(500) NULL AFTER cta_secondary_type;

-- Quick facts, as many as the course needs.
--
-- A child table rather than JSON because these are reordered by hand and the
-- editor adds and removes them one at a time — the same reasoning that made
-- syllabus modules and highlights child tables, and the opposite of careers and
-- tools, which are flat lists edited as a whole by a tag input.
--
-- No rows means "use the segment's generated four", so nothing has to be
-- backfilled and a course nobody has touched keeps the facts it has today.
CREATE TABLE IF NOT EXISTS course_facts (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  course_id  CHAR(36)     NOT NULL,
  label      VARCHAR(60)  NOT NULL,
  value      VARCHAR(120) NOT NULL,
  -- Key into the site's icon set; an unknown value falls back to no icon
  -- rather than breaking the strip.
  icon       VARCHAR(40)  NULL,
  -- Printed after the value in a lighter weight — "+", "★", "/ week".
  suffix     VARCHAR(24)  NULL,
  position   SMALLINT     NOT NULL,
  KEY idx_course_facts_order (course_id, position),
  CONSTRAINT fk_course_facts_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
