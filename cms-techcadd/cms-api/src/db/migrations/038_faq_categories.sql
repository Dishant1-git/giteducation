-- FAQ categories as records, not as a string typed into each question.
--
-- `faqs.category` was free text, and it drifted exactly the way free text
-- does: this database holds both "Placement" and "Placements", which the
-- website renders as two separate sections containing what should be one.
-- Nobody did anything wrong — the field simply had no way to say "the same as
-- the other one".
--
-- Categories now carry a slug (so /faqs/placements can exist), a display
-- order, a description and an on/off switch, none of which a varchar could.
CREATE TABLE IF NOT EXISTS faq_categories (
  id          CHAR(36)     NOT NULL PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL,
  slug        VARCHAR(80)  NOT NULL,
  description VARCHAR(300) NULL,
  -- Key into the site's icon set. Unknown values fall back to no icon.
  icon        VARCHAR(40)  NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_by  CHAR(36)     NULL,
  updated_by  CHAR(36)     NULL,
  created_at  DATETIME(3)  NOT NULL,
  updated_at  DATETIME(3)  NOT NULL,
  UNIQUE KEY uq_faq_categories_slug (slug),
  -- Two categories with one name is the drift this table exists to end.
  UNIQUE KEY uq_faq_categories_name (name),
  KEY idx_faq_categories_order (active, sort_order),
  CONSTRAINT fk_faq_categories_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_faq_categories_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One category per distinct name already in use, so nothing has to be
-- re-filed by hand. The singular "Placement" is folded into "Placements"
-- below rather than carried over as a second row.
INSERT INTO faq_categories (id, name, slug, sort_order, active, created_at, updated_at)
SELECT UUID(),
       f.category,
       LOWER(REPLACE(REPLACE(REPLACE(f.category, ' & ', '-'), ' ', '-'), '--', '-')),
       0, 1, NOW(3), NOW(3)
  FROM (SELECT DISTINCT category FROM faqs WHERE category <> '' AND category <> 'Placement') f;

ALTER TABLE faqs
  ADD COLUMN category_id CHAR(36) NULL AFTER answer;

-- Match on the name, with the singular folded into the plural.
UPDATE faqs f
  JOIN faq_categories c
    ON c.name = CASE WHEN f.category = 'Placement' THEN 'Placements' ELSE f.category END
   SET f.category_id = c.id;

/*
  Anything still unmatched gets a home rather than disappearing.

  A FAQ with no category would vanish from a category-grouped page, which is a
  worse outcome than one filed under "General" — so the fallback is created
  only if it is needed, and only then.
*/
INSERT INTO faq_categories (id, name, slug, sort_order, active, created_at, updated_at)
SELECT UUID(), 'General', 'general', 99, 1, NOW(3), NOW(3)
 WHERE EXISTS (SELECT 1 FROM faqs WHERE category_id IS NULL)
   AND NOT EXISTS (SELECT 1 FROM faq_categories WHERE name = 'General');

UPDATE faqs SET category_id = (SELECT id FROM faq_categories WHERE name = 'General')
 WHERE category_id IS NULL;

-- Required from here on: the specification asks that a FAQ without a valid
-- category not be considered complete, and the column is the place to say so.
ALTER TABLE faqs
  MODIFY COLUMN category_id CHAR(36) NOT NULL;

ALTER TABLE faqs
  ADD CONSTRAINT fk_faqs_category FOREIGN KEY (category_id) REFERENCES faq_categories(id);

-- The old column goes: two sources for one fact is how the drift started.
ALTER TABLE faqs DROP COLUMN category;

-- Display order follows the order they were being shown in, so the page does
-- not rearrange itself the day this ships.
SET @position = 0;
UPDATE faq_categories SET sort_order = (@position := @position + 1) ORDER BY name;
