'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabaseClient';
import * as UAParser from 'ua-parser-js';

type AnalyticsContextType = {
  trackEvent: (eventName: string, eventData?: any) => Promise<void>;
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Initialize device info
      const parser = new UAParser.UAParser();
      const result = parser.getResult();
      setDeviceInfo({
        browser: `${result.browser.name} ${result.browser.version}`,
        os: `${result.os.name} ${result.os.version}`,
        device: result.device.type || 'desktop'
      });

      // Start session
      startSession();

      // End session when component unmounts
      return () => {
        if (sessionId) {
          endSession();
        }
      };
    }
  }, []);

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionId && deviceInfo) {
      trackPageView();
    }
  }, [pathname, searchParams, sessionId, deviceInfo]);

  const getIpInfo = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      console.log('IP Info:', data); // Debug log
      return `${data.ip},${data.country_code},${data.city}`;
    } catch (error) {
      console.error('Error getting IP info:', error);
      return 'unknown';
    }
  };

  const startSession = async () => {
    try {
      const ipInfo = await getIpInfo();
      console.log('Starting session with:', { // Debug log
        user_id: user?.id,
        ip_info: ipInfo,
        device_info: deviceInfo
      });

      const { data, error } = await supabase.rpc('start_user_session', {
        p_user_id: user?.id || null,
        p_ip_address: ipInfo,
        p_browser: deviceInfo?.browser || 'unknown',
        p_os: deviceInfo?.os || 'unknown',
        p_device_type: deviceInfo?.device || 'unknown'
      });

      if (error) throw error;
      console.log('Session started:', data); // Debug log
      setSessionId(data.id);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const endSession = async () => {
    try {
      const { error } = await supabase.rpc('end_user_session', {
        p_session_id: sessionId
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const trackPageView = async () => {
    try {
      const ipInfo = await getIpInfo();
      const pageData = {
        p_user_id: user?.id || null,
        p_session_id: sessionId,
        p_page_path: pathname + (searchParams ? `?${searchParams}` : ''),
        p_referrer: document.referrer,
        p_ip_address: ipInfo,
        p_browser: deviceInfo?.browser || 'unknown',
        p_os: deviceInfo?.os || 'unknown',
        p_device_type: deviceInfo?.device || 'unknown'
      };

      console.log('Tracking page view:', pageData); // Debug log

      // First, try to insert directly into the page_views table
      const { error: insertError } = await supabase
        .from('page_views')
        .insert([
          {
            user_id: user?.id || null,
            session_id: sessionId,
            page_path: pathname + (searchParams ? `?${searchParams}` : ''),
            referrer: document.referrer,
            ip_address: ipInfo.split(',')[0],
            country_code: ipInfo.split(',')[1],
            city: ipInfo.split(',')[2],
            browser: deviceInfo?.browser || 'unknown',
            os: deviceInfo?.os || 'unknown',
            device_type: deviceInfo?.device || 'unknown'
          }
        ]);

      if (insertError) {
        console.error('Error inserting page view:', insertError);
        // Fallback to RPC if insert fails
        const { error: rpcError } = await supabase.rpc('record_page_view', pageData);
        if (rpcError) throw rpcError;
      }

    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const trackEvent = async (eventName: string, eventData: any = {}) => {
    try {
      const actionData = {
        user_id: user?.id || null,
        session_id: sessionId,
        action_type: eventName,
        action_data: eventData,
        page_path: pathname
      };

      console.log('Tracking event:', actionData); // Debug log

      // First, try to insert directly into the user_actions table
      const { error: insertError } = await supabase
        .from('user_actions')
        .insert([actionData]);

      if (insertError) {
        console.error('Error inserting user action:', insertError);
        // Fallback to RPC if insert fails
        const { error: rpcError } = await supabase.rpc('record_user_action', {
          p_user_id: user?.id || null,
          p_session_id: sessionId,
          p_action_type: eventName,
          p_action_data: eventData,
          p_page_path: pathname
        });
        if (rpcError) throw rpcError;
      }

    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
