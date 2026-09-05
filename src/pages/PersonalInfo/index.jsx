import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import FormActions from '@/components/shared/FormActions';


export default function PersonalInfo() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="courier-card form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(ROUTES.REGISTER_VEHICLE_BANK);
      }}
    >
      <h2>{t.personal}</h2>
      <div className="form-grid">
        <label>
          {t.fullName}
          <input required placeholder={t.fullNamePh} />
        </label>
        <label>
          {t.id}
          <input required inputMode="numeric" placeholder={t.idPh} />
        </label>
        <label>
          {t.dob}
          <input required type="date" />
        </label>
        <label>
          {t.nationality}
          <select required defaultValue="">
            <option value="" disabled>
              {t.chooseNationality}
            </option>
            <option>{lang === 'ar' ? 'سعودي' : 'Saudi'}</option>
            <option>{lang === 'ar' ? 'مصري' : 'Egyptian'}</option>
          </select>
        </label>
        <label>
          {t.phone}
          <div className="phone-input" dir="ltr">
            <span>+966</span>
            <input required inputMode="tel" placeholder="5xxxxxxxx" />
          </div>
        </label>
        <label>
          {t.city}
          <select required defaultValue="">
            <option value="" disabled>
              {t.chooseCity}
            </option>
            <option>Riyadh</option>
            <option>Jeddah</option>
            <option>Dammam</option>
          </select>
        </label>
      </div>
      <FormActions saved={saved} onSave={() => setSaved(true)} onBack={() => navigate(ROUTES.LOGIN)} />
    </form>
  );
}
