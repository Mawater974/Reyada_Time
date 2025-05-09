-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  ip_address TEXT,
  country_code VARCHAR(2),
  city TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  country_code VARCHAR(2),
  city TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration INTEGER -- in seconds
);

-- Create user_actions table
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_data JSONB,
  page_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics functions

-- Function to record page view
CREATE OR REPLACE FUNCTION record_page_view(
  p_user_id UUID,
  p_session_id UUID,
  p_page_path TEXT,
  p_referrer TEXT,
  p_ip_address TEXT,
  p_browser TEXT,
  p_os TEXT,
  p_device_type TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_country_code VARCHAR(2);
  v_city TEXT;
  v_view_id UUID;
BEGIN
  -- Get country and city from IP using Supabase Edge Functions (you'll need to implement this)
  -- This is a placeholder for the actual implementation
  SELECT 
    COALESCE(NULLIF(SPLIT_PART(p_ip_address, ',', 2), ''), 'Unknown'),
    COALESCE(NULLIF(SPLIT_PART(p_ip_address, ',', 3), ''), 'Unknown')
  INTO v_country_code, v_city;

  INSERT INTO page_views (
    user_id,
    session_id,
    page_path,
    referrer,
    ip_address,
    country_code,
    city,
    browser,
    os,
    device_type
  )
  VALUES (
    p_user_id,
    p_session_id,
    p_page_path,
    p_referrer,
    p_ip_address,
    v_country_code,
    v_city,
    p_browser,
    p_os,
    p_device_type
  )
  RETURNING id INTO v_view_id;

  RETURN v_view_id;
END;
$$;

-- Function to start user session
CREATE OR REPLACE FUNCTION start_user_session(
  p_user_id UUID,
  p_ip_address TEXT,
  p_browser TEXT,
  p_os TEXT,
  p_device_type TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_country_code VARCHAR(2);
  v_city TEXT;
  v_session_id UUID;
BEGIN
  -- Get country and city from IP
  SELECT 
    COALESCE(NULLIF(SPLIT_PART(p_ip_address, ',', 2), ''), 'Unknown'),
    COALESCE(NULLIF(SPLIT_PART(p_ip_address, ',', 3), ''), 'Unknown')
  INTO v_country_code, v_city;

  INSERT INTO user_sessions (
    user_id,
    ip_address,
    country_code,
    city,
    browser,
    os,
    device_type
  )
  VALUES (
    p_user_id,
    p_ip_address,
    v_country_code,
    v_city,
    p_browser,
    p_os,
    p_device_type
  )
  RETURNING id INTO v_session_id;

  RETURN v_session_id;
END;
$$;

-- Function to end user session
CREATE OR REPLACE FUNCTION end_user_session(
  p_session_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_sessions
  SET 
    end_time = NOW(),
    duration = EXTRACT(EPOCH FROM (NOW() - start_time))::INTEGER
  WHERE id = p_session_id;
END;
$$;

-- Function to record user action
CREATE OR REPLACE FUNCTION record_user_action(
  p_user_id UUID,
  p_session_id UUID,
  p_action_type TEXT,
  p_action_data JSONB,
  p_page_path TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_action_id UUID;
BEGIN
  INSERT INTO user_actions (
    user_id,
    session_id,
    action_type,
    action_data,
    page_path
  )
  VALUES (
    p_user_id,
    p_session_id,
    p_action_type,
    p_action_data,
    p_page_path
  )
  RETURNING id INTO v_action_id;

  RETURN v_action_id;
END;
$$;

-- Create analytics views for reporting

-- View for daily page views
CREATE OR REPLACE VIEW analytics_daily_page_views AS
SELECT 
  DATE_TRUNC('day', created_at) AS date,
  page_path,
  country_code,
  COUNT(*) as view_count
FROM page_views
GROUP BY 1, 2, 3
ORDER BY 1 DESC, 4 DESC;

-- View for user engagement
CREATE OR REPLACE VIEW analytics_user_engagement AS
SELECT 
  u.id as user_id,
  u.email,
  COUNT(DISTINCT s.id) as total_sessions,
  COUNT(DISTINCT pv.id) as total_page_views,
  COUNT(DISTINCT ua.id) as total_actions,
  AVG(s.duration) as avg_session_duration
FROM auth.users u
LEFT JOIN user_sessions s ON u.id = s.user_id
LEFT JOIN page_views pv ON u.id = pv.user_id
LEFT JOIN user_actions ua ON u.id = ua.user_id
GROUP BY u.id, u.email;

-- Add RLS policies
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view analytics data
CREATE POLICY "Admins can view page_views"
  ON page_views FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));

CREATE POLICY "Admins can view user_sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));

CREATE POLICY "Admins can view user_actions"
  ON user_actions FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));

-- Allow insert through functions only
CREATE POLICY "Allow insert through functions"
  ON page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow insert through functions"
  ON user_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow insert through functions"
  ON user_actions FOR INSERT
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_user_id ON page_views(user_id);
CREATE INDEX idx_page_views_session_id ON page_views(session_id);
CREATE INDEX idx_page_views_country_code ON page_views(country_code);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_start_time ON user_sessions(start_time);
CREATE INDEX idx_user_sessions_country_code ON user_sessions(country_code);

CREATE INDEX idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX idx_user_actions_session_id ON user_actions(session_id);
CREATE INDEX idx_user_actions_created_at ON user_actions(created_at);
CREATE INDEX idx_user_actions_action_type ON user_actions(action_type);
