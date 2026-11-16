-- =====================================================
-- Nagar Mitra — Demonstration Seed Data
-- Migration 004: Sample Reports
-- =====================================================
-- IMPORTANT: This is DEMONSTRATION DATA for exhibition.
-- Replace the citizen_id below with an actual user UUID
-- after creating a test citizen account.
-- =====================================================

-- Instructions:
-- 1. First create a test citizen account via the app registration
-- 2. Find the user's UUID in Supabase Auth > Users
-- 3. Replace 'REPLACE_WITH_CITIZEN_UUID' below
-- 4. Run this script in Supabase SQL Editor

-- Example: If your test citizen UUID is 'abc123-def456-...'
-- Run: SET my.citizen_id = 'abc123-def456-...';

DO $$
DECLARE
  cid UUID := 'REPLACE_WITH_CITIZEN_UUID'; -- ← Replace this!
BEGIN

-- Water Problems
INSERT INTO reports (citizen_id, category, issue_type, title, description, locality, latitude, longitude, severity, status, created_at)
VALUES
(cid, 'water', 'Water leakage', '[DEMO] Water pipe burst on Station Road',
 '[DEMO] Large water pipe has burst near the main station road. Water is flooding the street and causing traffic disruption. The leak appears to be from the main supply line and has been ongoing since early morning.',
 'Station Area, Kalyan West', 19.2437, 73.1290, 'urgent', 'in_progress', now() - interval '3 days'),

(cid, 'water', 'Low water pressure', '[DEMO] Low water pressure in Khadakpada area',
 '[DEMO] Residents of Khadakpada have been experiencing very low water pressure for the past week. The water barely flows from the taps, making it difficult for daily household tasks.',
 'Khadakpada, Kalyan West', 19.2510, 73.1320, 'high', 'under_review', now() - interval '5 days'),

(cid, 'water', 'Water supply interruption', '[DEMO] No water supply for 2 days in Birla College area',
 '[DEMO] There has been no water supply in the Birla College neighbourhood for two consecutive days. Multiple families are affected and there has been no prior notice from the water department.',
 'Birla College Area, Kalyan', 19.2395, 73.1355, 'urgent', 'resolved', now() - interval '10 days');

-- Waste Management
INSERT INTO reports (citizen_id, category, issue_type, title, description, locality, latitude, longitude, severity, status, created_at)
VALUES
(cid, 'waste', 'Garbage accumulation', '[DEMO] Garbage piled up near Shivaji Chowk',
 '[DEMO] Garbage has been accumulating near the bus stop at Shivaji Chowk for over a week. The smell is unbearable and is attracting stray animals. No waste collection truck has visited this area recently.',
 'Shivaji Chowk, Kalyan', 19.2448, 73.1345, 'high', 'submitted', now() - interval '1 day'),

(cid, 'waste', 'Overflowing garbage bins', '[DEMO] Overflowing bins outside APMC Market',
 '[DEMO] All garbage bins outside the APMC Market are overflowing. Waste is spilling onto the road and creating unhygienic conditions for shoppers and vendors.',
 'APMC Market, Kalyan', 19.2420, 73.1310, 'normal', 'in_progress', now() - interval '4 days'),

(cid, 'waste', 'Illegal waste dumping', '[DEMO] Construction debris dumped near Netivali gardens',
 '[DEMO] Someone has illegally dumped a large amount of construction waste and debris near the Netivali garden area. This is blocking the pathway and creating dust problems.',
 'Netivali, Kalyan East', 19.2480, 73.1420, 'high', 'submitted', now() - interval '2 days');

-- Road Problems
INSERT INTO reports (citizen_id, category, issue_type, title, description, locality, latitude, longitude, severity, status, created_at)
VALUES
(cid, 'road', 'Potholes', '[DEMO] Large pothole on Titwala Road causing accidents',
 '[DEMO] A very large and deep pothole has formed on Titwala Road near the petrol pump. Multiple two-wheelers have been damaged and there was a near-accident yesterday evening. Urgent repair needed.',
 'Titwala Road, Kalyan', 19.2530, 73.1380, 'urgent', 'in_progress', now() - interval '7 days'),

(cid, 'road', 'Damaged roads', '[DEMO] Road surface completely damaged after rains',
 '[DEMO] The road connecting Chinchpada to the main highway has been severely damaged after the recent heavy rains. The entire surface has eroded and is making it dangerous for all vehicles.',
 'Chinchpada, Kalyan', 19.2560, 73.1440, 'high', 'under_review', now() - interval '6 days'),

(cid, 'road', 'Broken footpaths', '[DEMO] Broken footpath near Durgadi Fort entrance',
 '[DEMO] The footpath near the Durgadi Fort entrance area is broken and uneven. Elderly visitors and tourists are finding it difficult to walk safely. Several tiles are missing and sharp edges are exposed.',
 'Durgadi Fort Area, Kalyan', 19.2465, 73.1295, 'normal', 'resolved', now() - interval '15 days');

-- Electricity Problems
INSERT INTO reports (citizen_id, category, issue_type, title, description, locality, latitude, longitude, severity, status, created_at)
VALUES
(cid, 'electricity', 'Streetlights not working', '[DEMO] All streetlights off on Godrej Hill road',
 '[DEMO] All streetlights on the road leading to Godrej Hill residential area have stopped working. The entire stretch is pitch dark at night, creating safety concerns for pedestrians and vehicles.',
 'Godrej Hill, Kalyan', 19.2500, 73.1360, 'high', 'under_review', now() - interval '4 days'),

(cid, 'electricity', 'Exposed electrical infrastructure', '[DEMO] Exposed wires near Dombivli East junction',
 '[DEMO] Electrical wires are hanging dangerously low near the Dombivli East junction. Some wires appear to be exposed without insulation. This is a serious safety hazard especially during the rainy season.',
 'Dombivli East', 19.2180, 73.0880, 'urgent', 'in_progress', now() - interval '2 days'),

(cid, 'electricity', 'Streetlights not working', '[DEMO] Flickering streetlights in Kalyan East market',
 '[DEMO] Several streetlights in the Kalyan East market area are flickering constantly and some have stopped working completely. The market vendors are concerned about safety during evening hours.',
 'Kalyan East Market', 19.2410, 73.1400, 'normal', 'resolved', now() - interval '20 days');

-- Gutter & Drainage Problems
INSERT INTO reports (citizen_id, category, issue_type, title, description, locality, latitude, longitude, severity, status, created_at)
VALUES
(cid, 'drainage', 'Blocked gutters', '[DEMO] Main gutter blocked near Station Area',
 '[DEMO] The main drainage gutter near Kalyan railway station is completely blocked with solid waste and debris. During rains, the water overflows onto the road and floods the surrounding shops.',
 'Station Area, Kalyan', 19.2440, 73.1300, 'urgent', 'submitted', now() - interval '1 day'),

(cid, 'drainage', 'Waterlogging', '[DEMO] Severe waterlogging in Khadakpada after light rain',
 '[DEMO] Even after a light rain shower, the Khadakpada area experiences severe waterlogging. Water accumulates up to knee level in some stretches, disrupting daily life and damaging property.',
 'Khadakpada, Kalyan West', 19.2515, 73.1325, 'high', 'in_progress', now() - interval '8 days'),

(cid, 'drainage', 'Damaged drainage covers', '[DEMO] Missing drainage cover near Chinchpada school',
 '[DEMO] A drainage cover is completely missing near the Chinchpada school entrance. Children walking to school are at risk of falling into the open drain. A temporary barricade is urgently needed.',
 'Chinchpada, Kalyan', 19.2555, 73.1435, 'urgent', 'resolved', now() - interval '12 days'),

(cid, 'drainage', 'Overflowing drainage', '[DEMO] Drainage overflowing on Birla College road',
 '[DEMO] The drainage along Birla College road is overflowing with sewage water. The foul smell is unbearable and the stagnant water is becoming a breeding ground for mosquitoes.',
 'Birla College Area, Kalyan', 19.2400, 73.1350, 'high', 'rejected', now() - interval '25 days');

-- =====================================================
-- Insert status updates for reports that changed status
-- =====================================================

-- For resolved/in_progress/under_review reports, add history entries
INSERT INTO report_updates (report_id, old_status, new_status, admin_note, updated_by, created_at)
SELECT r.id, 'submitted', 'in_progress', 'Maintenance team has been dispatched to the area.', cid, r.created_at + interval '1 day'
FROM reports r WHERE r.title = '[DEMO] Water pipe burst on Station Road';

INSERT INTO report_updates (report_id, old_status, new_status, admin_note, updated_by, created_at)
SELECT r.id, 'submitted', 'under_review', 'Report received. Verifying the issue with local area office.', cid, r.created_at + interval '12 hours'
FROM reports r WHERE r.title = '[DEMO] Low water pressure in Khadakpada area';

INSERT INTO report_updates (report_id, old_status, new_status, admin_note, updated_by, created_at)
SELECT r.id, 'submitted', 'in_progress', 'Water tanker dispatched.', cid, r.created_at + interval '1 day'
FROM reports r WHERE r.title = '[DEMO] No water supply for 2 days in Birla College area';

INSERT INTO report_updates (report_id, old_status, new_status, admin_note, updated_by, created_at)
SELECT r.id, 'in_progress', 'resolved', 'Water supply has been restored. Pipeline repaired.', cid, r.created_at + interval '3 days'
FROM reports r WHERE r.title = '[DEMO] No water supply for 2 days in Birla College area';

INSERT INTO report_updates (report_id, old_status, new_status, admin_note, updated_by, created_at)
SELECT r.id, 'submitted', 'resolved', 'Footpath has been repaired by the municipal team.', cid, r.created_at + interval '5 days'
FROM reports r WHERE r.title = '[DEMO] Broken footpath near Durgadi Fort entrance';

INSERT INTO report_updates (report_id, old_status, new_status, admin_note, updated_by, created_at)
SELECT r.id, 'submitted', 'rejected', 'This area falls under a different municipal jurisdiction. Please contact the relevant authority.', cid, r.created_at + interval '2 days'
FROM reports r WHERE r.title = '[DEMO] Drainage overflowing on Birla College road';

END;
$$;

-- =====================================================
-- RESET DEMONSTRATION DATA
-- Run these commands to remove all demo data:
-- =====================================================
-- DELETE FROM report_updates WHERE report_id IN (SELECT id FROM reports WHERE title LIKE '[DEMO]%');
-- DELETE FROM reports WHERE title LIKE '[DEMO]%';
