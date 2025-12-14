-- Migration: Add UPDATE policy for messages table
-- This allows users to mark messages as read in their connections

-- Add UPDATE policy for messages
CREATE POLICY "Users can update messages in their connections"
ON messages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM connections
    WHERE connections.id = messages.connection_id
    AND connections.status = 'accepted'
    AND (connections.requester_id = auth.uid() OR connections.receiver_id = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM connections
    WHERE connections.id = messages.connection_id
    AND connections.status = 'accepted'
    AND (connections.requester_id = auth.uid() OR connections.receiver_id = auth.uid())
  )
);

-- Add comment explaining the policy
COMMENT ON POLICY "Users can update messages in their connections" ON messages IS
  'Allows users to update messages (primarily for marking as read) in connections they are part of';
