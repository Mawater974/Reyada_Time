# Features Documentation

## Authentication System

### User Registration
- Country-specific registration process
- Required fields: email, password, name, country
- Automatic profile creation
- Email verification support
- Secure password hashing via Supabase Auth

### Login System
- Email/password authentication
- Remember me functionality
- Secure session management
- Country-specific redirects after login
- Support for password reset

### Profile Management
- User profile editing
- Profile picture upload
- Country selection
- Language preference setting
- Dark/Light mode preference

## Multi-Language Support

### Supported Languages
- English (Default)
- Arabic (RTL support)

### Translation System
- Context-based translations
- Dynamic language switching
- RTL layout support
- Number and date formatting
- Currency formatting

### Language Selection
- Automatic detection from browser
- Manual selection via profile
- Persistent language preference
- Country-specific defaults

## Contact System

### Contact Form
- Available at `/contact`
- Fields:
  - Name (auto-filled for logged-in users)
  - Email (auto-filled for logged-in users)
  - Message
  - Country (auto-selected based on context)
- Form validation
- Success/Error notifications
- Google Maps integration

### Admin Message Management
- View all messages at `/admin/contact-messages`
- Filter by:
  - Read/Unread status
  - Date
  - Country
- Actions:
  - Mark as read/unread
  - Delete messages
  - Reply to messages
- Detailed message view

## Country-Specific Features

### Country Management
- Supported countries:
  - Qatar
  - UAE
  - Kuwait
  - Others
- Country-specific:
  - Landing pages
  - Pricing
  - Contact information
  - Currency

### Routing System
- Country code prefixes (e.g., /qa/, /ae/)
- Automatic redirects based on:
  - User profile country
  - Registration country
  - Current location

## Admin Dashboard

### Analytics
- Daily page views
- User engagement metrics
- Geographic distribution
- Session analysis
- Export capabilities

### User Management
- View all users
- Filter by:
  - Country
  - Role
  - Status
- Actions:
  - Edit roles
  - Disable/Enable accounts
  - Reset passwords

### Content Management
- Edit static content
- Manage translations
- Update pricing
- Configure features by country

## Security Features

### Row Level Security (RLS)
- Table-level security policies
- Role-based access control
- Country-specific data isolation
- Audit logging

### Role System
- User roles:
  - Regular user
  - Admin
  - Super admin
- Role-based permissions
- Feature access control

### Data Protection
- Encrypted data storage
- Secure file uploads
- GDPR compliance
- Data retention policies

## UI/UX Features

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop layouts
- Print-friendly styles

### Theme System
- Light/Dark mode
- Custom color schemes
- RTL/LTR layouts
- Consistent typography

### Components
- Custom form elements
- Modal system
- Toast notifications
- Loading states
- Error boundaries

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## Technical Implementation

### State Management
- React Context API
- Custom hooks
- Local storage integration
- Session management

### Performance
- Code splitting
- Image optimization
- Caching strategies
- Lazy loading

### Error Handling
- Global error boundary
- API error handling
- Form validation
- Offline support

### Testing
- Unit tests
- Integration tests
- E2E tests
- Performance monitoring
