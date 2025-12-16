-- Add location fields to profiles and posts for location-based filtering

-- Add location fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US',
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP WITH TIME ZONE;

-- Add location fields to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US',
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create index for location-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(city, state, country);
CREATE INDEX IF NOT EXISTS idx_posts_location ON posts(city, state, country);
CREATE INDEX IF NOT EXISTS idx_profiles_coordinates ON profiles(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_posts_coordinates ON posts(latitude, longitude);

-- Add comment explaining location strategy
COMMENT ON COLUMN profiles.city IS 'City name for location-based matching';
COMMENT ON COLUMN profiles.state IS 'State/province code (e.g., CA, NY)';
COMMENT ON COLUMN profiles.latitude IS 'Latitude for precise distance calculations';
COMMENT ON COLUMN profiles.longitude IS 'Longitude for precise distance calculations';
COMMENT ON COLUMN posts.city IS 'Location where work is available/needed (can differ from profile location)';
