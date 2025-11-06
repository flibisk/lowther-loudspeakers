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

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="pl-6 930:pl-16 pr-6 py-4">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
              {item.href ? (
                <Link 
                  href={item.href}
                  className="text-gray-600 hover:text-[#c59862] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

