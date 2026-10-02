-- The repeatable sections of a course page, as records an editor owns.
--
-- Every one of these renders today from copy the generator invents: who the
-- course is for, what you get, where it leads, what you build, how the work is
-- run, why this institute, and how it compares. That is a decent floor and it
-- is the same floor on all 53 courses, which is exactly the thing a course
-- builder is supposed to fix.
--
-- One table per section rather than one table with a `kind` column. They do not
-- share a shape — a career role carries two salary bands, a comparison row
-- carries a value per column, a project carries tags — and a single table wide
-- enough for all of them would be mostly NULL and would need a check
-- constraint per kind to stay honest.
--
-- No rows means "use the generated copy", so nothing is backfilled and every
-- existing course renders exactly as it does today.

-- §8 Who the course is for. Numbered on the page from `position`, so an editor
-- reorders rather than renumbering by hand.
CREATE TABLE IF NOT EXISTS course_audience (
  id          CHAR(36)     NOT NULL PRIMARY KEY,
  course_id   CHAR(36)     NOT NULL,
  title       VARCHAR(120) NOT NULL,
  body        TEXT         NOT NULL,
  icon        VARCHAR(40)  NULL,
  position    SMALLINT     NOT NULL,
  KEY idx_course_audience_order (course_id, position),
  CONSTRAINT fk_course_audience_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- §7 What you get, and §4 the hero benefit cards. One table with a `placement`
-- because the two are the same record in two positions — a benefit is a title,
-- a line of body and an icon wherever it appears.
CREATE TABLE IF NOT EXISTS course_benefits (
  id          CHAR(36)     NOT NULL PRIMARY KEY,
  course_id   CHAR(36)     NOT NULL,
  placement   ENUM('hero','what-you-get') NOT NULL DEFAULT 'what-you-get',
  title       VARCHAR(120) NOT NULL,
  body        TEXT         NULL,
  icon        VARCHAR(40)  NULL,
  position    SMALLINT     NOT NULL,
  KEY idx_course_benefits_order (course_id, placement, position),
  CONSTRAINT fk_course_benefits_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- §10 Career outcomes, with the salary bands the site currently states once for
-- the whole course. Text rather than numbers: a band is "₹3.5 – 5 LPA", and
-- storing two integers to print a range means deciding a currency, a unit and a
-- separator in the renderer that the copy already carries.
CREATE TABLE IF NOT EXISTS course_careers (
  id            CHAR(36)     NOT NULL PRIMARY KEY,
  course_id     CHAR(36)     NOT NULL,
  role          VARCHAR(120) NOT NULL,
  body          TEXT         NULL,
  salary_start  VARCHAR(60)  NULL,
  salary_senior VARCHAR(60)  NULL,
  market        VARCHAR(80)  NULL,
  salary_note   VARCHAR(200) NULL,
  icon          VARCHAR(40)  NULL,
  position      SMALLINT     NOT NULL,
  KEY idx_course_careers_order (course_id, position),
  CONSTRAINT fk_course_careers_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- §16 Projects. `tags` is JSON for the same reason careers and tools are: a
-- short flat list edited as a whole by a tag input, with nothing referencing it.
CREATE TABLE IF NOT EXISTS course_projects (
  id          CHAR(36)     NOT NULL PRIMARY KEY,
  course_id   CHAR(36)     NOT NULL,
  title       VARCHAR(160) NOT NULL,
  body        TEXT         NOT NULL,
  tags        JSON         NULL,
  difficulty  ENUM('beginner','intermediate','advanced') NULL,
  media_id    CHAR(36)     NULL,
  demo_url    VARCHAR(500) NULL,
  repo_url    VARCHAR(500) NULL,
  video_url   VARCHAR(500) NULL,
  position    SMALLINT     NOT NULL,
  KEY idx_course_projects_order (course_id, position),
  CONSTRAINT fk_course_projects_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT fk_course_projects_media  FOREIGN KEY (media_id)  REFERENCES media(id)   ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- §17 The learn/build/present workflow, and §18 why this institute. Both are a
-- title with supporting body, distinguished by `kind` — here one table is right
-- because the shape genuinely is identical and the sections differ only in
-- where they sit on the page.
CREATE TABLE IF NOT EXISTS course_points (
  id          CHAR(36)     NOT NULL PRIMARY KEY,
  course_id   CHAR(36)     NOT NULL,
  kind        ENUM('workflow','why-techcadd') NOT NULL,
  title       VARCHAR(160) NOT NULL,
  body        TEXT         NULL,
  icon        VARCHAR(40)  NULL,
  position    SMALLINT     NOT NULL,
  KEY idx_course_points_order (course_id, kind, position),
  CONSTRAINT fk_course_points_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- §19 The comparison table. Two value columns because the page compares this
-- institute against one alternative; the header for the second is on `courses`
-- so it is stated once rather than repeated on every row.
CREATE TABLE IF NOT EXISTS course_comparison (
  id          CHAR(36)     NOT NULL PRIMARY KEY,
  course_id   CHAR(36)     NOT NULL,
  feature     VARCHAR(160) NOT NULL,
  ours        VARCHAR(200) NOT NULL,
  theirs      VARCHAR(200) NOT NULL,
  position    SMALLINT     NOT NULL,
  KEY idx_course_comparison_order (course_id, position),
  CONSTRAINT fk_course_comparison_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- §14 Tools, richer than the flat list on `courses.tools`.
--
-- The flat list stays and still feeds the site: it is what most courses have,
-- and a tag input is the right editor for twenty names. This table is the
-- opt-in upgrade for a course that wants logos and links, and the renderer
-- prefers it when there are rows.
CREATE TABLE IF NOT EXISTS course_tools (
  id          CHAR(36)     NOT NULL PRIMARY KEY,
  course_id   CHAR(36)     NOT NULL,
  name        VARCHAR(80)  NOT NULL,
  category    VARCHAR(60)  NULL,
  body        VARCHAR(300) NULL,
  url         VARCHAR(500) NULL,
  media_id    CHAR(36)     NULL,
  position    SMALLINT     NOT NULL,
  KEY idx_course_tools_order (course_id, position),
  CONSTRAINT fk_course_tools_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT fk_course_tools_media  FOREIGN KEY (media_id)  REFERENCES media(id)   ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Section-level copy that belongs to the course rather than to any one row:
-- the lead paragraph above a list, and the label for the comparison's second
-- column ("Other institutes").
ALTER TABLE courses
  ADD COLUMN audience_intro     TEXT         NULL,
  ADD COLUMN why_intro          TEXT         NULL,
  ADD COLUMN comparison_intro   TEXT         NULL,
  ADD COLUMN comparison_others  VARCHAR(80)  NULL,
  ADD COLUMN comparison_note    VARCHAR(300) NULL;
