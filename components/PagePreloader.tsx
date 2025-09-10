"use client";

import { useCardSections } from '@/hooks/CardSectionsContext';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PagePreloader() {
  const { preloadPageSections, isSessionLoaded } = useCardSections();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && isSessionLoaded) {
      preloadPageSections(pathname);
    }
  }, [pathname, preloadPageSections, isSessionLoaded]);

  return null;
}
