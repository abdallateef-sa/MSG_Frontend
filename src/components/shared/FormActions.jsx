import { useLanguage } from '@/i18n/LanguageContext';
import { getArrow } from '@/utils/rtl';


export default function FormActions({ saved, onSave, onBack }) {
  const { t, lang } = useLanguage();
  return (
    <div className="form-actions">
      <button className="secondary-button" type="button" onClick={onSave}>
        {saved ? t.saved : t.save}
      </button>
      <div className="action-group">
        <button className="secondary-button" type="button" onClick={onBack}>
          {t.previous}
        </button>
        <button className="primary-button" type="submit">
          {t.next} <span>{getArrow(lang)}</span>
        </button>
      </div>
    </div>
  );
}
