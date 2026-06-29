'use client';

import { useEffect } from 'react';

export default function TimezoneProvider() {
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const match = document.cookie.match(new RegExp('(^| )user-timezone=([^;]+)'));
      const currentTz = match ? match[2] : null;

      if (currentTz !== tz) {
        document.cookie = `user-timezone=${tz}; path=/; max-age=${60 * 60 * 24 * 365}`;
      }
    } catch (e) {
      console.error('Failed to set timezone cookie', e);
    }
  }, []);

  return null;
}
