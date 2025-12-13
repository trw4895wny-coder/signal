-- Create example users in auth.users (Note: In production, these would be created via Supabase auth)
-- For demo purposes, we'll create profiles directly with placeholder IDs

-- Insert example profiles
INSERT INTO profiles (id, email, full_name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'senior.engineer@example.com', 'Alex Chen'),
  ('00000000-0000-0000-0000-000000000002', 'founder@example.com', 'Jordan Martinez'),
  ('00000000-0000-0000-0000-000000000003', 'product.leader@example.com', 'Sam Taylor');

-- Passive Senior Engineer
-- Signals: Exploring AI/ML, Systems thinker, Open to mentoring
INSERT INTO user_signals (user_id, signal_id) VALUES
  ('00000000-0000-0000-0000-000000000001', 'learning-ai'),
  ('00000000-0000-0000-0000-000000000001', 'perspective-systems'),
  ('00000000-0000-0000-0000-000000000001', 'contribution-mentoring');

-- Founder
-- Signals: Hiring/building a team, Early-stage oriented, Advising startups
INSERT INTO user_signals (user_id, signal_id) VALUES
  ('00000000-0000-0000-0000-000000000002', 'availability-hiring'),
  ('00000000-0000-0000-0000-000000000002', 'perspective-earlystage'),
  ('00000000-0000-0000-0000-000000000002', 'contribution-advising');

-- Happy-but-Curious Product Leader
-- Signals: Exploring healthcare, Product-led mindset, Speaking or teaching
INSERT INTO user_signals (user_id, signal_id) VALUES
  ('00000000-0000-0000-0000-000000000003', 'learning-healthcare'),
  ('00000000-0000-0000-0000-000000000003', 'perspective-productled'),
  ('00000000-0000-0000-0000-000000000003', 'contribution-speaking');
