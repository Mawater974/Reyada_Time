'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

type Translations = {
  [key: string]: {
    en: string;
    ar: string;
  };
};

const translations: Translations = {
  // Common
  appName: {
    en: 'Reyada Time',
    ar: 'وقت الرياضة'
  },
  login: {
    en: 'Login',
    ar: 'تسجيل الدخول'
  },
  signup: {
    en: 'Sign Up',
    ar: 'إنشاء حساب'
  },
  logout: {
    en: 'Logout',
    ar: 'تسجيل الخروج'
  },
  email: {
    en: 'Email',
    ar: 'البريد الإلكتروني'
  },
  password: {
    en: 'Password',
    ar: 'كلمة المرور'
  },
  name: {
    en: 'Name',
    ar: 'الاسم'
  },
  country: {
    en: 'Country',
    ar: 'الدولة'
  },
  submit: {
    en: 'Submit',
    ar: 'إرسال'
  },
  cancel: {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  
  // Home page
  heroTitle: {
    en: 'Book Your Favorite Sports Facilities',
    ar: 'احجز ملاعبك الرياضية المفضلة'
  },
  heroSubtitle: {
    en: 'Find and book sports facilities across Arab countries',
    ar: 'ابحث واحجز المرافق الرياضية في جميع أنحاء الدول العربية'
  },
  exploreFacilities: {
    en: 'Explore Facilities',
    ar: 'استكشف الملاعب'
  },
  popularFacilities: {
    en: 'Popular Facilities',
    ar: 'الملاعب الشائعة'
  },
  featuredFacilities: {
    en: 'Featured Facilities',
    ar: 'الملاعب المميزة'
  },
  
  // Auth pages
  loginTitle: {
    en: 'Welcome Back',
    ar: 'مرحبًا بعودتك'
  },
  loginSubtitle: {
    en: 'Sign in to your account',
    ar: 'تسجيل الدخول إلى حسابك'
  },
  noAccount: {
    en: 'Don\'t have an account?',
    ar: 'ليس لديك حساب؟'
  },
  signupTitle: {
    en: 'Create an Account',
    ar: 'إنشاء حساب جديد'
  },
  signupSubtitle: {
    en: 'Join Reyada Time to book sports facilities',
    ar: 'انضم إلى وقت الرياضة لحجز الملاعب الرياضية'
  },
  haveAccount: {
    en: 'Already have an account?',
    ar: 'لديك حساب بالفعل؟'
  },
  forgotPassword: {
    en: 'Forgot Password?',
    ar: 'نسيت كلمة المرور؟'
  },
  
  // Facilities page
  facilitiesTitle: {
    en: 'Sports Facilities',
    ar: 'الملاعب الرياضية'
  },
  searchFacilities: {
    en: 'Search facilities',
    ar: 'البحث عن ملاعب'
  },
  filterBy: {
    en: 'Filter by',
    ar: 'تصفية حسب'
  },
  sportType: {
    en: 'Sport Type',
    ar: 'نوع الرياضة'
  },
  location: {
    en: 'Location',
    ar: 'الموقع'
  },
  price: {
    en: 'Price',
    ar: 'السعر'
  },
  rating: {
    en: 'Rating',
    ar: 'التقييم'
  },
  bookNow: {
    en: 'Book Now',
    ar: 'احجز الآن'
  },
  viewDetails: {
    en: 'View Details',
    ar: 'عرض التفاصيل'
  },
  
  // Sports types
  football: {
    en: 'Football',
    ar: 'كرة القدم'
  },
  basketball: {
    en: 'Basketball',
    ar: 'كرة السلة'
  },
  volleyball: {
    en: 'Volleyball',
    ar: 'الكرة الطائرة'
  },
  tennis: {
    en: 'Tennis',
    ar: 'التنس'
  },
  padel: {
    en: 'Padel',
    ar: 'بادل'
  },
  swimming: {
    en: 'Swimming',
    ar: 'السباحة'
  },
  gym: {
    en: 'Gym',
    ar: 'صالة رياضية'
  },
  
  // Contact page
  contactUs: {
    en: 'Contact Us',
    ar: 'اتصل بنا'
  },
  contactMessage: {
    en: 'Message',
    ar: 'الرسالة'
  },
  contactSuccess: {
    en: 'Your message has been sent successfully!',
    ar: 'تم إرسال رسالتك بنجاح!'
  },
  
  // Privacy policy
  privacyPolicy: {
    en: 'Privacy Policy',
    ar: 'سياسة الخصوصية'
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [dir, setDir] = useState('ltr');

  useEffect(() => {
    // Check if language is stored in localStorage
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'ar')) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    // Update direction based on language
    setDir(language === 'ar' ? 'rtl' : 'ltr');
    // Store language preference
    localStorage.setItem('language', language);
    // Update HTML dir attribute
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
