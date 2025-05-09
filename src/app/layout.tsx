import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';
import Navbar from '@/components/layout/Navbar';
import MobileNavbar from '@/components/layout/MobileNavbar';
import Footer from '@/components/layout/Footer';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Reyada Time - Sports Booking App",
  description: "Book your favorite sports facilities across Arab countries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            <ThemeProvider>
              <div className="flex flex-col min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900 dark:text-white pt-16">
                <AnalyticsProvider>
                  <Navbar />
                  <main className="flex-grow pb-16 md:pb-0">{children}</main>
                  <Footer />
                  <MobileNavbar />
                </AnalyticsProvider>
              </div>
              <Toaster position="top-center" />
            </ThemeProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
