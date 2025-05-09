import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wkxfmelduwxdperojycz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndreGZtZWxkdXd4ZHBlcm9qeWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTU5MjksImV4cCI6MjA2MjIzMTkyOX0.uwkr3g_-OmSfnv0KapFPg1LoV-GYbyLxO7kX0_gyNY8';

// Create a single supabase client for the entire app
let supabase: ReturnType<typeof createClient>;

if (typeof window === 'undefined') {
  // Server-side: Create a new client for each request
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
} else {
  // Client-side: Create a single client for the browser
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      storage: window.localStorage,
    },
  });
}

export { supabase };
