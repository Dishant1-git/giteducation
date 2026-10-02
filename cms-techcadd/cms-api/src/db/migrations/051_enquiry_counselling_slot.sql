-- The day and time a visitor asked for a virtual counselling call.
--
-- The website's booking dialog collects both. Kept as columns rather than
-- folded into `message` so the team can sort and filter on the date, and move
-- a call without editing what the visitor wrote.
--
-- The slot is the label the visitor picked ("11:30 AM – 12:00 PM"), not a
-- TIME: the slots on offer are the website's to change, and a booking should
-- keep reading the way it did when it was made.

ALTER TABLE enquiries
  ADD COLUMN preferred_date DATE        NULL AFTER follow_up_date,
  ADD COLUMN preferred_slot VARCHAR(40) NULL AFTER preferred_date;

-- The list filters on which form an enquiry came from.
CREATE INDEX idx_enquiries_form_type ON enquiries (form_type);
