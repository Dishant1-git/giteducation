-- Undoes a repair that is no longer the right shape.
--
-- Earlier today `019_restore_branch_faculty_tables.sql` re-created branches,
-- faculty and the two course join tables, because the code on `main` still
-- queried them and the Courses module was failing on a missing
-- `course_branches`. That was the correct fix for that tree. It is the wrong
-- shape for this one: the modules have been retired in favour of Team, where
-- the people who publish have accounts rather than bios, and the site never
-- read any of it.
--
-- Why this file rather than re-running 023
-- ----------------------------------------
-- `023_drop_branches_and_faculty.sql` is already recorded in
-- schema_migrations, and the runner matches on filename — so it will never run
-- again on this database however many times it is applied elsewhere. A fresh
-- database gets the right result from 023 alone and this file is then a no-op,
-- which is why every statement below tolerates the table already being absent.
--
-- 019 itself is deleted from the tree in the same change, so a database built
-- from zero never creates these in the first place.
--
-- All eight are empty; nothing is lost. Foreign keys mean order matters, so
-- the children go before their parents.

DROP TABLE IF EXISTS course_branches;
DROP TABLE IF EXISTS course_gallery;
DROP TABLE IF EXISTS branch_photos;
DROP TABLE IF EXISTS branch_hours;
DROP TABLE IF EXISTS branch_phones;
DROP TABLE IF EXISTS faculty_expertise;

-- branches.manager_id -> faculty(id) and faculty.branch_id -> branches(id)
-- reference each other, so neither can be dropped while the other's key
-- stands. Dropping both in one statement lets InnoDB settle it in one go.
DROP TABLE IF EXISTS faculty, branches;
