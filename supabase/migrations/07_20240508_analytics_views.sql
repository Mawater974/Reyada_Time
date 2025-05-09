-- Drop existing view if it exists
DROP VIEW IF EXISTS analytics_user_engagement;

-- Create view for user engagement metrics with built-in admin check
CREATE VIEW analytics_user_engagement AS
SELECT
  total_sessions,
  ROUND(avg_session_duration::numeric, 2) as avg_session_duration
FROM (
  SELECT
    COUNT(DISTINCT id) as total_sessions,
    AVG(duration) as avg_session_duration
  FROM user_sessions
  WHERE DATE(start_time) = CURRENT_DATE
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  )
) session_stats;

-- Grant access to authenticated users
GRANT SELECT ON analytics_user_engagement TO authenticated;
