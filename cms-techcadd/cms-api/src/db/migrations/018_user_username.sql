-- Sign-in by username instead of email.
--
-- The login form asks for one credential; making it the username means an
-- administrator's email address is no longer the thing typed into a public
-- form, and can be changed without changing how anyone signs in.
--
-- NULL-able rather than NOT NULL: a unique index in MySQL permits any number of
-- NULLs, so existing rows and any INSERT that predates this column keep working
-- instead of failing on a missing value. An account with no username simply
-- cannot sign in until one is set — which is the honest behaviour, and visible
-- rather than silent.
--
-- 60 characters, and its own column rather than reusing `name`: a display name
-- is edited freely ("TechCADD Team"), and an identifier that moved every time
-- someone corrected their name would lock them out.

ALTER TABLE users
  ADD COLUMN username VARCHAR(60) NULL AFTER name,
  ADD UNIQUE KEY uq_users_username (username);
