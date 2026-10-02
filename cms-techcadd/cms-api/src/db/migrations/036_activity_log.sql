-- Who did what, and when.
--
-- Two records of the same fact, deliberately.
--
-- `created_by` / `updated_by` on each content table answer "who owns this" at
-- a glance, on the record itself, with no join and no scan — which is what the
-- edit screen needs.
--
-- `activity_log` answers "what happened" over time. It is append-only and it
-- keeps the actor's name as text alongside the id: a contribution history that
-- forgets who Sandeep was the moment their account is deleted is not a history.
-- The same reasoning applies to the entity — a blog's title is copied in, so
-- the log still reads "created Blog: Introduction to AI" after the blog is gone.
CREATE TABLE IF NOT EXISTS activity_log (
  id           CHAR(36)     NOT NULL PRIMARY KEY,
  user_id      CHAR(36)     NULL,
  -- Denormalised on purpose; see above.
  user_name    VARCHAR(120) NOT NULL,
  action       ENUM('created','updated','published','unpublished','deleted','approved','hidden')
               NOT NULL,
  entity_type  VARCHAR(40)  NOT NULL,
  entity_id    CHAR(36)     NULL,
  entity_label VARCHAR(200) NULL,
  -- Room for what a row cannot say: which fields changed, how many at once.
  metadata     JSON         NULL,
  created_at   DATETIME(3)  NOT NULL,
  KEY idx_activity_user (user_id, created_at),
  KEY idx_activity_entity (entity_type, entity_id),
  KEY idx_activity_when (created_at),
  -- SET NULL, not CASCADE: deleting a person must not delete the record of
  -- what they contributed. `user_name` is what keeps the row readable.
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
