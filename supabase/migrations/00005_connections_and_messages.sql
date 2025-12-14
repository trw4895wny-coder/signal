-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure users can't connect with themselves
  CONSTRAINT no_self_connection CHECK (requester_id != receiver_id),
  -- Ensure unique connection between two users (prevent duplicates)
  CONSTRAINT unique_connection UNIQUE (requester_id, receiver_id)
);

-- Create index for faster queries
CREATE INDEX idx_connections_requester ON connections(requester_id);
CREATE INDEX idx_connections_receiver ON connections(receiver_id);
CREATE INDEX idx_connections_status ON connections(status);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster message queries
CREATE INDEX idx_messages_connection ON messages(connection_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for connections
-- Users can view connections where they are either requester or receiver
CREATE POLICY "Users can view their own connections"
  ON connections FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Users can create connection requests
CREATE POLICY "Users can create connection requests"
  ON connections FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

-- Users can update connections they received (to accept/reject)
CREATE POLICY "Users can update received connections"
  ON connections FOR UPDATE
  USING (auth.uid() = receiver_id);

-- RLS Policies for messages
-- Users can view messages in their connections
CREATE POLICY "Users can view messages in their connections"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM connections
      WHERE connections.id = messages.connection_id
      AND (connections.requester_id = auth.uid() OR connections.receiver_id = auth.uid())
      AND connections.status = 'accepted'
    )
  );

-- Users can send messages in accepted connections
CREATE POLICY "Users can send messages in accepted connections"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM connections
      WHERE connections.id = connection_id
      AND (connections.requester_id = auth.uid() OR connections.receiver_id = auth.uid())
      AND connections.status = 'accepted'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on connections
CREATE TRIGGER update_connections_updated_at
  BEFORE UPDATE ON connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
