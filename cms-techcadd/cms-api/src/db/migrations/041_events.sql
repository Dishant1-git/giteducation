-- Events: the seminars, workshops and guest lectures techcadd runs.
--
-- Modelled on `blogs` rather than on `gallery_albums`, because an event is an
-- article with a date attached: it has a slug, a page of its own, a rich body
-- and SEO, and it is written before it happens rather than uploaded after.
-- The gallery is what an event leaves behind; this is the event itself.
--
-- Dates are DATE + TIME rather than one DATETIME. The workshops already in
-- /gallery ran across three days ("10-12 August 2026"), so a single instant
-- cannot describe them, and a start and end date can. The times are separate
-- and nullable because "10 August, 10am" and "10-12 August" are both things
-- the office announces, and forcing a time onto the second would invent one.
--
-- No timezone column: every event is run by one institute in one city. A
-- column that is always 'Asia/Kolkata' is a field to get wrong, not a fact.

CREATE TABLE IF NOT EXISTS events (
  id               CHAR(36)     NOT NULL PRIMARY KEY,
  title            VARCHAR(160) NOT NULL,
  slug             VARCHAR(160) NOT NULL,
  -- What kind of gathering. Kept as a string with the allowed values enforced
  -- in the schema layer, matching how `status` is handled everywhere else —
  -- a MySQL ENUM needs a migration to add a value, and this list will grow.
  event_type       VARCHAR(30)  NOT NULL DEFAULT 'seminar',
  mode             VARCHAR(20)  NOT NULL DEFAULT 'in-person',
  summary          VARCHAR(300) NOT NULL,
  body             MEDIUMTEXT   NOT NULL,
  cover_image_id   CHAR(36)     NULL,

  starts_on        DATE         NOT NULL,
  ends_on          DATE         NULL,
  start_time       TIME         NULL,
  end_time         TIME         NULL,

  venue_name       VARCHAR(160) NULL,
  venue_address    VARCHAR(300) NULL,
  city             VARCHAR(80)  NULL,
  map_url          VARCHAR(500) NULL,
  -- The partner college or company an event is run with, when there is one.
  host_name        VARCHAR(160) NULL,

  registration_url VARCHAR(500) NULL,
  seats            INT          NULL,
  -- Free text, not a number: "Free", "₹499", "Free for students" are all
  -- answers the office gives, and only one of them is a price.
  fee              VARCHAR(60)  NULL,

  featured         TINYINT(1)   NOT NULL DEFAULT 0,
  status           VARCHAR(20)  NOT NULL DEFAULT 'draft',

  meta_title       VARCHAR(255) NULL,
  meta_description VARCHAR(500) NULL,
  meta_keywords    JSON         NULL,
  og_image_id      CHAR(36)     NULL,
  canonical_url    VARCHAR(500) NULL,

  created_by       CHAR(36)     NULL,
  updated_by       CHAR(36)     NULL,
  created_at       DATETIME(3)  NOT NULL,
  updated_at       DATETIME(3)  NOT NULL,

  UNIQUE KEY uq_events_slug (slug),
  -- The index the public listing sorts on: upcoming first, by date.
  KEY idx_events_when (status, starts_on),
  CONSTRAINT fk_events_cover      FOREIGN KEY (cover_image_id) REFERENCES media(id) ON DELETE SET NULL,
  CONSTRAINT fk_events_og         FOREIGN KEY (og_image_id)    REFERENCES media(id) ON DELETE SET NULL,
  CONSTRAINT fk_events_created_by FOREIGN KEY (created_by)     REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_events_updated_by FOREIGN KEY (updated_by)     REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tags, against the same `tags` table blog posts use.
--
-- Shared deliberately: "AI" on a seminar and "AI" on an article are the same
-- subject, and a second tag vocabulary would make /blogs/tag/ai and an event
-- tagged "AI" two unrelated things wearing one name. The key is (event, tag),
-- which is what makes the same tag twice on one event impossible.
CREATE TABLE IF NOT EXISTS event_tags (
  event_id CHAR(36) NOT NULL,
  tag_id   CHAR(36) NOT NULL,
  position INT      NOT NULL DEFAULT 0,
  PRIMARY KEY (event_id, tag_id),
  KEY idx_event_tags_tag (tag_id),
  CONSTRAINT fk_event_tags_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_tags_tag   FOREIGN KEY (tag_id)   REFERENCES tags(id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Who is speaking.
--
-- Rows rather than a JSON blob on the event, because a speaker has a
-- photograph, and a photograph is a media id that must be a real one — a
-- foreign key can say that and a JSON field cannot.
CREATE TABLE IF NOT EXISTS event_speakers (
  id       CHAR(36)     NOT NULL PRIMARY KEY,
  event_id CHAR(36)     NOT NULL,
  name     VARCHAR(120) NOT NULL,
  role     VARCHAR(160) NULL,
  org      VARCHAR(160) NULL,
  bio      VARCHAR(600) NULL,
  photo_id CHAR(36)     NULL,
  position INT          NOT NULL DEFAULT 0,
  KEY idx_event_speakers_event (event_id, position),
  CONSTRAINT fk_event_speakers_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_speakers_photo FOREIGN KEY (photo_id) REFERENCES media(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The running order. `time_label` is text ("10:00 - 11:30", "Day 2") rather
-- than a TIME, because a three-day workshop's agenda is grouped by day and a
-- one-hour talk's is grouped by the clock.
CREATE TABLE IF NOT EXISTS event_agenda (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  event_id   CHAR(36)     NOT NULL,
  time_label VARCHAR(60)  NULL,
  title      VARCHAR(200) NOT NULL,
  detail     VARCHAR(600) NULL,
  position   INT          NOT NULL DEFAULT 0,
  KEY idx_event_agenda_event (event_id, position),
  CONSTRAINT fk_event_agenda_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- "What you will take away" — the bullet list above the fold.
CREATE TABLE IF NOT EXISTS event_highlights (
  id       CHAR(36)     NOT NULL PRIMARY KEY,
  event_id CHAR(36)     NOT NULL,
  text     VARCHAR(240) NOT NULL,
  position INT          NOT NULL DEFAULT 0,
  KEY idx_event_highlights_event (event_id, position),
  CONSTRAINT fk_event_highlights_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Photographs from the day, for an event that has already happened.
CREATE TABLE IF NOT EXISTS event_images (
  id       CHAR(36)     NOT NULL PRIMARY KEY,
  event_id CHAR(36)     NOT NULL,
  media_id CHAR(36)     NOT NULL,
  caption  VARCHAR(240) NULL,
  position INT          NOT NULL DEFAULT 0,
  KEY idx_event_images_event (event_id, position),
  CONSTRAINT fk_event_images_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_images_media FOREIGN KEY (media_id) REFERENCES media(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
