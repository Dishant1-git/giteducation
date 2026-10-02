-- Comments on published posts.
--
-- Anonymous, because the website has no visitor accounts: there is a CMS login
-- and the legacy /admin gate, and neither belongs to a reader. That decides
-- most of the shape below. A name typed into a form is a claim, not an
-- identity, so nothing here treats it as one — there is no "edit your own
-- comment", because there is no "your".
--
-- Moderation is therefore the whole safety mechanism rather than a nicety:
-- nothing appears on the site until somebody approves it.
CREATE TABLE IF NOT EXISTS blog_comments (
  id           CHAR(36)     NOT NULL PRIMARY KEY,
  blog_id      CHAR(36)     NOT NULL,
  -- A reply. NULL is a top-level comment.
  parent_id    CHAR(36)     NULL,
  author_name  VARCHAR(80)  NOT NULL,
  -- Collected, never published. It is how a moderator can reply to somebody
  -- about their comment, and nothing else — the website never renders it.
  author_email VARCHAR(190) NULL,
  body         TEXT         NOT NULL,
  status       ENUM('pending','approved','hidden','reported') NOT NULL DEFAULT 'pending',
  /*
    A hash of the sender's address, not the address.

    Enough to rate-limit and to recognise a flood from one source; not enough
    to be a record of who read what. Storing the address itself would make
    this table something that has to be explained to a visitor, for a benefit
    a hash already provides.
  */
  ip_hash      CHAR(64)     NULL,
  -- Who acted on it, and when. Null until somebody does.
  moderated_by CHAR(36)     NULL,
  moderated_at DATETIME(3)  NULL,
  created_at   DATETIME(3)  NOT NULL,
  updated_at   DATETIME(3)  NOT NULL,
  KEY idx_comments_blog (blog_id, status, created_at),
  KEY idx_comments_parent (parent_id),
  KEY idx_comments_status (status, created_at),
  KEY idx_comments_flood (ip_hash, created_at),
  CONSTRAINT fk_comments_blog FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
  -- A deleted comment takes its replies with it: a reply to nothing is a
  -- fragment of a conversation the reader cannot follow.
  CONSTRAINT fk_comments_parent FOREIGN KEY (parent_id) REFERENCES blog_comments(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_moderator FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
