interface LanguageInfo {
  code: string;
  native: string;
  name: {
    en: string;
    fr: string;
    de: string;
    sv: string;
  };
}

export const languages: Record<string, LanguageInfo> = {
  en: {
    code: 'en',
    native: 'English',
    name: {
      en: 'English',
      fr: 'Anglais',
      de: 'Englisch',
      sv: 'Engelska',
    },
  },
  fr: {
    code: 'fr',
    native: 'Français',
    name: {
      en: 'French',
      fr: 'Français',
      de: 'Französisch',
      sv: 'Franska',
    },
  },
  de: {
    code: 'de',
    native: 'Deutsch',
    name: {
      en: 'German',
      fr: 'Allemand',
      de: 'Deutsch',
      sv: 'Tyska',
    },
  },
  sv: {
    code: 'sv',
    native: 'Svenska',
    name: {
      en: 'Swedish',
      fr: 'Suédois',
      de: 'Schwedisch',
      sv: 'Svenska',
    },
  },
};

export type LanguageCode = keyof typeof languages;
