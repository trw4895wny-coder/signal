-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Signal categories table
CREATE TABLE signal_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  max_selections INTEGER NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Signals taxonomy table
CREATE TABLE signals (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES signal_categories(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  expiration_days INTEGER, -- NULL means persistent (no expiration)
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User signals junction table
CREATE TABLE user_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  signal_id TEXT NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, signal_id)
);

-- Indexes for performance
CREATE INDEX idx_user_signals_user_id ON user_signals(user_id);
CREATE INDEX idx_user_signals_signal_id ON user_signals(signal_id);
CREATE INDEX idx_user_signals_expires_at ON user_signals(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_signals_category_id ON signals(category_id);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_categories ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User signals: Users can manage their own signals, everyone can view
CREATE POLICY "User signals are viewable by everyone"
  ON user_signals FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own signals"
  ON user_signals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own signals"
  ON user_signals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own signals"
  ON user_signals FOR DELETE
  USING (auth.uid() = user_id);

-- Taxonomy tables: read-only for all users
CREATE POLICY "Signal categories are viewable by everyone"
  ON signal_categories FOR SELECT
  USING (true);

CREATE POLICY "Signals are viewable by everyone"
  ON signals FOR SELECT
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set expiration date on signal creation
CREATE OR REPLACE FUNCTION set_signal_expiration()
RETURNS TRIGGER AS $$
DECLARE
  signal_expiration_days INTEGER;
BEGIN
  -- Get expiration days for this signal
  SELECT expiration_days INTO signal_expiration_days
  FROM signals
  WHERE id = NEW.signal_id;

  -- Set expires_at if signal has expiration
  IF signal_expiration_days IS NOT NULL THEN
    NEW.expires_at = NOW() + (signal_expiration_days || ' days')::INTERVAL;
  ELSE
    NEW.expires_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_signal_expiration
  BEFORE INSERT ON user_signals
  FOR EACH ROW
  EXECUTE FUNCTION set_signal_expiration();
