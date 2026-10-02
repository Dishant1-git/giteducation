-- Tags as records, so two spellings cannot become two tags.
--
-- `blog_tags` held the tag as text on each blog. Twenty-five distinct values
-- today and no duplicates yet — but "AI" and "ai" would be two tags, filed on
-- two pages, and nothing would say they were the same. That is the drift that
-- had already happened to FAQ categories by the time anyone looked.
--
-- A slug as well as a name, because a tag is now an address: /blogs/tag/ai.
-- Unique on both, which is what makes the drift impossible rather than merely
-- unlikely.
CREATE TABLE IF NOT EXISTS tags (
  id         CHAR(36)    NOT NULL PRIMARY KEY,
  name       VARCHAR(60) NOT NULL,
  slug       VARCHAR(60) NOT NULL,
  created_by CHAR(36)    NULL,
  created_at DATETIME(3) NOT NULL,
  UNIQUE KEY uq_tags_name (name),
  UNIQUE KEY uq_tags_slug (slug),
  CONSTRAINT fk_tags_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per distinct tag already in use. Slugs are derived the same way the
-- CMS derives them, so an existing tag and a re-typed one land on the same row.
INSERT INTO tags (id, name, slug, created_at)
SELECT UUID(), t.tag,
       LOWER(REPLACE(REPLACE(REPLACE(REPLACE(t.tag, ' & ', '-'), ' ', '-'), '.', ''), '--', '-')),
       NOW(3)
  FROM (SELECT DISTINCT tag FROM blog_tags WHERE tag <> '') t;

ALTER TABLE blog_tags ADD COLUMN tag_id CHAR(36) NULL;

UPDATE blog_tags bt JOIN tags t ON t.name = bt.tag SET bt.tag_id = t.id;

-- Anything that somehow failed to match would silently lose its tag, so it is
-- removed explicitly rather than left as a row pointing at nothing.
DELETE FROM blog_tags WHERE tag_id IS NULL;

ALTER TABLE blog_tags MODIFY COLUMN tag_id CHAR(36) NOT NULL;

/*
  The key becomes (blog, tag).

  It was (blog, position), which permitted the same tag twice on one post as
  long as the two sat at different positions — exactly the duplicate the
  specification asks to prevent, and not something the old shape could refuse.

  The foreign key on blog_id has to go first: it is served by the primary key's
  index, and InnoDB refuses to drop an index a constraint is relying on. It is
  put back below, once the new key exists to serve it.
*/
ALTER TABLE blog_tags DROP FOREIGN KEY fk_blog_tags_blog;
ALTER TABLE blog_tags DROP PRIMARY KEY;
ALTER TABLE blog_tags DROP COLUMN tag;
ALTER TABLE blog_tags ADD PRIMARY KEY (blog_id, tag_id);
ALTER TABLE blog_tags ADD KEY idx_blog_tags_tag (tag_id);

ALTER TABLE blog_tags
  ADD CONSTRAINT fk_blog_tags_blog FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_blog_tags_tag  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE;
