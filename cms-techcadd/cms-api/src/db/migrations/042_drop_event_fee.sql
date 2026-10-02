-- Takes the fee off the event record.
--
-- Dropped at the office's request, for the same reason 017 took it off
-- courses: what an event costs is a conversation, not a field, and a figure
-- printed on a page is one nobody remembers to change.
--
-- A new migration rather than an edit to 041, even though events shipped in
-- the same batch and no deployment has run either yet. The runner records
-- filenames, so amending an applied migration leaves the database it already
-- built holding a column the migration set no longer describes — a divergence
-- that shows up much later, as a column that exists on one machine and not
-- another. Forward-only is the rule here and it costs nothing to keep.

ALTER TABLE events DROP COLUMN fee;
