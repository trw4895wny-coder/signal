-- Expand signal categories to support universal talent marketplace
-- This migration adds categories beyond tech for hospitality, trades, healthcare, creative, etc.

-- Add new signal categories
INSERT INTO signal_categories (id, name, description, max_selections, display_order) VALUES
  ('hospitality', 'Hospitality & Service', 'Hotel, restaurant, cleaning, and customer service roles', 99, 5),
  ('trades', 'Skilled Trades', 'Plumbing, electrical, carpentry, HVAC, and construction', 99, 6),
  ('healthcare', 'Healthcare & Wellness', 'Nursing, caregiving, therapy, and health services', 99, 7),
  ('creative', 'Creative & Design', 'Graphic design, photography, writing, and content creation', 99, 8),
  ('professional', 'Professional Services', 'Accounting, legal, HR, marketing, and consulting', 99, 9),
  ('education', 'Education & Training', 'Teaching, tutoring, coaching, and training', 99, 10),
  ('transportation', 'Transportation & Logistics', 'Driving, delivery, moving, and logistics', 99, 11),
  ('retail', 'Retail & Sales', 'Sales, customer service, merchandising, and retail management', 99, 12)
ON CONFLICT (id) DO NOTHING;

-- Add signals for Hospitality & Service
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('housekeeping', 'hospitality', 'Housekeeping', 'Cleaning and maintaining hotel rooms, homes, or facilities', NULL, 1),
  ('cooking', 'hospitality', 'Cooking', 'Food preparation and culinary work', NULL, 2),
  ('front-desk', 'hospitality', 'Front Desk', 'Reception, check-in, and guest services', NULL, 3),
  ('bartending', 'hospitality', 'Bartending', 'Bar service and beverage preparation', NULL, 4),
  ('waiting-tables', 'hospitality', 'Waiting Tables', 'Restaurant server and table service', NULL, 5),
  ('event-planning', 'hospitality', 'Event Planning', 'Organizing and coordinating events', NULL, 6),
  ('catering', 'hospitality', 'Catering', 'Food service for events and functions', NULL, 7),
  ('janitorial', 'hospitality', 'Janitorial', 'Building cleaning and maintenance', NULL, 8)
ON CONFLICT (id) DO NOTHING;

-- Add signals for Skilled Trades
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('plumbing', 'trades', 'Plumbing', 'Installing and repairing water systems and fixtures', NULL, 1),
  ('electrical', 'trades', 'Electrical', 'Electrical wiring, installation, and repair', NULL, 2),
  ('carpentry', 'trades', 'Carpentry', 'Woodworking, framing, and construction', NULL, 3),
  ('hvac', 'trades', 'HVAC', 'Heating, ventilation, and air conditioning', NULL, 4),
  ('painting', 'trades', 'Painting', 'Interior and exterior painting', NULL, 5),
  ('roofing', 'trades', 'Roofing', 'Roof installation and repair', NULL, 6),
  ('welding', 'trades', 'Welding', 'Metal joining and fabrication', NULL, 7),
  ('masonry', 'trades', 'Masonry', 'Brickwork, stonework, and concrete', NULL, 8),
  ('landscaping', 'trades', 'Landscaping', 'Lawn care, gardening, and outdoor maintenance', NULL, 9)
ON CONFLICT (id) DO NOTHING;

-- Add signals for Healthcare & Wellness
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('nursing', 'healthcare', 'Nursing', 'Registered nurse, LPN, and patient care', NULL, 1),
  ('caregiving', 'healthcare', 'Caregiving', 'Elder care, disability support, and home health', NULL, 2),
  ('physical-therapy', 'healthcare', 'Physical Therapy', 'Rehabilitation and physical therapy', NULL, 3),
  ('dental', 'healthcare', 'Dental', 'Dental hygiene and dental assistance', NULL, 4),
  ('medical-assistant', 'healthcare', 'Medical Assistant', 'Clinical and administrative medical support', NULL, 5),
  ('pharmacy', 'healthcare', 'Pharmacy', 'Pharmaceutical services and medication management', NULL, 6),
  ('mental-health', 'healthcare', 'Mental Health', 'Counseling, therapy, and mental health support', NULL, 7),
  ('fitness', 'healthcare', 'Fitness Training', 'Personal training and fitness coaching', NULL, 8)
ON CONFLICT (id) DO NOTHING;

-- Add signals for Creative & Design
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('graphic-design', 'creative', 'Graphic Design', 'Visual design, branding, and graphics', NULL, 1),
  ('photography', 'creative', 'Photography', 'Photo shoots, editing, and visual content', NULL, 2),
  ('videography', 'creative', 'Videography', 'Video production and editing', NULL, 3),
  ('writing', 'creative', 'Writing', 'Content writing, copywriting, and editing', NULL, 4),
  ('illustration', 'creative', 'Illustration', 'Drawing, digital art, and illustration', NULL, 5),
  ('ui-ux-design', 'creative', 'UI/UX Design', 'User interface and experience design', NULL, 6),
  ('animation', 'creative', 'Animation', 'Motion graphics and animation', NULL, 7),
  ('music', 'creative', 'Music', 'Music production, performance, and composition', NULL, 8)
ON CONFLICT (id) DO NOTHING;

-- Add signals for Professional Services
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('accounting', 'professional', 'Accounting', 'Bookkeeping, tax prep, and financial services', NULL, 1),
  ('legal', 'professional', 'Legal', 'Legal services, paralegal work, and consulting', NULL, 2),
  ('marketing', 'professional', 'Marketing', 'Digital marketing, SEO, and advertising', NULL, 3),
  ('hr', 'professional', 'Human Resources', 'Recruiting, HR management, and employee relations', NULL, 4),
  ('consulting', 'professional', 'Consulting', 'Business consulting and advisory', NULL, 5),
  ('project-management', 'professional', 'Project Management', 'Planning, coordination, and execution', NULL, 6),
  ('sales', 'professional', 'Sales', 'B2B/B2C sales and business development', NULL, 7),
  ('admin', 'professional', 'Administration', 'Office administration and support', NULL, 8)
ON CONFLICT (id) DO NOTHING;

-- Add signals for Education & Training
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('teaching', 'education', 'Teaching', 'K-12 teaching and classroom instruction', NULL, 1),
  ('tutoring', 'education', 'Tutoring', 'One-on-one academic tutoring', NULL, 2),
  ('coaching', 'education', 'Coaching', 'Life coaching, career coaching, and mentoring', NULL, 3),
  ('training', 'education', 'Training', 'Corporate training and skill development', NULL, 4),
  ('childcare', 'education', 'Childcare', 'Daycare, nanny, and child supervision', NULL, 5),
  ('language', 'education', 'Language Teaching', 'ESL, foreign language instruction', NULL, 6)
ON CONFLICT (id) DO NOTHING;

-- Add signals for Transportation & Logistics
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('driving', 'transportation', 'Driving', 'Professional driving and transportation', NULL, 1),
  ('delivery', 'transportation', 'Delivery', 'Package and food delivery services', NULL, 2),
  ('moving', 'transportation', 'Moving', 'Furniture moving and relocation', NULL, 3),
  ('logistics', 'transportation', 'Logistics', 'Supply chain and logistics coordination', NULL, 4),
  ('warehouse', 'transportation', 'Warehouse', 'Warehouse operations and inventory', NULL, 5)
ON CONFLICT (id) DO NOTHING;

-- Add signals for Retail & Sales
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('retail-sales', 'retail', 'Retail Sales', 'In-store sales and customer service', NULL, 1),
  ('cashier', 'retail', 'Cashier', 'Point of sale and cash handling', NULL, 2),
  ('merchandising', 'retail', 'Merchandising', 'Product display and inventory management', NULL, 3),
  ('retail-management', 'retail', 'Retail Management', 'Store management and operations', NULL, 4),
  ('customer-service', 'retail', 'Customer Service', 'Customer support and assistance', NULL, 5)
ON CONFLICT (id) DO NOTHING;
