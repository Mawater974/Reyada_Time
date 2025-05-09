# API Documentation

## Authentication API

### User Registration
```typescript
POST /auth/signup
Body: {
  email: string
  password: string
  name: string
  country_id: number
}
Response: {
  user: User
  session: Session
}
```

### User Login
```typescript
POST /auth/signin
Body: {
  email: string
  password: string
  remember: boolean
}
Response: {
  user: User
  session: Session
}
```

### Password Reset
```typescript
POST /auth/reset-password
Body: {
  email: string
}
Response: {
  success: boolean
}
```

## Profile API

### Get Profile
```typescript
GET /api/profile
Response: {
  id: string
  user_id: string
  name: string
  country_id: number
  language: string
  theme: 'light' | 'dark'
  created_at: string
  updated_at: string
}
```

### Update Profile
```typescript
PATCH /api/profile
Body: {
  name?: string
  country_id?: number
  language?: string
  theme?: 'light' | 'dark'
}
Response: {
  success: boolean
  profile: Profile
}
```

## Contact API

### Submit Contact Form
```typescript
POST /api/contact
Body: {
  name: string
  email: string
  message: string
  country_id?: number
}
Response: {
  success: boolean
  message_id: string
}
```

### Get Contact Messages (Admin)
```typescript
GET /api/admin/contact-messages
Query: {
  status?: 'read' | 'unread'
  page?: number
  limit?: number
}
Response: {
  messages: ContactMessage[]
  total: number
}
```

### Update Message Status (Admin)
```typescript
PATCH /api/admin/contact-messages/:id
Body: {
  status: 'read' | 'unread'
}
Response: {
  success: boolean
}
```

## Analytics API

### Get Page Views
```typescript
GET /api/analytics/page-views
Query: {
  start_date: string
  end_date: string
  country?: string
}
Response: {
  views: {
    date: string
    count: number
    country?: string
  }[]
}
```

### Get User Engagement
```typescript
GET /api/analytics/engagement
Query: {
  date: string
}
Response: {
  total_sessions: number
  avg_session_duration: number
  total_users: number
  active_users: number
}
```

### Get Country Distribution
```typescript
GET /api/analytics/country-distribution
Response: {
  countries: {
    code: string
    name: string
    users: number
    sessions: number
  }[]
}
```

## Admin API

### Get Users
```typescript
GET /api/admin/users
Query: {
  country_id?: number
  role?: string
  status?: string
  page?: number
  limit?: number
}
Response: {
  users: User[]
  total: number
}
```

### Update User Role
```typescript
PATCH /api/admin/users/:id/role
Body: {
  role: 'user' | 'admin' | 'super_admin'
}
Response: {
  success: boolean
}
```

### Update User Status
```typescript
PATCH /api/admin/users/:id/status
Body: {
  status: 'active' | 'disabled'
}
Response: {
  success: boolean
}
```

## Types

### User
```typescript
interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  role: 'user' | 'admin' | 'super_admin'
  status: 'active' | 'disabled'
}
```

### Profile
```typescript
interface Profile {
  id: string
  user_id: string
  name: string
  country_id: number
  language: string
  theme: 'light' | 'dark'
  created_at: string
  updated_at: string
}
```

### ContactMessage
```typescript
interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  country_id: number
  status: 'read' | 'unread'
  created_at: string
  updated_at: string
}
```

### Session
```typescript
interface Session {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  expires_at: string
}
```
