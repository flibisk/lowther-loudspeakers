// Next.js internationalization configuration

import { SupportedLanguage, languages } from './i18n';

export const i18nConfig = {
  // List of supported locales
  locales: languages.map(lang => lang.code) as SupportedLanguage[],
  
  // Default locale
  defaultLocale: 'en' as SupportedLanguage,
  
  // Locale detection strategy
  localeDetection: true,
  
  // Domain configuration for different languages (optional)
  domains: [
    {
      domain: 'lowtherloudspeakers.com',
      defaultLocale: 'en',
    },
    {
      domain: 'fr.lowtherloudspeakers.com',
      defaultLocale: 'fr',
    },
    {
      domain: 'de.lowtherloudspeakers.com',
      defaultLocale: 'de',
    },
    {
      domain: 'ja.lowtherloudspeakers.com',
      defaultLocale: 'ja',
    },
    {
      domain: 'es.lowtherloudspeakers.com',
      defaultLocale: 'es',
    },
    {
      domain: 'it.lowtherloudspeakers.com',
      defaultLocale: 'it',
    },
  ],
};

// Helper functions for Next.js i18n
export function getLocaleFromRequest(request: Request): SupportedLanguage {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  // Check if first segment is a supported locale
  if (i18nConfig.locales.includes(firstSegment as SupportedLanguage)) {
    return firstSegment as SupportedLanguage;
  }
  
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLanguage = acceptLanguage.split(',')[0].split('-')[0];
    if (i18nConfig.locales.includes(preferredLanguage as SupportedLanguage)) {
      return preferredLanguage as SupportedLanguage;
    }
  }
  
  return i18nConfig.defaultLocale;
}

export function shouldRedirectToLocalizedPath(pathname: string, locale: SupportedLanguage): boolean {
  // Don't redirect if already on the correct localized path
  if (pathname.startsWith(`/${locale}`)) {
    return false;
  }
  
  // Don't redirect if it's the default locale and no prefix
  if (locale === i18nConfig.defaultLocale && !pathname.startsWith('/en')) {
    return false;
  }
  
  return true;
}
