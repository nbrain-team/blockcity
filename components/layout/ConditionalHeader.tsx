'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

/**
 * Conditionally renders the Header component
 * Hides header on admin and company dashboard pages (they have their own headers)
 */
export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on admin or company dashboard pages
  const hideHeader = 
    pathname?.startsWith('/admin/dashboard') || 
    pathname?.startsWith('/company/dashboard');
  
  if (hideHeader) {
    return null;
  }
  
  return <Header />;
}

