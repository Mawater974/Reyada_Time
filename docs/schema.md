# Database Schema Documentation

## Core Tables

### users (auth.users)
Managed by Supabase Auth
```sql
CREATE TABLE auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  encrypted_password TEXT,
  email_confirmed_at TIMESTAMPTZ,
  invited_at TIMESTAMPTZ,
  confirmation_token TEXT,
  confirmation_sent_at TIMESTAMPTZ,
  recovery_token TEXT,
  recovery_sent_at TIMESTAMPTZ,
  email_change_token_new TEXT,
  email_change TEXT,
  email_change_sent_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  raw_app_meta_data JSONB,
  raw_user_meta_data JSONB,
  is_super_admin BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  phone TEXT UNIQUE,
  phone_confirmed_at TIMESTAMPTZ,
  phone_change TEXT,
  phone_change_token TEXT,
  phone_change_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  email_change_token_current TEXT,
  email_change_confirm_status SMALLINT,
  banned_until TIMESTAMPTZ,
  reauthentication_token TEXT,
  reauthentication_sent_at TIMESTAMPTZ
);
```

### profiles
User profile information
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  country_id INTEGER REFERENCES countries(id),
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### countries
Supported countries
```sql
CREATE TABLE public.countries (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  currency TEXT NOT NULL,
  currency_symbol TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Analytics Tables

### page_views
```sql
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
```

### user_sessions
```sql
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  country_code VARCHAR(2),
  city TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration INTEGER
);
```

### user_actions
```sql
CREATE TABLE public.user_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_data JSONB,
  page_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Contact System Tables

### contact_messages
```sql
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  country_id INTEGER REFERENCES countries(id),
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Views

### analytics_daily_page_views
```sql
CREATE VIEW analytics_daily_page_views AS
SELECT 
  DATE_TRUNC('day', created_at) AS date,
  page_path,
  country_code,
  COUNT(*) as view_count
FROM page_views
GROUP BY 1, 2, 3
ORDER BY 1 DESC, 4 DESC;
```

### analytics_user_engagement
```sql
CREATE VIEW analytics_user_engagement AS
WITH session_stats AS (
  SELECT
    COUNT(DISTINCT id) as total_sessions,
    AVG(duration) as avg_session_duration
  FROM user_sessions
  WHERE DATE(start_time) = CURRENT_DATE
)
SELECT
  total_sessions,
  ROUND(avg_session_duration::numeric, 2) as avg_session_duration
FROM session_stats;
```

## Indexes

### Analytics Indexes
```sql
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
```

### Contact System Indexes
```sql
CREATE INDEX idx_contact_messages_user_id ON contact_messages(user_id);
CREATE INDEX idx_contact_messages_country_id ON contact_messages(country_id);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
```

## Row Level Security (RLS)

### Page Views
```sql
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view page_views"
  ON page_views FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  ));
```

### User Sessions
```sql
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view user_sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  ));
```

### Contact Messages
```sql
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON contact_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all messages"
  ON contact_messages FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  ));
```
