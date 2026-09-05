import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import FormActions from '@/components/shared/FormActions';

export default function VehicleBank() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="courier-card form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(ROUTES.REGISTER_DOCUMENTS);
      }}
    >
      <div className="section-title">
        <span>▣</span>
        <h2>{t.vehicleInfo}</h2>
      </div>
      <div className="form-grid">
        <label>
          {t.plate}
          <input required placeholder={t.platePh} />
        </label>
        <label>
          {t.type}
          <select required defaultValue="">
            <option value="" disabled>
              {t.chooseType}
            </option>
            <option>{lang === 'ar' ? 'سيدان' : 'Sedan'}</option>
            <option>{lang === 'ar' ? 'فان بضائع' : 'Cargo van'}</option>
          </select>
        </label>
      </div>

      <div className="section-title">
        <span>▤</span>
        <h2>{t.bankInfo}</h2>
      </div>
      <div className="form-grid">
        <label>
          {t.bank}
          <select required defaultValue="">
            <option value="" disabled>
              {t.chooseBank}
            </option>
            <option>Al Rajhi Bank</option>
            <option>Riyad Bank</option>
          </select>
        </label>
        <label>
          {t.iban}
          <input required dir="ltr" placeholder={t.ibanPh} />
        </label>
      </div>
      <p className="helper-text">{t.bankHint}</p>

      <FormActions
        saved={saved}
        onSave={() => setSaved(true)}
        onBack={() => navigate(ROUTES.REGISTER_PERSONAL)}
      />
    </form>
  );
}
