-- Migration: Seed sample profiles for testing
-- Creates 30 profiles: 10 IT/ML/AI, 10 Consulting, 10 Hospitality

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert auth users and profiles
-- Note: In production, use Supabase Auth API. This is for testing only.

-- ============================================
-- IT/ML/AI INDUSTRY PROFILES (10)
-- ============================================

-- 1. Sarah Chen - ML Engineer
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'sarah.chen@neuraltechai.com',
  crypt('Sarah123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'sarah.chen@neuraltechai.com',
  'Sarah Chen',
  'Senior ML Engineer at NeuralTech AI',
  'Building scalable ML systems for computer vision. Previously at Google Brain. Passionate about making AI accessible.',
  'San Francisco, CA',
  'https://sarahchen.dev',
  'https://i.pravatar.cc/150?u=sarah.chen@neuraltechai.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'learning-ai', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111111', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111111', 'perspective-builder', NOW(), NULL),
  ('11111111-1111-1111-1111-111111111111', 'perspective-systems', NOW(), NULL);

-- 2. Marcus Johnson - Data Scientist
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '11111111-1111-1111-1111-111111111112',
  'marcus.j@dataverse.io',
  crypt('Marcus123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '11111111-1111-1111-1111-111111111112',
  'marcus.j@dataverse.io',
  'Marcus Johnson',
  'Lead Data Scientist at DataVerse',
  'Turning data into insights. Specialized in predictive analytics and NLP.',
  'New York, NY',
  NULL,
  'https://i.pravatar.cc/150?u=marcus.j@dataverse.io'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('11111111-1111-1111-1111-111111111112', 'learning-data', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111112', 'learning-ai', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111112', 'availability-contract', NOW(), NOW() + INTERVAL '30 days'),
  ('11111111-1111-1111-1111-111111111112', 'contribution-speaking', NOW(), NOW() + INTERVAL '90 days');

-- 3. Priya Patel - AI Researcher
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '11111111-1111-1111-1111-111111111113',
  'priya.patel@openai-research.org',
  crypt('Priya123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '11111111-1111-1111-1111-111111111113',
  'priya.patel@openai-research.org',
  'Priya Patel',
  'AI Research Scientist at OpenAI Research Lab',
  'PhD in ML from Stanford. Research focus on transformer architectures and LLMs. Published at NeurIPS, ICML.',
  'Seattle, WA',
  'https://priyapatel.ai',
  'https://i.pravatar.cc/150?u=priya.patel@openai-research.org'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('11111111-1111-1111-1111-111111111113', 'learning-ai', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111113', 'contribution-speaking', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111113', 'perspective-researchfirst', NOW(), NULL);

-- 4. Alex Rivera - Platform Engineer
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '11111111-1111-1111-1111-111111111114',
  'alex.rivera@cloudscale.tech',
  crypt('Alex123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '11111111-1111-1111-1111-111111111114',
  'alex.rivera@cloudscale.tech',
  'Alex Rivera',
  'Staff Platform Engineer at CloudScale',
  'Building developer platforms at scale. K8s, AWS, infrastructure as code.',
  'Austin, TX',
  'https://alexrivera.io',
  'https://i.pravatar.cc/150?u=alex.rivera@cloudscale.tech'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('11111111-1111-1111-1111-111111111114', 'learning-devtools', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111114', 'perspective-systems', NOW(), NULL),
  ('11111111-1111-1111-1111-111111111114', 'perspective-enterprise', NOW(), NULL),
  ('11111111-1111-1111-1111-111111111114', 'contribution-reviewing', NOW(), NOW() + INTERVAL '90 days');

-- 5. Emily Zhang - ML Product Manager
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '11111111-1111-1111-1111-111111111115',
  'emily.zhang@mlproducts.ai',
  crypt('Emily123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '11111111-1111-1111-1111-111111111115',
  'emily.zhang@mlproducts.ai',
  'Emily Zhang',
  'ML Product Manager at AI Products Inc',
  'Shipping ML products that users love.',
  'Los Angeles, CA',
  NULL,
  'https://i.pravatar.cc/150?u=emily.zhang@mlproducts.ai'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('11111111-1111-1111-1111-111111111115', 'learning-product', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111115', 'learning-ai', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111115', 'perspective-productled', NOW(), NULL),
  ('11111111-1111-1111-1111-111111111115', 'availability-exploring', NOW(), NOW() + INTERVAL '30 days');

-- 6. James Kim - Security Engineer
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '11111111-1111-1111-1111-111111111116',
  'james.kim@securetech.io',
  crypt('James123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '11111111-1111-1111-1111-111111111116',
  'james.kim@securetech.io',
  'James Kim',
  'Principal Security Engineer at SecureTech',
  'Keeping systems secure and compliant. CISSP certified. Former pentester turned defender.',
  'Boston, MA',
  'https://jameskim.security',
  'https://i.pravatar.cc/150?u=james.kim@securetech.io'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('11111111-1111-1111-1111-111111111116', 'learning-security', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111116', 'contribution-advising', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111116', 'perspective-builder', NOW(), NULL);

-- 7. Olivia Martinez - DevOps Lead
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '11111111-1111-1111-1111-111111111117',
  'olivia.m@devopscloud.com',
  crypt('Olivia123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '11111111-1111-1111-1111-111111111117',
  'olivia.m@devopscloud.com',
  'Olivia Martinez',
  'DevOps Team Lead at CloudOps Solutions',
  'Automating all the things. CI/CD, monitoring, and infrastructure.',
  'Denver, CO',
  NULL,
  'https://i.pravatar.cc/150?u=olivia.m@devopscloud.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('11111111-1111-1111-1111-111111111117', 'learning-devtools', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111117', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111117', 'perspective-systems', NOW(), NULL),
  ('11111111-1111-1111-1111-111111111117', 'availability-hiring', NOW(), NOW() + INTERVAL '30 days');

-- 8. David Lee - Full Stack Developer
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '11111111-1111-1111-1111-111111111118',
  'david.lee@webstartup.tech',
  crypt('David123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '11111111-1111-1111-1111-111111111118',
  'david.lee@webstartup.tech',
  'David Lee',
  'Senior Full Stack Developer at Web Startup',
  'Building modern web apps with React, Node, and PostgreSQL.',
  'Portland, OR',
  'https://davidlee.dev',
  'https://i.pravatar.cc/150?u=david.lee@webstartup.tech'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('11111111-1111-1111-1111-111111111118', 'learning-devtools', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111118', 'perspective-builder', NOW(), NULL),
  ('11111111-1111-1111-1111-111111111118', 'availability-cofounder', NOW(), NOW() + INTERVAL '30 days');

-- 9. Rachel Brown - AI Ethics Researcher
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '11111111-1111-1111-1111-111111111119',
  'rachel.brown@aiethics.org',
  crypt('Rachel123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '11111111-1111-1111-1111-111111111119',
  'rachel.brown@aiethics.org',
  'Rachel Brown',
  'AI Ethics Researcher at AI Ethics Institute',
  'Ensuring AI is developed responsibly. Focus on fairness, transparency, and accountability in ML systems.',
  'Washington, DC',
  'https://rachelbrown.org',
  'https://i.pravatar.cc/150?u=rachel.brown@aiethics.org'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('11111111-1111-1111-1111-111111111119', 'learning-ai', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111119', 'contribution-speaking', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111119', 'contribution-advising', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111119', 'perspective-researchfirst', NOW(), NULL);

-- 10. Tom Wilson - Tech Lead
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '11111111-1111-1111-1111-111111111120',
  'tom.wilson@techcorp.com',
  crypt('Tom123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '11111111-1111-1111-1111-111111111120',
  'tom.wilson@techcorp.com',
  'Tom Wilson',
  'Engineering Tech Lead at TechCorp',
  'Leading distributed teams building scalable systems.',
  'Chicago, IL',
  NULL,
  'https://i.pravatar.cc/150?u=tom.wilson@techcorp.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('11111111-1111-1111-1111-111111111120', 'perspective-systems', NOW(), NULL),
  ('11111111-1111-1111-1111-111111111120', 'perspective-enterprise', NOW(), NULL),
  ('11111111-1111-1111-1111-111111111120', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111120', 'availability-exploring', NOW(), NOW() + INTERVAL '30 days');

-- ============================================
-- CONSULTING INDUSTRY PROFILES (10)
-- ============================================

-- 11. Michael Chen - Strategy Consultant
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '22222222-2222-2222-2222-222222222221',
  'michael.chen@strategyadvisors.com',
  crypt('Michael123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '22222222-2222-2222-2222-222222222221',
  'michael.chen@strategyadvisors.com',
  'Michael Chen',
  'Senior Strategy Consultant at McKinley Advisors',
  'Helping Fortune 500 companies navigate digital transformation. MBA from Wharton. 10+ years in tech consulting.',
  'New York, NY',
  'https://michaelchen.consulting',
  'https://i.pravatar.cc/150?u=michael.chen@strategyadvisors.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('22222222-2222-2222-2222-222222222221', 'contribution-advising', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222221', 'availability-contract', NOW(), NOW() + INTERVAL '30 days'),
  ('22222222-2222-2222-2222-222222222221', 'perspective-enterprise', NOW(), NULL),
  ('22222222-2222-2222-2222-222222222221', 'learning-product', NOW(), NOW() + INTERVAL '90 days');

-- 12. Jennifer Lopez - Management Consultant
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'jennifer.lopez@bainpartners.com',
  crypt('Jennifer123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'jennifer.lopez@bainpartners.com',
  'Jennifer Lopez',
  'Principal at Bain Partners',
  'Specializing in healthcare and life sciences consulting.',
  'Boston, MA',
  NULL,
  'https://i.pravatar.cc/150?u=jennifer.lopez@bainpartners.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'learning-healthcare', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222222', 'contribution-advising', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222222', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222222', 'perspective-adaptable', NOW(), NULL);

-- 13. Robert Anderson - Business Advisor
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '22222222-2222-2222-2222-222222222223',
  'robert.anderson@advisorygroup.co',
  crypt('Robert123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '22222222-2222-2222-2222-222222222223',
  'robert.anderson@advisorygroup.co',
  'Robert Anderson',
  'Independent Business Advisor',
  'Advising early and growth-stage startups on scaling operations, fundraising, and go-to-market strategy.',
  'San Francisco, CA',
  'https://robertanderson.co',
  'https://i.pravatar.cc/150?u=robert.anderson@advisorygroup.co'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('22222222-2222-2222-2222-222222222223', 'contribution-advising', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222223', 'perspective-earlystage', NOW(), NULL),
  ('22222222-2222-2222-2222-222222222223', 'availability-contract', NOW(), NOW() + INTERVAL '30 days');

-- 14. Lisa Wang - Change Management
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '22222222-2222-2222-2222-222222222224',
  'lisa.wang@changeexperts.com',
  crypt('Lisa123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '22222222-2222-2222-2222-222222222224',
  'lisa.wang@changeexperts.com',
  'Lisa Wang',
  'Change Management Consultant at Transformation Partners',
  'Helping organizations navigate major transformations.',
  'Atlanta, GA',
  NULL,
  'https://i.pravatar.cc/150?u=lisa.wang@changeexperts.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('22222222-2222-2222-2222-222222222224', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222224', 'contribution-speaking', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222224', 'perspective-enterprise', NOW(), NULL),
  ('22222222-2222-2222-2222-222222222224', 'perspective-adaptable', NOW(), NULL);

-- 15. Kevin O'Brien - Operations Consultant
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '22222222-2222-2222-2222-222222222225',
  'kevin.obrien@opsconsulting.io',
  crypt('Kevin123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '22222222-2222-2222-2222-222222222225',
  'kevin.obrien@opsconsulting.io',
  'Kevin O''Brien',
  'Operations Consultant at Efficiency Partners',
  'Streamlining processes and improving operational efficiency for mid-market companies.',
  'Dallas, TX',
  'https://kevinobrien.consulting',
  'https://i.pravatar.cc/150?u=kevin.obrien@opsconsulting.io'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('22222222-2222-2222-2222-222222222225', 'contribution-advising', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222225', 'perspective-systems', NOW(), NULL),
  ('22222222-2222-2222-2222-222222222225', 'learning-data', NOW(), NOW() + INTERVAL '90 days');

-- 16. Amanda Taylor - HR Consultant
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '22222222-2222-2222-2222-222222222226',
  'amanda.taylor@talentconsulting.com',
  crypt('Amanda123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '22222222-2222-2222-2222-222222222226',
  'amanda.taylor@talentconsulting.com',
  'Amanda Taylor',
  'HR Strategy Consultant at TalentFirst',
  'Building high-performing teams and culture. SHRM-SCP certified.',
  'Miami, FL',
  NULL,
  'https://i.pravatar.cc/150?u=amanda.taylor@talentconsulting.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('22222222-2222-2222-2222-222222222226', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222226', 'contribution-advising', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222226', 'availability-contract', NOW(), NOW() + INTERVAL '30 days');

-- 17. Daniel Kim - Financial Advisor
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '22222222-2222-2222-2222-222222222227',
  'daniel.kim@financeadvisors.co',
  crypt('Daniel123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '22222222-2222-2222-2222-222222222227',
  'daniel.kim@financeadvisors.co',
  'Daniel Kim',
  'Senior Financial Consultant at Capital Partners',
  'CFO services for startups and growth companies. CPA and MBA.',
  'Seattle, WA',
  'https://danielkim.finance',
  'https://i.pravatar.cc/150?u=daniel.kim@financeadvisors.co'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('22222222-2222-2222-2222-222222222227', 'contribution-advising', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222227', 'perspective-earlystage', NOW(), NULL),
  ('22222222-2222-2222-2222-222222222227', 'perspective-adaptable', NOW(), NULL),
  ('22222222-2222-2222-2222-222222222227', 'availability-contract', NOW(), NOW() + INTERVAL '30 days');

-- 18. Sophie Martin - Sustainability Consultant
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '22222222-2222-2222-2222-222222222228',
  'sophie.martin@greenconsulting.org',
  crypt('Sophie123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '22222222-2222-2222-2222-222222222228',
  'sophie.martin@greenconsulting.org',
  'Sophie Martin',
  'Sustainability Consultant at EcoStrategy Partners',
  'Helping companies achieve net-zero goals and build sustainable supply chains.',
  'San Diego, CA',
  'https://sophiemartin.eco',
  'https://i.pravatar.cc/150?u=sophie.martin@greenconsulting.org'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('22222222-2222-2222-2222-222222222228', 'learning-climate', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222228', 'contribution-advising', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222228', 'contribution-speaking', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222228', 'perspective-researchfirst', NOW(), NULL);

-- 19. Chris Thompson - Tech Consultant
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '22222222-2222-2222-2222-222222222229',
  'chris.thompson@techconsultants.io',
  crypt('Chris123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '22222222-2222-2222-2222-222222222229',
  'chris.thompson@techconsultants.io',
  'Chris Thompson',
  'Technology Consultant at Digital Solutions Group',
  'Bridging business and technology. Cloud architecture and digital transformation.',
  'Phoenix, AZ',
  NULL,
  'https://i.pravatar.cc/150?u=chris.thompson@techconsultants.io'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('22222222-2222-2222-2222-222222222229', 'learning-devtools', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222229', 'contribution-advising', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222229', 'perspective-enterprise', NOW(), NULL);

-- 20. Maria Rodriguez - Product Consultant
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '22222222-2222-2222-2222-222222222230',
  'maria.rodriguez@productexperts.com',
  crypt('Maria123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '22222222-2222-2222-2222-222222222230',
  'maria.rodriguez@productexperts.com',
  'Maria Rodriguez',
  'Product Strategy Consultant at Innovation Labs',
  'Former CPO at SaaS unicorn. Helping companies build products users love.',
  'Austin, TX',
  'https://mariarodriguez.pm',
  'https://i.pravatar.cc/150?u=maria.rodriguez@productexperts.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('22222222-2222-2222-2222-222222222230', 'learning-product', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222230', 'contribution-advising', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222230', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222230', 'perspective-productled', NOW(), NULL);

-- ============================================
-- HOSPITALITY INDUSTRY PROFILES (10)
-- ============================================

-- 21. Brian Foster - Hotel Manager
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '33333333-3333-3333-3333-333333333331',
  'brian.foster@grandhotelgroup.com',
  crypt('Brian123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '33333333-3333-3333-3333-333333333331',
  'brian.foster@grandhotelgroup.com',
  'Brian Foster',
  'General Manager at Grand Hotel Group',
  'Leading 5-star hotel operations in downtown Chicago. 15+ years in luxury hospitality. Guest satisfaction is my passion.',
  'Chicago, IL',
  NULL,
  'https://i.pravatar.cc/150?u=brian.foster@grandhotelgroup.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333331', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('33333333-3333-3333-3333-333333333331', 'perspective-enterprise', NOW(), NULL),
  ('33333333-3333-3333-3333-333333333331', 'availability-hiring', NOW(), NOW() + INTERVAL '30 days');

-- 22. Jessica Miller - Restaurant Manager
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '33333333-3333-3333-3333-333333333332',
  'jessica.miller@finediningco.com',
  crypt('Jessica123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '33333333-3333-3333-3333-333333333332',
  'jessica.miller@finediningco.com',
  'Jessica Miller',
  'Restaurant Operations Manager at Culinary Excellence Group',
  'Managing multi-location fine dining restaurants.',
  'New York, NY',
  NULL,
  'https://i.pravatar.cc/150?u=jessica.miller@finediningco.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333332', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('33333333-3333-3333-3333-333333333332', 'perspective-productled', NOW(), NULL),
  ('33333333-3333-3333-3333-333333333332', 'availability-fulltime', NOW(), NOW() + INTERVAL '30 days');

-- 23. Anthony Garcia - Hospitality Director
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'anthony.garcia@resortgroup.com',
  crypt('Anthony123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'anthony.garcia@resortgroup.com',
  'Anthony Garcia',
  'Director of Hospitality at Luxury Resort Group',
  'Overseeing guest experience across 12 luxury properties. Certified Hospitality Administrator.',
  'Miami, FL',
  'https://anthonygarcia.hospitality',
  'https://i.pravatar.cc/150?u=anthony.garcia@resortgroup.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'perspective-enterprise', NOW(), NULL),
  ('33333333-3333-3333-3333-333333333333', 'contribution-sharing', NOW(), NOW() + INTERVAL '90 days'),
  ('33333333-3333-3333-3333-333333333333', 'availability-exploring', NOW(), NOW() + INTERVAL '30 days');

-- 24. Nicole White - Event Coordinator
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '33333333-3333-3333-3333-333333333334',
  'nicole.white@eventspro.com',
  crypt('Nicole123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '33333333-3333-3333-3333-333333333334',
  'nicole.white@eventspro.com',
  'Nicole White',
  'Senior Event Coordinator at Premier Events',
  'Creating unforgettable corporate events and weddings.',
  'Las Vegas, NV',
  NULL,
  'https://i.pravatar.cc/150?u=nicole.white@eventspro.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333334', 'perspective-productled', NOW(), NULL),
  ('33333333-3333-3333-3333-333333333334', 'contribution-sharing', NOW(), NOW() + INTERVAL '90 days'),
  ('33333333-3333-3333-3333-333333333334', 'availability-contract', NOW(), NOW() + INTERVAL '30 days');

-- 25. Carlos Sanchez - Chef & Culinary Director
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '33333333-3333-3333-3333-333333333335',
  'carlos.sanchez@culinaryventures.com',
  crypt('Carlos123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '33333333-3333-3333-3333-333333333335',
  'carlos.sanchez@culinaryventures.com',
  'Carlos Sanchez',
  'Executive Chef & Culinary Director',
  'Award-winning chef specializing in farm-to-table cuisine. James Beard nominee. Leading kitchen teams at 3 restaurants.',
  'Los Angeles, CA',
  'https://carlossanchez.chef',
  'https://i.pravatar.cc/150?u=carlos.sanchez@culinaryventures.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333335', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('33333333-3333-3333-3333-333333333335', 'perspective-builder', NOW(), NULL),
  ('33333333-3333-3333-3333-333333333335', 'availability-cofounder', NOW(), NOW() + INTERVAL '30 days');

-- 26. Sarah Johnson - F&B Manager
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '33333333-3333-3333-3333-333333333336',
  'sarah.johnson@hotelchain.com',
  crypt('Sarah123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '33333333-3333-3333-3333-333333333336',
  'sarah.johnson@hotelchain.com',
  'Sarah Johnson',
  'Food & Beverage Manager at Global Hotel Chain',
  'Managing F&B operations for 500-room luxury property.',
  'Orlando, FL',
  NULL,
  'https://i.pravatar.cc/150?u=sarah.johnson@hotelchain.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333336', 'perspective-enterprise', NOW(), NULL),
  ('33333333-3333-3333-3333-333333333336', 'contribution-sharing', NOW(), NOW() + INTERVAL '90 days'),
  ('33333333-3333-3333-3333-333333333336', 'availability-fulltime', NOW(), NOW() + INTERVAL '30 days');

-- 27. Mark Davis - Tourism Manager
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '33333333-3333-3333-3333-333333333337',
  'mark.davis@tourismboard.org',
  crypt('Mark123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '33333333-3333-3333-3333-333333333337',
  'mark.davis@tourismboard.org',
  'Mark Davis',
  'Tourism Development Manager at City Tourism Board',
  'Promoting local tourism and supporting hospitality businesses.',
  'San Antonio, TX',
  'https://markdavis.tourism',
  'https://i.pravatar.cc/150?u=mark.davis@tourismboard.org'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333337', 'contribution-sharing', NOW(), NOW() + INTERVAL '90 days'),
  ('33333333-3333-3333-3333-333333333337', 'perspective-adaptable', NOW(), NULL),
  ('33333333-3333-3333-3333-333333333337', 'availability-exploring', NOW(), NOW() + INTERVAL '30 days');

-- 28. Rachel Green - Guest Services
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '33333333-3333-3333-3333-333333333338',
  'rachel.green@luxuryhotels.com',
  crypt('Rachel123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '33333333-3333-3333-3333-333333333338',
  'rachel.green@luxuryhotels.com',
  'Rachel Green',
  'Director of Guest Services at Luxury Hotels International',
  'Ensuring exceptional guest experiences across flagship properties.',
  'San Francisco, CA',
  NULL,
  'https://i.pravatar.cc/150?u=rachel.green@luxuryhotels.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333338', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('33333333-3333-3333-3333-333333333338', 'perspective-productled', NOW(), NULL),
  ('33333333-3333-3333-3333-333333333338', 'availability-hiring', NOW(), NOW() + INTERVAL '30 days');

-- 29. Patrick Lee - Catering Director
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '33333333-3333-3333-3333-333333333339',
  'patrick.lee@premiumcatering.com',
  crypt('Patrick123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '33333333-3333-3333-3333-333333333339',
  'patrick.lee@premiumcatering.com',
  'Patrick Lee',
  'Catering Director at Premium Catering Services',
  'Delivering exceptional catering for corporate and social events.',
  'Washington, DC',
  'https://patricklee.catering',
  'https://i.pravatar.cc/150?u=patrick.lee@premiumcatering.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333339', 'contribution-sharing', NOW(), NOW() + INTERVAL '90 days'),
  ('33333333-3333-3333-3333-333333333339', 'perspective-earlystage', NOW(), NULL),
  ('33333333-3333-3333-3333-333333333339', 'availability-contract', NOW(), NOW() + INTERVAL '30 days');

-- 30. Diana Martinez - Hotel Revenue Manager
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud)
VALUES (
  '33333333-3333-3333-3333-333333333340',
  'diana.martinez@revenuehotels.com',
  crypt('Diana123!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (id, email, full_name, headline, bio, location, website, avatar_url)
VALUES (
  '33333333-3333-3333-3333-333333333340',
  'diana.martinez@revenuehotels.com',
  'Diana Martinez',
  'Revenue Management Director at Boutique Hotels Group',
  'Optimizing pricing and occupancy across boutique hotel portfolio. Data-driven revenue strategist.',
  'Nashville, TN',
  NULL,
  'https://i.pravatar.cc/150?u=diana.martinez@revenuehotels.com'
);

INSERT INTO user_signals (user_id, signal_id, created_at, expires_at)
VALUES
  ('33333333-3333-3333-3333-333333333340', 'learning-data', NOW(), NOW() + INTERVAL '90 days'),
  ('33333333-3333-3333-3333-333333333340', 'perspective-systems', NOW(), NULL),
  ('33333333-3333-3333-3333-333333333340', 'contribution-mentoring', NOW(), NOW() + INTERVAL '90 days'),
  ('33333333-3333-3333-3333-333333333340', 'availability-fulltime', NOW(), NOW() + INTERVAL '30 days');

-- Add comment
COMMENT ON MIGRATION IS 'Sample profiles for testing: 10 IT/ML/AI, 10 Consulting, 10 Hospitality professionals with realistic data and signals';
