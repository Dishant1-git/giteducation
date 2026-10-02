-- Removes the banners module.
--
-- It managed a promotional strip the website never rendered: there was a
-- public endpoint and a scheduler behind it, but nothing on the site ever
-- fetched /public/banners, so a banner could be written, given artwork, given
-- a run of dates, published — and reach nobody. 020 had already narrowed the
-- placement menu for the same reason, removing "sidebar" because the site has
-- no sidebar to put one in.
--
-- The table is empty, so nothing is lost. Its two image columns pointed at
-- `media`, and media usage is derived from the foreign keys rather than a
-- hand-kept list, so dropping the table also takes banners out of the "is this
-- file still in use" count without anything else being edited.
--
-- The Team screen goes at the same time, but that is a UI change only: it was
-- a view onto `users`, which stays exactly as it is because it holds the
-- accounts that sign in. Accounts are now created with `npm run db:seed`.

DROP TABLE IF EXISTS banners;
