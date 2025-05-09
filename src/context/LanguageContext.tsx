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
  // Facility Registration
  basic_info: {
    en: 'Basic Information',
    ar: 'المعلومات الأساسية'
  },
  facility_name_en: {
    en: 'Facility Name (English)',
    ar: 'اسم المنشآة (بالإنجليزية)'
  },
  facility_name_ar: {
    en: 'Facility Name (Arabic)',
    ar: 'اسم المنشآة (بالعربية)'
  },
  description_en: {
    en: 'Description (English)',
    ar: 'الوصف (بالإنجليزية)'
  },
  description_ar: {
    en: 'Description (Arabic)',
    ar: 'الوصف (بالعربية)'
  },
  primary_sport: {
    en: 'Primary Sport',
    ar: 'الرياضة الرئيسية'
  },
  select_sport: {
    en: 'Select a sport',
    ar: 'اختر رياضة'
  },
  football: {
    en: 'Football',
    ar: 'كرة القدم'
  },
  basketball: {
    en: 'Basketball',
    ar: 'كرة السلة'
  },
  tennis: {
    en: 'Tennis',
    ar: 'التنس'
  },
  padel: {
    en: 'Padel',
    ar: 'البادل'
  },
  volleyball: {
    en: 'Volleyball',
    ar: 'الكرة الطائرة'
  },
  location_info: {
    en: 'Location Information',
    ar: 'معلومات الموقع'
  },
  select_country: {
    en: 'Select a country',
    ar: 'اختر الدولة'
  },
  city: {
    en: 'City',
    ar: 'المدينة'
  },
  district: {
    en: 'District',
    ar: 'المنطقة'
  },
  street: {
    en: 'Street',
    ar: 'الشارع'
  },
  building: {
    en: 'Building',
    ar: 'المبنى'
  },
  postal_code: {
    en: 'Postal Code',
    ar: 'الرمز البريدي'
  },
  latitude: {
    en: 'Latitude',
    ar: 'خط العرض'
  },
  longitude: {
    en: 'Longitude',
    ar: 'خط الطول'
  },
  invalid_latitude: {
    en: 'Invalid latitude (must be between -90 and 90)',
    ar: 'خط العرض غير صحيح (يجب أن يكون بين -90 و 90)'
  },
  invalid_longitude: {
    en: 'Invalid longitude (must be between -180 and 180)',
    ar: 'خط الطول غير صحيح (يجب أن يكون بين -180 و 180)'
  },

  // Common
  appName: {
    en: 'Reyada Time',
    ar: 'وقت الرياضة'
  },
  signoutSuccess: {
    en: 'You have been signed out successfully',
    ar: 'تم تسجيل خروجك بنجاح'
  },
  login: {
    en: 'Login',
    ar: 'تسجيل الدخول'
  },
  signUp: {
    en: 'Sign Up',
    ar: 'إنشاء حساب'
  },
  phoneNumber: {
    en: 'Phone Number',
    ar: 'رقم الهاتف'
  },
  phoneNumberPlaceholder: {
    en: '5000 5000',
    ar: '5000 5000'
  },
  phoneNumberRequired: {
    en: 'Phone number is required',
    ar: 'رقم الهاتف مطلوب'
  },
  signUpError: {
    en: 'An error occurred during signup',
    ar: 'حدث خطأ أثناء إنشاء الحساب'
  },
  errorFetchingCountries: {
    en: 'Error fetching countries',
    ar: 'خطأ في جلب قائمة الدول'
  },
  logout: {
    en: 'Logout',
    ar: 'تسجيل الخروج'
  },

  password: {
    en: 'Password',
    ar: 'كلمة المرور'
  },
  firstName: {
    en: 'First Name',
    ar: 'الاسم الأول'
  },
  lastName: {
    en: 'Last Name',
    ar: 'اسم العائلة'
  },
  firstNamePlaceholder: {
    en: 'John',
    ar: 'محمد'
  },
  lastNamePlaceholder: {
    en: 'Wick',
    ar: 'أحمد'
  },
  firstNameRequired: {
    en: 'First name is required',
    ar: 'الاسم الأول مطلوب'
  },
  lastNameRequired: {
    en: 'Last name is required',
    ar: 'اسم العائلة مطلوب'
  },


  cancel: {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  home: {
    en: 'Home',
    ar: 'الرئيسية'
  },

  profile: {
    en: 'Profile',
    ar: 'الملف الشخصي'
  },

  facilities: {
    en: 'Sports Facilities',
    ar: 'المنشآت الرياضية'
  },

  admin: {
    en: 'Admin Dashboard',
    ar: 'لوحة التحكم'
  },
  
  // Home page
  heroTitle: {
    en: 'Book Your Favorite Sports Facilities',
    ar: 'احجز منشآتك الرياضية المفضلة'
  },
  heroSubtitle: {
    en: 'Find and book sports facilities across Arab countries',
    ar: 'ابحث واحجز المرافق الرياضية في جميع أنحاء الدول العربية'
  },
  getStarted: {
    en: 'Get Started',
    ar: 'ابدأ الآن'
  },
  exploreFacilities: {
    en: 'Explore Facilities',
    ar: 'استكشف المنشآت'
  },
  popularFacilities: {
    en: 'Popular Facilities',
    ar: 'المنشآت الشائعة'
  },
  featuredFacilities: {
    en: 'Featured Facilities',
    ar: 'المنشآت المميزة'
  },
  search: {
    en: 'Search',
    ar: 'بحث'
  },
  viewAll: {
    en: 'View All',
    ar: 'عرض الكل'
  },
  hourRate: {
    en: 'hour',
    ar: 'ساعة'
  },
  howItWorks: {
    en: 'How It Works',
    ar: 'كيف يعمل'
  },
  findFacility: {
    en: 'Find a Facility',
    ar: 'ابحث عن منشأة'
  },
  findFacilityDesc: {
    en: 'Browse through our collection of sports facilities and find the perfect one for your activity.',
    ar: 'تصفح مجموعتنا من المنشآت الرياضية واعثر على المنشأة المثالية لنشاطك.'
  },
  bookSlot: {
    en: 'Book a Time Slot',
    ar: 'احجز موعدًا'
  },
  bookSlotDesc: {
    en: 'Select your preferred date and time, and secure your booking instantly.',
    ar: 'اختر التاريخ والوقت المفضلين لديك، وقم بتأمين حجزك على الفور.'
  },
  playAndEnjoy: {
    en: 'Play & Enjoy',
    ar: 'العب واستمتع'
  },
  playAndEnjoyDesc: {
    en: 'Show up at the facility, play your favorite sport, and have a great time!',
    ar: 'احضر إلى الملعب، والعب رياضتك المفضلة، واقضِ وقتًا ممتعًا!'
  },
  downloadApp: {
    en: 'Download Our Mobile App',
    ar: 'حمّل تطبيقنا للهاتف المحمول'
  },
  downloadAppDesc: {
    en: 'Get the best experience with our mobile app. Book facilities, track your bookings, and more!',
    ar: 'احصل على أفضل تجربة مع تطبيقنا للهاتف المحمول. احجز الملاعب، وتتبع حجوزاتك، والمزيد!'
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
  welcomeBack: {
    en: 'Welcome back',
    ar: 'مرحباً بعودتك'
  },
  orContinueWith: {
    en: 'Or continue with',
    ar: 'أو المتابعة باستخدام'
  },
  continueWithGoogle: {
    en: 'Continue with Google',
    ar: 'المتابعة باستخدام Google'
  },
  continueWithApple: {
    en: 'Continue with Apple',
    ar: 'المتابعة باستخدام Apple'
  },
  signInError: {
    en: 'Error signing in with Apple',
    ar: 'خطأ في تسجيل الدخول باستخدام Apple'
  },
  rememberMe: {
    en: 'Remember me',
    ar: 'تذكرني'
  },
  email: {
    en: 'Email',
    ar: 'البريد الإلكتروني'
  },
  emailRequired: {
    en: 'Email is required',
    ar: 'البريد الإلكتروني مطلوب'
  },
  emailInvalid: {
    en: 'Invalid email address',
    ar: 'عنوان البريد الإلكتروني غير صالح'
  },
  passwordRequired: {
    en: 'Password is required',
    ar: 'كلمة المرور مطلوبة'
  },
  passwordTooShort: {
    en: 'Password must be at least 6 characters',
    ar: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'
  },
  passwordsDoNotMatch: {
    en: 'Passwords do not match',
    ar: 'كلمات المرور غير متطابقة'
  },
  countryRequired: {
    en: 'Country is required',
    ar: 'الدولة مطلوبة'
  },
  confirmPassword: {
    en: 'Confirm Password',
    ar: 'تأكيد كلمة المرور'
  },

  selectCountry: {
    en: 'Select Country',
    ar: 'اختر الدولة'
  },
  loginSuccess: {
    en: 'Login successful!',
    ar: 'تم تسجيل الدخول بنجاح!'
  },
  loginError: {
    en: 'Login failed. Please try again.',
    ar: 'فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى.'
  },
  signupSuccess: {
    en: 'Account created successfully!',
    ar: 'تم إنشاء الحساب بنجاح!'
  },
  signupError: {
    en: 'Failed to create account. Please try again.',
    ar: 'فشل في إنشاء الحساب. الرجاء المحاولة مرة أخرى.'
  },
  
  // Facilities page
  facilitiesTitle: {
    en: 'Sports Facilities',
    ar: 'المنشآت الرياضية'
  },
  facilityNotFound: {
    en: 'Facility Not Found',
    ar: 'لم يتم العثور على المنشأة'
  },
  facilityNotFoundDesc: {
    en: 'The facility you are looking for does not exist or has been removed.',
    ar: 'المنشأة التي تبحث عنها غير موجودة أو تم إزالتها.'
  },
  backToFacilities: {
    en: 'Back to Facilities',
    ar: 'العودة إلى المنشآت'
  },
  reviews: {
    en: 'reviews',
    ar: 'مراجعات'
  },
  capacity: {
    en: 'Capacity',
    ar: 'السعة'
  },
  amenities: {
    en: 'Amenities',
    ar: 'المرافق'
  },
  openingHours: {
    en: 'Opening Hours',
    ar: 'ساعات العمل'
  },
  weekdays: {
    en: 'Weekdays',
    ar: 'أيام الأسبوع'
  },
  weekends: {
    en: 'Weekends',
    ar: 'عطلة نهاية الأسبوع'
  },
  bookThisFacility: {
    en: 'Book This Facility',
    ar: 'احجز هذا المنشأة'
  },
  selectDate: {
    en: 'Select Date',
    ar: 'اختر التاريخ'
  },
  selectTime: {
    en: 'Select Time',
    ar: 'اختر الوقت'
  },
  duration: {
    en: 'Duration',
    ar: 'المدة'
  },
  hours: {
    en: 'hours',
    ar: 'ساعات'
  },
  hour: {
    en: 'hour',
    ar: 'ساعة'
  },
  numberOfPlayers: {
    en: 'Number of Players',
    ar: 'عدد اللاعبين'
  },
  sportType: {
    en: 'Sport Type',
    ar: 'نوع الرياضة'
  },
  selectSportType: {
    en: 'Select Sport Type',
    ar: 'اختر نوع الرياضة'
  },
  players: {
    en: 'players',
    ar: 'لاعبين'
  },
  totalPrice: {
    en: 'Total Price',
    ar: 'السعر الإجمالي'
  },
  loginToBook: {
    en: 'You need to be logged in to book this facility.',
    ar: 'يجب أن تكون مسجلاً لحجز هذا الملعب.'
  },
  // Bookings page
  bookings: {
    en: 'Bookings',
    ar: 'الحجوزات'
  },
  myBookings: {
    en: 'My Bookings',
    ar: 'حجوزاتي'
  },
  upcomingBookings: {
    en: 'Upcoming Bookings',
    ar: 'الحجوزات القادمة'
  },
  pastBookings: {
    en: 'Past Bookings',
    ar: 'الحجوزات السابقة'
  },
  noUpcomingBookings: {
    en: 'No Upcoming Bookings',
    ar: 'لا توجد حجوزات قادمة'
  },
  noUpcomingBookingsDesc: {
    en: 'You don\'t have any upcoming bookings. Explore facilities to book one.',
    ar: 'ليس لديك أي حجوزات قادمة. استكشف الملاعب لحجز واحد.'
  },
  noPastBookings: {
    en: 'No Past Bookings',
    ar: 'لا توجد حجوزات سابقة'
  },
  noPastBookingsDesc: {
    en: 'You haven\'t made any bookings yet. Explore facilities to book one.',
    ar: 'لم تقم بأي حجوزات بعد. استكشف الملاعب لحجز واحد.'
  },
  // Profile page
  myProfile: {
    en: 'My Profile',
    ar: 'ملفي الشخصي'
  },
  phone: {
    en: 'Phone Number',
    ar: 'رقم الهاتف'
  },
  changePhoto: {
    en: 'Change Photo',
    ar: 'تغيير الصورة'
  },
  profilePicture: {
    en: 'Profile Picture',
    ar: 'الصورة الشخصية'
  },
  saving: {
    en: 'Saving...',
    ar: 'جاري الحفظ...'
  },
  saveChanges: {
    en: 'Save Changes',
    ar: 'حفظ التغييرات'
  },
  loading: {
    en: 'Loading...',
    ar: 'جاري التحميل...'
  },
  date: {
    en: 'Date',
    ar: 'التاريخ'
  },
  time: {
    en: 'Time',
    ar: 'الوقت'
  },
  confirmed: {
    en: 'Confirmed',
    ar: 'مؤكد'
  },
  pending: {
    en: 'Pending',
    ar: 'قيد الانتظار'
  },
  completed: {
    en: 'Completed',
    ar: 'مكتمل'
  },
  cancelled: {
    en: 'Cancelled',
    ar: 'ملغي'
  },
  cancelledByFacility: {
    en: 'Cancelled by Facility',
    ar: 'ملغي من قبل المنشأة'
  },
  cancelBooking: {
    en: 'Cancel Booking',
    ar: 'إلغاء الحجز'
  },
  viewFacility: {
    en: 'View Facility',
    ar: 'عرض المنشأة'
  },
  leaveReview: {
    en: 'Leave Review',
    ar: 'اترك تقييماً'
  },
  bookAgain: {
    en: 'Book Again',
    ar: 'احجز مرة أخرى'
  },
  searchFacilities: {
    en: 'Search facilities',
    ar: 'البحث عن منشآت'
  },
  filterBy: {
    en: 'Filter by',
    ar: 'تصفية حسب'
  },
  sportType: {
    en: 'Sport Type',
    ar: 'نوع الرياضة'
  },
  facilityLocation: {
    en: 'Location',
    ar: 'الموقع'
  },
  facilityPrice: {
    en: 'Price',
    ar: 'السعر'
  },
  facilityRating: {
    en: 'Rating',
    ar: 'التقييم'
  },
  facilityBookNow: {
    en: 'Book Now',
    ar: 'احجز الآن'
  },
  facilityDetails: {
    en: 'View Details',
    ar: 'عرض التفاصيل'
  },
  facilityFilters: {
    en: 'Filters',
    ar: 'التصفية'
  },
  facilityResetFilters: {
    en: 'Reset Filters',
    ar: 'إعادة ضبط التصفية'
  },
  facilityApplyFilters: {
    en: 'Apply Filters',
    ar: 'تطبيق التصفية'
  },
  facilityAllSports: {
    en: 'All Sports',
    ar: 'جميع الرياضات'
  },
  facilityAllLocations: {
    en: 'All Locations',
    ar: 'جميع المواقع'
  },
  facilityFeatured: {
    en: 'Featured',
    ar: 'مميز'
  },
  
  // Sports types
  sportFootball: {
    en: 'Football',
    ar: 'كرة القدم'
  },
  sportBasketball: {
    en: 'Basketball',
    ar: 'كرة السلة'
  },
  sportVolleyball: {
    en: 'Volleyball',
    ar: 'الكرة الطائرة'
  },
  sportTennis: {
    en: 'Tennis',
    ar: 'التنس'
  },
  sportPadel: {
    en: 'Padel',
    ar: 'بادل'
  },
  sportSwimming: {
    en: 'Swimming',
    ar: 'السباحة'
  },
  sportGym: {
    en: 'Gym',
    ar: 'صالة رياضية'
  },
  
  // Contact page
  contact: {
    en: 'Contact',
    ar: 'تواصل'
  },
  contactUs: {
    en: 'Contact Us',
    ar: 'تواصل بنا'
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
  },
  
  // Footer
  footerLinks: {
    en: 'Quick Links',
    ar: 'روابط سريعة'
  },
  footerSports: {
    en: 'Sport Types',
    ar: 'أنواع الرياضة'
  },
  footerLegal: {
    en: 'Legal',
    ar: 'قانوني'
  },
  footerTerms: {
    en: 'Terms of Service',
    ar: 'شروط الخدمة'
  },
  footerRights: {
    en: 'All Rights Reserved',
    ar: 'جميع الحقوق محفوظة'
  },
  footerDescription: {
    en: 'Book sports facilities across Arab countries with ease.',
    ar: 'احجز المنشآت الرياضية في جميع أنحاء الدول العربية بسهولة.'
  },
  
  // Mobile navigation
  navBookings: {
    en: 'Bookings',
    ar: 'الحجوزات'
  },
  navFacilities: {
    en: 'Facilities',
    ar: 'المنشآت'
  },

  // Settings page
  preferences: {
    en: 'Preferences',
    ar: 'التفضيلات'
  },
  darkMode: {
    en: 'Dark Mode',
    ar: 'الوضع الداكن'
  },
  emailNotifications: {
    en: 'Email Notifications',
    ar: 'إشعارات البريد الإلكتروني'
  },
  pushNotifications: {
    en: 'Push Notifications',
    ar: 'الإشعارات المنبثقة'
  },
  settingsSaved: {
    en: 'Settings saved successfully',
    ar: 'تم حفظ الإعدادات بنجاح'
  },
  settingsError: {
    en: 'Error saving settings',
    ar: 'خطأ في حفظ الإعدادات'
  },

  // Notifications page
  noNotifications: {
    en: 'No notifications',
    ar: 'لا توجد إشعارات'
  },
  noNotificationsDesc: {
    en: 'You have no notifications at the moment',
    ar: 'ليس لديك إشعارات في الوقت الحالي'
  },
  markAsRead: {
    en: 'Mark as read',
    ar: 'تحديد كمقروء'
  },

  // Contact page
  sendMessage: {
    en: 'Send Message',
    ar: 'إرسال رسالة'
  },
  contactInfo: {
    en: 'Contact Information',
    ar: 'معلومات الاتصال'
  },
  subject: {
    en: 'Subject',
    ar: 'الموضوع'
  },
  sending: {
    en: 'Sending...',
    ar: 'جاري الإرسال...'
  },
  send: {
    en: 'Send',
    ar: 'إرسال'
  },
  contactError: {
    en: 'Error sending message',
    ar: 'خطأ في إرسال الرسالة'
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
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

  const t = (key: string, params?: Record<string, any>): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    const translation = translations[key][language];
    if (!params) return translation;

    return Object.entries(params).reduce((acc, [key, value]) => {
      return acc.replace(`{${key}}`, String(value));
    }, translation);
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
