-- The outcome a review card leads with — "Placed as MERN Developer".
--
-- The website has always rendered this pill; it was carried in the site's
-- bundled review copy and lost the moment reviews moved into the CMS, because
-- there was nowhere to put it. The card guards on it, so the pill simply
-- stopped appearing — a silent content regression rather than a broken page,
-- which is why it survived this long.
--
-- Nullable: a review is complete without one, and most walk-in reviews have
-- nothing to say here.
ALTER TABLE reviews
  ADD COLUMN badge VARCHAR(80) NULL AFTER course_name;
