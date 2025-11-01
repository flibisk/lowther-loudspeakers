// Internationalization routing utilities for multi-language support

import { SupportedLanguage, languages } from './i18n';

export interface RouteConfig {
  path: string;
  locale?: SupportedLanguage;
}

export interface LocalizedRoute {
  [key: string]: string; // language code -> localized path
}

// Route configuration for different languages
export const localizedRoutes: Record<string, LocalizedRoute> = {
  '/': {
    en: '/',
    fr: '/fr',
    de: '/de',
    ja: '/ja',
    es: '/es',
    it: '/it',
  },
  '/category/loudspeakers': {
    en: '/category/loudspeakers',
    fr: '/fr/category/loudspeakers',
    de: '/de/category/loudspeakers',
    ja: '/ja/category/loudspeakers',
    es: '/es/category/loudspeakers',
    it: '/it/category/loudspeakers',
  },
  '/category/drive-units': {
    en: '/category/drive-units',
    fr: '/fr/category/drive-units',
    de: '/de/category/drive-units',
    ja: '/ja/category/drive-units',
    es: '/es/category/drive-units',
    it: '/it/category/drive-units',
  },
  '/category/cables': {
    en: '/category/cables',
    fr: '/fr/category/cables',
    de: '/de/category/cables',
    ja: '/ja/category/cables',
    es: '/es/category/cables',
    it: '/it/category/cables',
  },
  '/build-a-lowther': {
    en: '/build-a-lowther',
    fr: '/fr/build-a-lowther',
    de: '/de/build-a-lowther',
    ja: '/ja/build-a-lowther',
    es: '/es/build-a-lowther',
    it: '/it/build-a-lowther',
  },
  '/blog': {
    en: '/blog',
    fr: '/fr/blog',
    de: '/de/blog',
    ja: '/ja/blog',
    es: '/es/blog',
    it: '/it/blog',
  },
  '/listen': {
    en: '/listen',
    fr: '/fr/listen',
    de: '/de/listen',
    ja: '/ja/listen',
    es: '/es/listen',
    it: '/it/listen',
  },
  '/contact': {
    en: '/contact',
    fr: '/fr/contact',
    de: '/de/contact',
    ja: '/ja/contact',
    es: '/es/contact',
    it: '/it/contact',
  },
};

export function getLocalizedPath(path: string, language: SupportedLanguage): string {
  const routeConfig = localizedRoutes[path];
  if (!routeConfig) {
    // If no specific route config exists, return the original path
    return path;
  }
  
  return routeConfig[language] || routeConfig.en || path;
}

export function getLanguageFromPath(path: string): SupportedLanguage | null {
  const pathSegments = path.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  // Check if first segment is a language code
  const language = languages.find(lang => lang.code === firstSegment);
  return language ? language.code as SupportedLanguage : null;
}

export function removeLanguageFromPath(path: string): string {
  const pathSegments = path.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  // Check if first segment is a language code
  const isLanguageCode = languages.some(lang => lang.code === firstSegment);
  
  if (isLanguageCode) {
    return '/' + pathSegments.slice(1).join('/');
  }
  
  return path;
}

export function generateAlternateUrls(path: string): Record<SupportedLanguage, string> {
  const basePath = removeLanguageFromPath(path);
  const alternateUrls: Record<string, string> = {};
  
  languages.forEach(language => {
    const localizedPath = getLocalizedPath(basePath, language.code as SupportedLanguage);
    alternateUrls[language.code] = localizedPath;
  });
  
  return alternateUrls as Record<SupportedLanguage, string>;
}
