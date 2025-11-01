# Internationalization (i18n) Infrastructure

This document outlines the internationalization infrastructure set up for the Lowther Loudspeakers website, designed to support multiple languages and regions.

## 🌍 Supported Languages

- **English (UK)** - `en` - 🇬🇧 (Default)
- **Français** - `fr` - 🇫🇷
- **Deutsch** - `de` - 🇩🇪
- **日本語** - `ja` - 🇯🇵
- **Español** - `es` - 🇪🇸
- **Italiano** - `it` - 🇮🇹

## 📁 File Structure

```
src/
├── lib/
│   ├── i18n.ts                    # Core i18n configuration and translations
│   ├── i18n-routing.ts            # URL routing for different languages
│   └── next-i18n-config.ts        # Next.js i18n configuration
├── hooks/
│   └── use-translations.ts        # React hooks for translations
├── components/
│   ├── language-selector.tsx      # Language selection component
│   └── site-header.tsx            # Header with integrated language selector
└── docs/
    └── INTERNATIONALIZATION.md    # This documentation
```

## 🔧 Core Components

### 1. Language Configuration (`src/lib/i18n.ts`)

Contains the core language configuration, supported languages, and translation strings.

**Key exports:**
- `SupportedLanguage` - TypeScript type for supported language codes
- `LanguageConfig` - Interface for language configuration
- `languages` - Array of all supported languages
- `translations` - Translation strings for all languages
- `getLanguageByCode()` - Helper function to get language config by code

### 2. Translation Hooks (`src/hooks/use-translations.ts`)

React hooks for managing translations and language state.

**Key exports:**
- `TranslationProvider` - Context provider for translations
- `useTranslations()` - Hook to access translation context
- `useLanguage()` - Hook to get/set current language
- `useT()` - Hook to get translation function

### 3. Language Selector (`src/components/language-selector.tsx`)

Dropdown component for language selection with flags and proper styling.

**Features:**
- Visual flag indicators
- Dropdown with all supported languages
- Hover states and transitions
- Integration with translation system

### 4. Routing Configuration (`src/lib/i18n-routing.ts`)

URL routing utilities for different languages.

**Key exports:**
- `getLocalizedPath()` - Get localized URL for a given path and language
- `getLanguageFromPath()` - Extract language from URL path
- `removeLanguageFromPath()` - Remove language prefix from path
- `generateAlternateUrls()` - Generate alternate language URLs for SEO

## 🚀 Usage Examples

### Basic Translation Usage

```tsx
import { useT } from '@/hooks/use-translations';

function MyComponent() {
  const t = useT();
  
  return (
    <div>
      <h1>{t.nav.home}</h1>
      <p>{t.utility.contactUs}</p>
    </div>
  );
}
```

### Language Selection

```tsx
import { useLanguage } from '@/hooks/use-translations';
import { LanguageSelector } from '@/components/language-selector';

function Header() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <header>
      <LanguageSelector 
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
    </header>
  );
}
```

### URL Localization

```tsx
import { getLocalizedPath } from '@/lib/i18n-routing';

const localizedUrl = getLocalizedPath('/category/loudspeakers', 'fr');
// Returns: '/fr/category/loudspeakers'
```

## 🛠 Implementation Status

### ✅ Completed
- [x] Language selector component with UK English default
- [x] Translation infrastructure and hooks
- [x] URL routing utilities
- [x] Next.js i18n configuration
- [x] Translation strings for all supported languages
- [x] Integration in site header

### 🔄 Next Steps for Full Implementation
- [ ] Implement Next.js middleware for automatic locale detection
- [ ] Create language-specific page components
- [ ] Set up translation file loading (JSON/YAML)
- [ ] Implement language-specific SEO metadata
- [ ] Add language-specific content management
- [ ] Set up domain-based language routing
- [ ] Implement language-specific sitemaps

## 🎯 Future Enhancements

### Content Management
- Dynamic translation loading from CMS
- Translation management system integration
- Automated translation workflows

### SEO Optimization
- Language-specific meta tags
- Hreflang attributes for search engines
- Language-specific sitemaps
- Localized structured data

### User Experience
- Language preference persistence
- Automatic language detection
- Smooth language switching without page reload
- Language-specific date/number formatting

## 🔧 Configuration

### Adding New Languages

1. **Update language configuration:**
   ```typescript
   // src/lib/i18n.ts
   export type SupportedLanguage = 'en' | 'fr' | 'de' | 'ja' | 'es' | 'it' | 'pt'; // Add new language
   
   export const languages: LanguageConfig[] = [
     // ... existing languages
     { code: 'pt', name: 'Português', flag: '🇵🇹', locale: 'pt-PT' },
   ];
   ```

2. **Add translations:**
   ```typescript
   export const translations: Record<SupportedLanguage, Translations> = {
     // ... existing translations
     pt: {
       nav: { /* Portuguese translations */ },
       utility: { /* Portuguese translations */ },
       actions: { /* Portuguese translations */ },
     },
   };
   ```

3. **Update routing configuration:**
   ```typescript
   // src/lib/i18n-routing.ts
   export const localizedRoutes: Record<string, LocalizedRoute> = {
     '/': {
       // ... existing routes
       pt: '/pt',
     },
   };
   ```

### Environment Variables

```env
# Optional: Set default language
NEXT_PUBLIC_DEFAULT_LANGUAGE=en

# Optional: Enable/disable language detection
NEXT_PUBLIC_LANGUAGE_DETECTION=true
```

## 📚 Resources

- [Next.js Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing)
- [React i18next](https://react.i18next.com/)
- [W3C Internationalization](https://www.w3.org/International/)
- [Google SEO Guidelines for Multilingual Sites](https://developers.google.com/search/docs/advanced/crawling/localized-versions)

---

*This infrastructure provides a solid foundation for multilingual support while maintaining clean, maintainable code and excellent user experience.*
