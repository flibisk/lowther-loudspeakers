'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
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

