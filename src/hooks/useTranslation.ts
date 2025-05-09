import { useCallback } from 'react';

export function useTranslation() {
  const t = useCallback((key: string, params?: Record<string, any>) => {
    // TODO: Implement actual translation logic
    return key;
  }, []);

  return { t };
}
