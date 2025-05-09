-- Create function to get country views
CREATE OR REPLACE FUNCTION get_country_views(target_date date)
RETURNS TABLE (
  country_code text,
  count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- Check if the user is admin
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  ) INTO is_admin;

  -- Only return data if user is admin
  IF is_admin THEN
    RETURN QUERY
    SELECT pv.country_code, COUNT(*)::bigint
    FROM page_views pv
    WHERE DATE(pv.created_at) = target_date
    GROUP BY pv.country_code;
  ELSE
    -- Return empty result if not admin
    RETURN;
  END IF;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_country_views TO authenticated;
