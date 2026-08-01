import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TRANSLATIONS } from './languages';

i18n
  .use(initReactI18next)
  .init({
    resources: Object.keys(TRANSLATIONS).reduce((acc, lang) => {
      acc[lang] = { translation: TRANSLATIONS[lang] };
      return acc;
    }, {} as Record<string, { translation: Record<string, string> }>),
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
