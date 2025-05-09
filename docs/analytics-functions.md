# Analytics Functions Documentation

This document describes the analytics tracking functions implemented in the Reyada Time application.

## Database Tables

### 1. `page_views`
- Tracks individual page views
- Fields:
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key to auth.users)
  - `session_id`: UUID
  - `page_path`: TEXT
  - `referrer`: TEXT
  - `ip_address`: TEXT
  - `country_code`: VARCHAR(2)
  - `city`: TEXT
  - `browser`: TEXT
  - `os`: TEXT
  - `device_type`: TEXT
  - `created_at`: TIMESTAMPTZ

### 2. `user_sessions`
- Tracks user sessions
- Fields:
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key to auth.users)
  - `ip_address`: TEXT
  - `country_code`: VARCHAR(2)
  - `city`: TEXT
  - `browser`: TEXT
  - `os`: TEXT
  - `device_type`: TEXT
  - `start_time`: TIMESTAMPTZ
  - `end_time`: TIMESTAMPTZ
  - `duration`: INTEGER (in seconds)

### 3. `user_actions`
- Tracks specific user actions
- Fields:
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key to auth.users)
  - `session_id`: UUID (Foreign Key to user_sessions)
  - `action_type`: TEXT
  - `action_data`: JSONB
  - `page_path`: TEXT
  - `created_at`: TIMESTAMPTZ

## Functions

### 1. `record_page_view`
```sql
record_page_view(
  p_user_id UUID,
  p_session_id UUID,
  p_page_path TEXT,
  p_referrer TEXT,
  p_ip_address TEXT,
  p_browser TEXT,
  p_os TEXT,
  p_device_type TEXT
) RETURNS UUID
```
- Records a page view with geolocation data
- Extracts country and city from IP address
- Returns the ID of the created page view record
- Security: SECURITY DEFINER

### 2. `start_user_session`
```sql
start_user_session(
  p_user_id UUID,
  p_ip_address TEXT,
  p_browser TEXT,
  p_os TEXT,
  p_device_type TEXT
) RETURNS UUID
```
- Creates a new user session
- Extracts geolocation data from IP
- Returns the session ID
- Security: SECURITY DEFINER

### 3. `end_user_session`
```sql
end_user_session(
  p_session_id UUID
) RETURNS VOID
```
- Updates session end time
- Calculates session duration
- Security: SECURITY DEFINER

### 4. `record_user_action`
```sql
record_user_action(
  p_user_id UUID,
  p_session_id UUID,
  p_action_type TEXT,
  p_action_data JSONB,
  p_page_path TEXT
) RETURNS UUID
```
- Records specific user actions
- Stores additional data in JSONB format
- Returns the action ID
- Security: SECURITY DEFINER

### 5. `get_country_views`
```sql
get_country_views(
  target_date date
) RETURNS TABLE (
  country_code text,
  count bigint
)
```
- Returns page view counts by country for a specific date
- Only accessible to admin and super_admin roles
- Returns empty result for non-admin users
- Security: SECURITY DEFINER

## Views

### 1. `analytics_user_engagement`
- Shows daily user engagement metrics
- Displays:
  - Total sessions count
  - Average session duration
- Only returns data for admin and super_admin roles
- Accessible to authenticated users

## Security

All analytics functions and views implement the following security measures:

1. **Row Level Security (RLS)**
   - Enabled on all base tables
   - Policies restrict data access to admin users
   - Insert policies allow data collection from all users

2. **Role-Based Access**
   - Admin functions check user role via `raw_user_meta_data->>'role'`
   - Supports both 'admin' and 'super_admin' roles
   - Non-admin users get empty results

3. **Function Security**
   - All functions use SECURITY DEFINER
   - Execute permissions granted only to authenticated users
   - Built-in role checks prevent unauthorized access

## Performance

Indexes are created for optimal query performance:
- Page Views: created_at, user_id, session_id, country_code
- User Sessions: user_id, start_time, country_code
- User Actions: user_id, session_id, created_at, action_type
