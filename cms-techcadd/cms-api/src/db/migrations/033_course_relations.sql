-- Which FAQs, reviews and sibling courses a course page shows.
--
-- Link tables, not copies. The CMS already has FAQ and Review modules with
-- their own editors, their own Google-link handling and their own list pages;
-- a course-specific copy of either would be a second place to fix a typo and a
-- second answer to "how many reviews do we have".
--
-- Ordered, because the page shows a selection rather than everything: the
-- editor decides which three reviews lead, and that order is the point.
--
-- No rows keeps today's behaviour exactly — the page falls back to the FAQs
-- and reviews it already picks, and to related courses derived from what the
-- courses have in common.

CREATE TABLE IF NOT EXISTS course_faqs (
  course_id CHAR(36) NOT NULL,
  faq_id    CHAR(36) NOT NULL,
  position  SMALLINT NOT NULL,
  PRIMARY KEY (course_id, faq_id),
  KEY idx_course_faqs_order (course_id, position),
  CONSTRAINT fk_course_faqs_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  -- CASCADE, not SET NULL: a deleted FAQ is not a course showing a blank
  -- accordion row, it is a course that no longer lists that question.
  CONSTRAINT fk_course_faqs_faq    FOREIGN KEY (faq_id)    REFERENCES faqs(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_reviews (
  course_id CHAR(36) NOT NULL,
  review_id CHAR(36) NOT NULL,
  position  SMALLINT NOT NULL,
  PRIMARY KEY (course_id, review_id),
  KEY idx_course_reviews_order (course_id, position),
  CONSTRAINT fk_course_reviews_course FOREIGN KEY (course_id) REFERENCES courses(id)  ON DELETE CASCADE,
  CONSTRAINT fk_course_reviews_review FOREIGN KEY (review_id) REFERENCES reviews(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Self-referential: a course points at sibling courses.
CREATE TABLE IF NOT EXISTS course_related (
  course_id   CHAR(36) NOT NULL,
  related_id  CHAR(36) NOT NULL,
  position    SMALLINT NOT NULL,
  PRIMARY KEY (course_id, related_id),
  KEY idx_course_related_order (course_id, position),
  CONSTRAINT fk_course_related_course  FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT fk_course_related_related FOREIGN KEY (related_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
