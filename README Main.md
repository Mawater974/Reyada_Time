# Reyada Time - Sports Booking App

A comprehensive mobile application for booking sports facilities across Arab countries. This app allows users to discover and book various sports facilities, including football fields, basketball courts, volleyball courts, padel courts, swimming pools, and gyms. Built with Flutter and Supabase, it offers a seamless experience for both users and facility owners.

## User Roles

The application supports four distinct user roles with different permissions:

1. **Regular User**: Can browse facilities, make bookings, view booking history, and manage their profile.

2. **Facility Owner**: Can manage their own facilities, including creating facility listings, updating facility details, managing availability, and viewing bookings for their facilities.

3. **Admin**: Has elevated permissions to manage users, approve facilities, handle disputes, and access analytics for specific regions or facility types.

4. **Super Admin**: Has full system access with the ability to manage all users, facilities, bookings, and system settings across the entire platform.

## Features

### User Authentication & Profile Management
- ✅ Login and registration with email/password
- ✅ Secure authentication with Supabase
- ✅ Password reset functionality
- ✅ User profile management
- ✅ Country-specific user profiles and redirects
- ✅ Multiple user roles (User, Facility Owner, Admin, Super Admin)
- ✅ Profile image upload and management

### Facility Discovery & Management
- ✅ Browse facilities by sport type
- ✅ Advanced search functionality
- ✅ Filter by location, price, and amenities
- ✅ View popular and nearby facilities
- ✅ Detailed facility information (photos, descriptions, amenities)
- ✅ Ratings and reviews system
- ✅ Facility management for owners
- ✅ Facility approval workflow for admins

### Booking System
- ✅ Interactive calendar for date selection
- ✅ Time slot availability display
- ✅ Duration and player count selection
- ✅ Real-time pricing calculation
- ✅ Booking confirmation with details
- ✅ Booking history and status tracking
- ✅ Cancellation and rescheduling options

### Payment Processing
- ✅ Multiple payment options (credit card, cash on arrival)
- ✅ Secure payment processing
- ✅ Payment history and receipts
- ✅ Promo code application
- ✅ Refund processing for cancellations

### Contact & Support
- ✅ Contact form with direct messaging
- ✅ Support ticket system
- ✅ FAQ section
- ✅ Privacy policy and terms of service

### Multilingual & UI Features
- ✅ Complete Arabic and English language support
- ✅ RTL layout support for Arabic
- ✅ Dark/light mode theme switching
- ✅ Responsive design for all screen sizes
- ✅ Accessibility features

### Admin Dashboard
- ✅ User management
- ✅ Facility approval and management
- ✅ Booking oversight
- ✅ Content moderation
- ✅ System settings configuration

### Upcoming Features

#### Featured Content & Advertising
- 💫 Featured facilities with premium placement
- 💫 Sponsored listings in search results
- 💫 Banner ads with targeting options
- 💫 Promotional campaigns for facilities
- 💫 Featured events and tournaments
- 💫 Personalized recommendations

#### Analytics & Insights
- 📊 User activity tracking
- 📊 Facility performance metrics
- 📊 Booking trends and patterns
- 📊 Revenue reports and forecasts
- 📊 Custom dashboard for different user roles
- 📊 A/B testing framework for feature optimization

#### Points & Loyalty System
- 🏆 Points earning for bookings and activities
- 🏆 Tiered membership levels
- 🏆 Points redemption for discounts
- 🏆 Special rewards for loyal users
- 🏆 Referral bonuses

#### Promo Codes & Discounts
- 🏷️ Seasonal promotion campaigns
- 🏷️ First-time user discounts
- 🏷️ Facility-specific offers
- 🏷️ Time-based discounts for off-peak hours
- 🏷️ Bundle packages for regular users
- 🏷️ Last-minute deals for same-day bookings

#### Tournaments & Events
- 🏆 Tournament creation and management
- 🏆 Team registration and management
- 🏆 Tournament brackets and scheduling
- 🏆 Live scoring and results
- 🏆 Prize distribution and tracking

#### Gym & Subscription Management
- 💪 Monthly gym membership subscriptions
- 💪 Multi-tier gym membership plans
- 💪 Membership renewal reminders
- 💪 Gym-specific discounts and promotions
- 💪 Gym attendance tracking

#### Private Coaching
- 👨‍🏫 Coach profiles and portfolios
- 👨‍🏫 Coach availability calendar
- 👨‍🏫 Session booking and payment
- 👨‍🏫 Coach ratings and reviews
- 👨‍🏫 Specialized coaching packages

#### Social & Invitation Features
- 👥 Player invitations for group activities
- 👥 Friend system with activity sharing
- 👥 Team formation for regular play
- 👥 Group chat for event coordination
- 👥 Activity feed for friends' bookings

#### Advanced Booking Features
- 📅 Waitlist system for fully booked facilities
- 📅 Group bookings with special rates
- 📅 Split payments between multiple users
- 📅 Recurring booking setup
- 📅 QR code check-in at facilities

#### Business & Monetization
- 💼 Premium subscription tiers with benefits
- 💼 facility partnerships with special rates
- 💼 In-app marketplace for sports gear
- 💼 Affiliate program for user referrals
- 💼 Corporate booking packages

#### Technical Improvements
- ⚙️ Performance optimization
- ⚙️ Advanced caching for offline experience
- ⚙️ Wearable device integration
- ⚙️ Automated testing framework
- ⚙️ Enhanced security features

## Technology Stack

- **Frontend**: Flutter (latest stable version)
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage for images and files
- **Payment Processing**: Stripe integration
- **Maps**: Google Maps integration
- **Localization**: Complete support for Arabic and English languages
- **State Management**: Provider pattern
- **Responsive Design**: Adaptive layouts for all screen sizes
- **Offline Support**: Advanced caching for essential data
- **Analytics**: Custom analytics integration (upcoming)
- **Wearable Integration**: Smartwatch notifications and check-ins
- **QR Code System**: For facility check-ins and ticket validation
- **Testing Framework**: Comprehensive automated testing

## Database Structure

### Users Table
- id (UUID, Primary Key)
- email (String, Unique)
- name (String)
- password (String) *for testing*
- phone_number (String)
- profile_image_url (String)
- country_id (Foreign Key)
- city_id (Foreign Key)
- role (Enum: user, facility_owner, admin, super_admin)
- created_at (Timestamp)
- last_login_at (Timestamp)
- is_active (Boolean)
- preferences (JSON)
- points_balance (Integer) - *Upcoming*
- membership_tier (String) - *Upcoming*

### Facilities Table
- id (UUID, Primary Key)
- name_en (String)
- name_ar (String)
- owner_id (UUID, Foreign Key to users.id)
- description_en (Text)
- description_ar (Text)
- images (String[])
- facility_type (Enum: football, basketball, volleyball, etc.)
- address_en (String)
- address_ar (String)
- country_id (Foreign Key)
- city_id (Foreign Key)
- location (Point: latitude, longitude)
- opening_hours (JSON)
- rating (Decimal)
- review_count (Integer)
- amenities_en (String[])
- amenities_ar (String[])
- verification_status (Enum: pending, verified, rejected)
- is_active (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)
- price_per_hour (Decimal)
- currency (String)
- capacity (Integer)
- is_featured (Boolean)
- featured_until (Timestamp)
- featured_priority (Integer)

### Bookings Table
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to users.id)
- facility_id (UUID, Foreign Key to facilities.id)
- booking_date (Date)
- time_slot (String)
- duration_minutes (Integer)
- number_of_players (Integer)
- total_price (Decimal)
- status (Enum: pending, confirmed, completed, cancelled_by_user, cancelled_by_facility)
- payment_status (Enum: pending, completed, refunded)
- payment_method (String)
- payment_id (String)
- promo_code (String)
- discount_amount (Decimal)
- booking_details (JSON)
- created_at (Timestamp)
- updated_at (Timestamp)
- cancelled_at (Timestamp)
- cancellation_reason (String)
- points_earned (Integer) - *Upcoming*

### Reviews Table
- id (UUID, Primary Key)
- booking_id (UUID, Foreign Key to bookings.id)
- user_id (UUID, Foreign Key to users.id)
- facility_id (UUID, Foreign Key to facilities.id)
- rating (Integer, 1-5)
- comment (Text)
- created_at (Timestamp)
- updated_at (Timestamp)

### Gym Subscriptions Table - *Upcoming*
- id (UUID, Primary Key)
- facility_id (UUID, Foreign Key to facilities.id)
- name (String)
- description (Text)
- duration_days (Integer)
- price (Decimal)
- features (String[])
- max_visits (Integer, nullable)
- is_active (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

### User Subscriptions Table - *Upcoming*
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to users.id)
- subscription_id (UUID, Foreign Key to gym_subscriptions.id)
- start_date (Timestamp)
- end_date (Timestamp)
- status (Enum: active, expired, cancelled)
- payment_id (String)
- created_at (Timestamp)
- updated_at (Timestamp)

### Coaches Table - *Upcoming*
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to users.id)
- specialties (String[])
- experience_years (Integer)
- bio (Text)
- hourly_rate (Decimal)
- availability (JSON)
- is_verified (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

### Coaching Sessions Table - *Upcoming*
- id (UUID, Primary Key)
- coach_id (UUID, Foreign Key to coaches.id)
- user_id (UUID, Foreign Key to users.id)
- facility_id (UUID, Foreign Key to facilities.id)
- session_date (Date)
- start_time (Time)
- duration_minutes (Integer)
- status (Enum: scheduled, completed, cancelled)
- price (Decimal)
- payment_status (Enum: pending, completed, refunded)
- created_at (Timestamp)
- updated_at (Timestamp)

### Waitlist Table - *Upcoming*
- id (UUID, Primary Key)
- facility_id (UUID, Foreign Key to facilities.id)
- user_id (UUID, Foreign Key to users.id)
- requested_date (Date)
- requested_time_slot (String)
- duration_minutes (Integer)
- number_of_players (Integer)
- status (Enum: waiting, fulfilled, expired, cancelled)
- notification_sent (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

### Group Bookings Table - *Upcoming*
- id (UUID, Primary Key)
- booking_id (UUID, Foreign Key to bookings.id)
- organizer_id (UUID, Foreign Key to users.id)
- participants (UUID[])
- payment_status (JSON) # Tracks payment status for each participant
- created_at (Timestamp)
- updated_at (Timestamp)

### Marketplace Items Table - *Upcoming*
- id (UUID, Primary Key)
- seller_id (UUID, Foreign Key to users.id)
- name (String)
- description (Text)
- category (String)
- price (Decimal)
- images (String[])
- quantity (Integer)
- status (Enum: available, sold_out, hidden)
- created_at (Timestamp)
- updated_at (Timestamp)
- is_featured (Boolean)
- featured_until (Timestamp)

### Advertisements Table - *Upcoming*
- id (UUID, Primary Key)
- advertiser_id (UUID, Foreign Key to users.id)
- title (String)
- description (Text)
- image_url (String)
- target_url (String)
- placement (Enum: home_banner, search_results, facility_page, etc.)
- start_date (Timestamp)
- end_date (Timestamp)
- impressions_count (Integer)
- clicks_count (Integer)
- status (Enum: active, paused, completed)
- targeting_criteria (JSON) # country, city, user interests, etc.
- created_at (Timestamp)
- updated_at (Timestamp)

### Analytics Table - *Upcoming*
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to users.id, nullable)
- facility_id (UUID, Foreign Key to facilities.id, nullable)
- event_type (String)
- event_data (JSON)
- timestamp (Timestamp)
- session_id (String)
- device_info (JSON)

## Getting Started

### Prerequisites

- Flutter SDK (version 3.29.3 or higher)
- Android Studio or VS Code with Flutter extensions
- Supabase account and project setup
- Google Maps API key (for location services)
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/reyada_time.git
   ```

2. Navigate to the project directory:
   ```bash
   cd reyada_time
   ```

3. Install dependencies:
   ```bash
   flutter pub get
   ```

4. Run the application:
   ```bash
   flutter run
   ```

### Language Support

The application supports both English and Arabic languages. You can switch between languages in the settings screen.
- Android/iOS emulator or physical device

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/reyada_time.git
```

2. Navigate to the project directory:
```
cd reyada_time
```

3. Install dependencies:
```
flutter pub get
```

4. Run the app:
```
flutter run
```

### Running on Different Platforms

#### Android Emulator
```
flutter run -d android
```

#### iOS Simulator (Mac only)
```
flutter run -d ios
```

#### Web Browser
```
flutter run -d chrome
```

#### Windows Desktop
```
flutter run -d windows
```

## Project Structure

```
lib/
├── config/               # App configuration
│   ├── routes.dart       # App routes
│   ├── theme.dart        # App theme configuration
│   └── supabase_config.dart # Supabase configuration
├── data/                 # Data layer
│   ├── models/           # Data models
│   │   ├── user_model.dart
│   │   ├── facility_model.dart
│   │   └── booking_model.dart
│   ├── repositories/     # Data repositories
│   └── services/         # Services for API communication
│       ├── auth_service_supabase.dart
│       └── supabase_service.dart
├── features/             # Feature modules
│   ├── admin/            # Admin dashboard
│   ├── analytics/        # Analytics features (upcoming)
│   ├── auth/             # Authentication
│   │   ├── screens/
│   │   └── widgets/
│   ├── booking/          # Booking process
│   ├── debug/            # Debug tools
│   ├── discover/         # Facility discovery
│   ├── loyalty/          # Points and rewards (upcoming)
│   ├── payment/          # Payment processing
│   ├── profile/          # User profile
│   └── tournaments/      # Tournament system (upcoming)
├── localization/         # Translations
│   └── app_localizations.dart
├── providers/            # State management
├── utils/                # Utility functions
├── widgets/              # Reusable widgets
└── main.dart             # App entry point
```

## Customization

### Theming
The app uses a custom theme defined in `lib/config/theme.dart`. You can modify colors, typography, and component styles there.

### Adding New Sports
Add new sports in the `supportedSports` list in `lib/config/app_config.dart`.

### Adding New Countries
Add new countries in the `supportedCountries` list in `lib/config/app_config.dart`.

## Deployment

### Android
```
flutter build apk --release
```

### iOS (Mac only)
```
flutter build ios --release
```

### Web
```
flutter build web --release
```

## Implementation To-Do Lists

This section outlines the implementation tasks for each page/feature in the application.

### Authentication Pages

#### Login Screen
- [ ] Implement biometric authentication option
- [ ] Add "Remember Me" functionality
- [ ] Implement social login options (Google, Apple)
- [ ] Add password strength indicator
- [ ] Create account recovery flow

#### Registration Screen
- [ ] Add terms and conditions acceptance
- [ ] Implement email verification process
- [ ] Add profile picture upload during registration
- [ ] Create step-by-step registration wizard
- [ ] Implement referral code field

#### Profile Screen
- [ ] Add achievement badges section
- [ ] Implement booking history with filtering
- [ ] Add favorite facilities section
- [ ] Create friends/connections management
- [ ] Implement notification preferences

### Facility Pages

#### Facility Discovery Screen
- [ ] Implement map view for facilities
- [ ] Add advanced filtering options
- [ ] Create "Near Me" feature using geolocation
- [ ] Add facility comparison tool
- [ ] Implement saved searches

#### Facility Detail Screen
- [ ] Add 360° virtual tour integration
- [ ] Implement photo gallery with zooming
- [ ] Add "Similar Facilities" section
- [ ] Create Q&A section for facility
- [ ] Implement "Share Facility" functionality

#### Facility Management (Owner)
- [ ] Create analytics dashboard for facility owners
- [ ] Implement booking management calendar
- [ ] Add special offers/promotions creation tool
- [ ] Implement customer management system
- [ ] Add revenue reports and forecasts

### Booking Pages

#### Booking Flow
- [ ] Create interactive time slot selection
- [ ] Implement recurring booking options
- [ ] Add player invitation system
- [ ] Implement split payment functionality
- [ ] Create waitlist option for full facilities

#### Booking Confirmation
- [ ] Generate QR code for facility check-in
- [ ] Add calendar integration options
- [ ] Implement booking sharing functionality
- [ ] Create booking modification options
- [ ] Add weather forecast for outdoor facilities

#### Booking History
- [ ] Implement filtering and sorting options
- [ ] Add rebooking functionality from history
- [ ] Create rating/review prompt after completion
- [ ] Implement receipt/invoice generation
- [ ] Add booking statistics and insights

### Payment Pages

#### Payment Methods
- [ ] Integrate multiple payment gateways
- [ ] Implement saved payment methods
- [ ] Add loyalty points payment option
- [ ] Create split payment interface
- [ ] Implement subscription billing

#### Checkout Process
- [ ] Create promo code validation
- [ ] Implement dynamic pricing based on time/demand
- [ ] Add booking insurance option
- [ ] Create tax calculation based on location
- [ ] Implement receipt generation

### Admin Pages

#### User Management
- [ ] Create user search and filtering
- [ ] Implement role management
- [ ] Add user activity logs
- [ ] Create user verification process
- [ ] Implement user communication tools

#### Facility Approval
- [ ] Create approval workflow with stages
- [ ] Implement verification checklist
- [ ] Add communication with facility owners
- [ ] Create rejection feedback system
- [ ] Implement automatic verification for trusted owners

#### Analytics Dashboard
- [ ] Create booking trends visualization
- [ ] Implement revenue reports by region/facility type
- [ ] Add user acquisition and retention metrics
- [ ] Create performance benchmarks
- [ ] Implement custom report generation

### New Features Implementation

#### Gym Subscription System
- [ ] Create subscription plan management
- [ ] Implement member check-in system
- [ ] Add attendance tracking and reports
- [ ] Create membership card generation
- [ ] Implement automatic renewal notifications

#### Private Coaching
- [ ] Create coach profile creation and verification
- [ ] Implement availability calendar
- [ ] Add session booking and payment
- [ ] Create coach search and filtering
- [ ] Implement session rating and feedback

#### Tournaments & Events
- [ ] Create tournament creation wizard
- [ ] Implement team registration system
- [ ] Add bracket generation and management
- [ ] Create live scoring interface
- [ ] Implement results and statistics tracking

#### Social Features
- [ ] Create friend/connection system
- [ ] Implement activity feed
- [ ] Add group creation and management
- [ ] Create in-app messaging
- [ ] Implement event invitations

#### Marketplace
- [ ] Create product listing interface
- [ ] Implement product search and filtering
- [ ] Add shopping cart and checkout
- [ ] Create seller ratings and reviews
- [ ] Implement order tracking

#### Featured Content & Advertising
- [ ] Create featured facility management system
- [ ] Implement tiered featuring options (bronze, silver, gold)
- [ ] Add banner ad creation and management
- [ ] Create targeting system based on user preferences
- [ ] Implement analytics for ad performance
- [ ] Add automated featuring recommendation system
- [ ] Create promotional campaign scheduling
- [ ] Implement A/B testing for ad effectiveness
- [ ] Add personalized recommendations engine
- [ ] Create featured content rotation system

## License

This project is licensed under the MIT License - see the LICENSE file for details.