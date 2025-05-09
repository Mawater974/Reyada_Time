-- Update RLS policies for analytics tables

-- Enable RLS on all tables
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- Page Views policies
DROP POLICY IF EXISTS "page_views_admin_select" ON page_views;
DROP POLICY IF EXISTS "page_views_insert" ON page_views;
DROP POLICY IF EXISTS "Allow insert through functions" ON page_views;

CREATE POLICY "page_views_insert"
  ON page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "page_views_admin_select"
  ON page_views FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  ));

-- User Sessions policies
DROP POLICY IF EXISTS "user_sessions_admin_select" ON user_sessions;
DROP POLICY IF EXISTS "user_sessions_insert" ON user_sessions;
DROP POLICY IF EXISTS "user_sessions_update" ON user_sessions;
DROP POLICY IF EXISTS "Allow insert through functions" ON user_sessions;

CREATE POLICY "user_sessions_insert"
  ON user_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "user_sessions_update"
  ON user_sessions FOR UPDATE
  USING (user_id = auth.uid() OR auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  ));

CREATE POLICY "user_sessions_admin_select"
  ON user_sessions FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  ));

-- User Actions policies
DROP POLICY IF EXISTS "user_actions_admin_select" ON user_actions;
DROP POLICY IF EXISTS "user_actions_insert" ON user_actions;
DROP POLICY IF EXISTS "Allow insert through functions" ON user_actions;

CREATE POLICY "user_actions_insert"
  ON user_actions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "user_actions_admin_select"
  ON user_actions FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  ));
