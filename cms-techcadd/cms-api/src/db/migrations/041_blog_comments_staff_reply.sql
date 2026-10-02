-- Staff replies to a comment thread.
--
-- A moderator's reply is a comment like any other — same table, same
-- threading — but it did not come from a stranger through the public form;
-- it was written by someone signed into the CMS, under their own name.
-- `is_staff` is what lets the website give it a distinct "Team" badge, and
-- what lets the reply endpoint skip the moderation queue: a comment an
-- authenticated admin just wrote does not need that same admin's approval.
ALTER TABLE blog_comments
  ADD COLUMN is_staff BOOLEAN NOT NULL DEFAULT FALSE AFTER author_email;
