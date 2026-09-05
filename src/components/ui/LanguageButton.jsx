import { useLanguage } from '@/i18n/LanguageContext';

export default function LanguageButton() {
  const { lang, toggleLang } = useLanguage();
  return (
    <button className="language-button" type="button" onClick={toggleLang}>
      {lang === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}
