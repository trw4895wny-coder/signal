-- Insert signal categories
INSERT INTO signal_categories (id, name, description, max_selections, display_order) VALUES
  ('availability', 'Availability', 'Time-bound, explicit availability signals', 2, 1),
  ('learning', 'Learning & Interest', 'Areas you are currently exploring', 99, 2),
  ('contribution', 'Contribution', 'Ways you are open to helping others', 99, 3),
  ('perspective', 'Perspective & Work Style', 'How you work and think', 3, 4);

-- Insert availability signals
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('availability-fulltime', 'availability', 'Open to new full-time roles', 'Actively seeking full-time employment opportunities', 30, 1),
  ('availability-contract', 'availability', 'Open to contract / consulting work', 'Available for contract or consulting engagements', 30, 2),
  ('availability-hiring', 'availability', 'Hiring / building a team', 'Currently recruiting and building a team', 30, 3),
  ('availability-cofounder', 'availability', 'Looking for a co-founder', 'Seeking a co-founder for a new venture', 30, 4),
  ('availability-exploring', 'availability', 'Exploring next opportunity (non-urgent)', 'Open to conversations but not actively searching', 30, 5);

-- Insert learning & interest signals
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('learning-ai', 'learning', 'AI / machine learning', 'Exploring artificial intelligence and machine learning', 90, 1),
  ('learning-devtools', 'learning', 'Developer tooling & platforms', 'Interested in developer tools and platform engineering', 90, 2),
  ('learning-product', 'learning', 'Product strategy & discovery', 'Learning about product strategy and discovery processes', 90, 3),
  ('learning-data', 'learning', 'Data & analytics', 'Exploring data analysis and analytics', 90, 4),
  ('learning-security', 'learning', 'Security & privacy', 'Interested in security and privacy technologies', 90, 5),
  ('learning-climate', 'learning', 'Climate / sustainability', 'Exploring climate tech and sustainability solutions', 90, 6),
  ('learning-healthcare', 'learning', 'Healthcare / life sciences', 'Learning about healthcare and life sciences', 90, 7);

-- Insert contribution signals
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('contribution-mentoring', 'contribution', 'Mentoring', 'Open to mentoring individuals in my areas of expertise', 90, 1),
  ('contribution-advising', 'contribution', 'Advising startups', 'Available to advise early-stage startups', 90, 2),
  ('contribution-reviewing', 'contribution', 'Reviewing work (design, code, docs)', 'Happy to review design, code, or documentation', 90, 3),
  ('contribution-speaking', 'contribution', 'Speaking or teaching', 'Open to speaking engagements or teaching opportunities', 90, 4),
  ('contribution-sharing', 'contribution', 'Informal knowledge sharing', 'Available for informal knowledge sharing and conversations', 90, 5);

-- Insert perspective & work style signals
INSERT INTO signals (id, category_id, label, description, expiration_days, display_order) VALUES
  ('perspective-builder', 'perspective', 'Builder / hands-on', 'I prefer to build and work hands-on with code/design', NULL, 1),
  ('perspective-systems', 'perspective', 'Systems thinker', 'I think in terms of systems and architecture', NULL, 2),
  ('perspective-earlystage', 'perspective', 'Early-stage oriented', 'I thrive in early-stage, ambiguous environments', NULL, 3),
  ('perspective-enterprise', 'perspective', 'Enterprise-scale experience', 'I have experience working at enterprise scale', NULL, 4),
  ('perspective-productled', 'perspective', 'Product-led mindset', 'I approach problems with a product-first mentality', NULL, 5),
  ('perspective-researchfirst', 'perspective', 'Research-first mindset', 'I prefer to research deeply before making decisions', NULL, 6),
  ('perspective-adaptable', 'perspective', 'Strong opinions, loosely held', 'I have strong views but remain open to new information', NULL, 7);
