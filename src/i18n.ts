// src/i18n.ts
import en from '../public/locales/en.json';
import ae from '../public/locales/ae.json';
import da from '../public/locales/da.json';
import de from '../public/locales/de.json';
import el from '../public/locales/el.json';
import es from '../public/locales/es.json';
import fr from '../public/locales/fr.json';
import hu from '../public/locales/hu.json';
import it from '../public/locales/it.json';
import ja from '../public/locales/ja.json';
import pl from '../public/locales/pl.json';
import pt from '../public/locales/pt.json';
import ru from '../public/locales/ru.json';
import sv from '../public/locales/sv.json';
import tr from '../public/locales/tr.json';
import zh from '../public/locales/zh.json';

// Language map
const langObj: Record<string, Record<string, string>> = {
  en, ae, da, de, el, es, fr, hu, it, ja, pl, pt, ru, sv, tr, zh,
};

// Get language from cookie
const getLang = (): string => {
  const match = document.cookie.match(/i18nextLng=([^;]+)/);
  return match ? match[1] : 'en';
};

// Translation setup
export const getTranslation = () => {
  const lang = getLang();
  const data = langObj[lang] || langObj['en'];

  const t = (key: string): string => {
    return data[key] || key;
  };

  const i18n = {
    language: lang,
    changeLanguage: (newLang: string) => {
      document.cookie = `i18nextLng=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    },
  };

  const initLocale = (defaultLang: string) => {
    i18n.changeLanguage(getLang() || defaultLang);
  };

  return { t, i18n, initLocale };
};
