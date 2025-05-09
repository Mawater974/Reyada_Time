# Reyada Time

A Next.js application for time tracking and analytics.

## Features

- **User Authentication**: Secure login and registration system
- **Time Tracking**: Track time spent on various activities
- **Analytics Dashboard**: View detailed analytics and insights (admin only)
- **Multi-language Support**: Support for English and Arabic
- **Dark Mode**: Built-in dark mode support
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

1. **Prerequisites**
   - Node.js 18 or later
   - Supabase account and project
   - npm or yarn

2. **Environment Setup**
   ```bash
   # Copy example env file
   cp .env.example .env.local
   
   # Fill in your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Installation**
   ```bash
   # Install dependencies
   npm install
   # or
   yarn install
   ```

4. **Database Setup**
   ```bash
   # Run migrations
   npm run migrate
   # or
   yarn migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Analytics System

The application includes a comprehensive analytics system for tracking user engagement. For detailed documentation of the analytics functions and tables, see [Analytics Documentation](./docs/analytics-functions.md).

Key features:
- Page view tracking
- Session tracking
- User action logging
- Geographic data collection
- Admin-only access to analytics data

## Admin Access

To access the admin dashboard:
1. Log in with an admin account
2. Click your profile picture
3. Select 'Admin' from the dropdown menu

Admin features include:
- View daily page views
- Monitor user engagement
- Track geographic distribution of users
- Analyze user sessions

## Documentation

- [Analytics Functions](./docs/analytics-functions.md)
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/schema.md)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
