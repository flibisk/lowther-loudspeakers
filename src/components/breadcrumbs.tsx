'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

// Map breadcrumb labels to section IDs on the products page
const sectionMap: Record<string, string> = {
  'Masterpieces': 'masterpieces',
  'Our Masterpieces': 'masterpieces',
  'Instruments': 'instruments',
  'Our Instruments': 'instruments',
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  useEffect(() => {
    // Generate BreadcrumbList schema for SEO
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lowtherloudspeakers.com";
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.href ? `${baseUrl}${item.href}` : undefined,
      })).filter(item => item.item !== undefined), // Only include items with URLs
    };

    // Add schema to page head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbSchema);
    script.id = 'breadcrumb-schema';
    
    // Remove existing breadcrumb schema if any
    const existing = document.getElementById('breadcrumb-schema');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById('breadcrumb-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [items]);

  // Handle scrolling to sections when hash is present
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Wait for page to be fully loaded
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const headerOffset = 100; // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, []);

  const getLinkHref = (href: string, label: string): string => {
    // If linking to products page, check if we should scroll to a section
    if (href === '/products') {
      const sectionId = sectionMap[label];
      if (sectionId) {
        return `/products#${sectionId}`;
      }
    }
    return href;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="pl-6 930:pl-16 pr-6 py-4">
        <ol className="flex items-center space-x-2 text-sm overflow-hidden">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;
            // On mobile, truncate middle items but keep first and last visible
            const shouldTruncate = !isFirst && !isLast;
            
            return (
              <li key={index} className={`flex items-center ${shouldTruncate ? 'min-w-0 flex-shrink' : 'flex-shrink-0'}`}>
                {index > 0 && (
                  <span className="mx-2 text-gray-400 flex-shrink-0">/</span>
                )}
                {item.href ? (
                  <Link 
                    href={getLinkHref(item.href, item.label)}
                    className={`text-gray-600 hover:text-[#c59862] transition-colors ${
                      shouldTruncate ? 'truncate max-w-[120px] 930:max-w-none 930:overflow-visible 930:whitespace-normal' : ''
                    }`}
                    title={shouldTruncate ? item.label : undefined}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={`text-gray-900 ${shouldTruncate ? 'truncate max-w-[120px] 930:max-w-none 930:overflow-visible 930:whitespace-normal' : ''}`}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

