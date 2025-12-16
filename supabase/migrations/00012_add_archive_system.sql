-- Add archive system for expired posts
-- Posts expire after 7 days by default and are archived (not deleted)

-- Add archived flag to posts
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

-- Create index for querying active/archived posts
CREATE INDEX IF NOT EXISTS idx_posts_archived ON posts(archived, created_at);
CREATE INDEX IF NOT EXISTS idx_posts_user_archived ON posts(user_id, archived);

-- Function to auto-archive expired posts
CREATE OR REPLACE FUNCTION archive_expired_posts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE posts
  SET
    archived = TRUE,
    archived_at = NOW()
  WHERE
    archived = FALSE
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$;

-- Update RLS policies to exclude archived posts from public view
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;

-- Create new policy that excludes archived posts for non-owners
CREATE POLICY "Active posts are viewable by everyone" ON posts
  FOR SELECT
  USING (
    archived = FALSE
    OR user_id = auth.uid()  -- Users can see their own archived posts
  );

-- Policy for viewing own archived posts
CREATE POLICY "Users can view their own archived posts" ON posts
  FOR SELECT
  USING (user_id = auth.uid());

-- Add helper function to set default 7-day expiration when creating posts
CREATE OR REPLACE FUNCTION set_default_expiration()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- If no expiration is set, default to 7 days from now
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at := NOW() + INTERVAL '7 days';
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-set expiration on post creation
DROP TRIGGER IF EXISTS set_post_expiration ON posts;
CREATE TRIGGER set_post_expiration
  BEFORE INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_default_expiration();

-- Add comment explaining archive system
COMMENT ON COLUMN posts.archived IS 'Posts are automatically archived after expiration. Only visible to post owner when archived.';
COMMENT ON COLUMN posts.expires_at IS 'Posts expire 7 days after creation by default. Can be customized or set to NULL for no expiration.';
COMMENT ON FUNCTION archive_expired_posts() IS 'Run this function periodically (via cron) to archive expired posts. Archived posts are only visible to their owners.';
