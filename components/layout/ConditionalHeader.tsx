'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

/**
 * Conditionally renders the Header component
 * Hides header on admin and company dashboard pages (they have their own headers)
 */
export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on admin, company dashboard, or company landing pages
  const hideHeader = 
    pathname?.startsWith('/admin/dashboard') || 
    pathname?.startsWith('/company/dashboard') ||
    pathname?.startsWith('/company/') && !pathname?.includes('/company/login');
  
  if (hideHeader) {
    return null;
  }
  
  return <Header />;
}

