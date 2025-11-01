// Internationalization utilities for multi-language support

export type SupportedLanguage = 'en' | 'fr' | 'de' | 'ja' | 'es' | 'it';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  flag: string;
  locale: string;
}

export const languages: LanguageConfig[] = [
  { code: 'en', name: 'United Kingdom (English)', flag: '🇬🇧', locale: 'en-GB' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', locale: 'fr-FR' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', locale: 'de-DE' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', locale: 'ja-JP' },
  { code: 'es', name: 'Español', flag: '🇪🇸', locale: 'es-ES' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', locale: 'it-IT' },
];

export const defaultLanguage: SupportedLanguage = 'en';

export function getLanguageByCode(code: string): LanguageConfig | undefined {
  return languages.find(lang => lang.code === code);
}

export function getLanguageByLocale(locale: string): LanguageConfig | undefined {
  return languages.find(lang => lang.locale === locale);
}

// Translation keys structure (to be expanded)
export interface Translations {
  nav: {
    home: string;
    loudspeakers: string;
    driveUnits: string;
    cables: string;
    build: string;
    blog: string;
    listen: string;
    ourBrand: string;
    contact: string;
  };
  utility: {
    bookAppointment: string;
    contactUs: string;
    pointsOfSale: string;
  };
  actions: {
    search: string;
    account: string;
    wishlist: string;
    cart: string;
  };
}

// Placeholder translations - in a real app, these would come from translation files
export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    nav: {
      home: 'Home',
      loudspeakers: 'Loudspeakers',
      driveUnits: 'Drive Units',
      cables: 'Cables',
      build: 'Build',
      blog: 'Blog',
      listen: 'Listen',
      ourBrand: 'Our Brand',
      contact: 'Contact',
    },
    utility: {
      bookAppointment: 'Book an appointment',
      contactUs: 'Contact us',
      pointsOfSale: 'Points of Sale',
    },
    actions: {
      search: 'Search',
      account: 'Account',
      wishlist: 'Wishlist',
      cart: 'Shopping cart',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      loudspeakers: 'Haut-parleurs',
      driveUnits: 'Unités de pilotage',
      cables: 'Câbles',
      build: 'Construire',
      blog: 'Blog',
      listen: 'Écouter',
      ourBrand: 'Notre marque',
      contact: 'Contact',
    },
    utility: {
      bookAppointment: 'Prendre rendez-vous',
      contactUs: 'Nous contacter',
      pointsOfSale: 'Points de vente',
    },
    actions: {
      search: 'Rechercher',
      account: 'Compte',
      wishlist: 'Liste de souhaits',
      cart: 'Panier',
    },
  },
  de: {
    nav: {
      home: 'Startseite',
      loudspeakers: 'Lautsprecher',
      driveUnits: 'Antriebseinheiten',
      cables: 'Kabel',
      build: 'Bauen',
      blog: 'Blog',
      listen: 'Hören',
      ourBrand: 'Unsere Marke',
      contact: 'Kontakt',
    },
    utility: {
      bookAppointment: 'Termin vereinbaren',
      contactUs: 'Kontaktieren Sie uns',
      pointsOfSale: 'Verkaufsstellen',
    },
    actions: {
      search: 'Suchen',
      account: 'Konto',
      wishlist: 'Wunschliste',
      cart: 'Einkaufswagen',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      loudspeakers: 'スピーカー',
      driveUnits: 'ドライブユニット',
      cables: 'ケーブル',
      build: '構築',
      blog: 'ブログ',
      listen: '聞く',
      ourBrand: '私たちのブランド',
      contact: 'お問い合わせ',
    },
    utility: {
      bookAppointment: '予約する',
      contactUs: 'お問い合わせ',
      pointsOfSale: '販売店',
    },
    actions: {
      search: '検索',
      account: 'アカウント',
      wishlist: 'ウィッシュリスト',
      cart: 'ショッピングカート',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      loudspeakers: 'Altavoces',
      driveUnits: 'Unidades de accionamiento',
      cables: 'Cables',
      build: 'Construir',
      blog: 'Blog',
      listen: 'Escuchar',
      ourBrand: 'Nuestra marca',
      contact: 'Contacto',
    },
    utility: {
      bookAppointment: 'Reservar cita',
      contactUs: 'Contáctanos',
      pointsOfSale: 'Puntos de venta',
    },
    actions: {
      search: 'Buscar',
      account: 'Cuenta',
      wishlist: 'Lista de deseos',
      cart: 'Carrito de compras',
    },
  },
  it: {
    nav: {
      home: 'Home',
      loudspeakers: 'Altoparlanti',
      driveUnits: 'Unità di pilotaggio',
      cables: 'Cavi',
      build: 'Costruire',
      blog: 'Blog',
      listen: 'Ascolta',
      ourBrand: 'Il nostro marchio',
      contact: 'Contatto',
    },
    utility: {
      bookAppointment: 'Prenota appuntamento',
      contactUs: 'Contattaci',
      pointsOfSale: 'Punti vendita',
    },
    actions: {
      search: 'Cerca',
      account: 'Account',
      wishlist: 'Lista desideri',
      cart: 'Carrello',
    },
  },
};
