import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import FormActions from '@/components/shared/FormActions';

export default function VehicleBank() {
  const { t, lang } = useLanguage();
  const { hasVehicle, vehicleBank, updateVehicleBank } = useOnboarding();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    plate: vehicleBank.plate || '',
    type: vehicleBank.type || '',
    bank: vehicleBank.bank || '',
    iban: vehicleBank.iban || '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateVehicleBank(formData);
    setSaved(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateVehicleBank(formData);
    navigate(ROUTES.REGISTER_DOCUMENTS);
  };

  return (
    <form className="courier-card form-stack" onSubmit={handleSubmit}>
      {hasVehicle !== false ? (
        <>
          <div className="section-title">
            <span>▣</span>
            <h2>{t.vehicleInfo}</h2>
          </div>
          <div className="form-grid">
            <label>
              {t.plate}
              <input
                required
                placeholder={t.platePh}
                value={formData.plate}
                onChange={(e) => handleChange('plate', e.target.value)}
              />
            </label>
            <label>
              {t.type}
              <select
                required
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="" disabled>
                  {t.chooseType}
                </option>
                <option value={lang === 'ar' ? 'سيدان' : 'Sedan'}>
                  {lang === 'ar' ? 'سيدان' : 'Sedan'}
                </option>
                <option value={lang === 'ar' ? 'فان بضائع' : 'Cargo van'}>
                  {lang === 'ar' ? 'فان بضائع' : 'Cargo van'}
                </option>
              </select>
            </label>
          </div>
        </>
      ) : (
        <section className="notice-card" style={{ margin: '8px 0 16px' }}>
          <span>ℹ</span>
          <div>
            <b>{t.vehicleInfo}</b>
            <p>{t.vehicleSectionNotice}</p>
          </div>
        </section>
      )}

      <div className="section-title">
        <span>▤</span>
        <h2>{t.bankInfo}</h2>
      </div>
      <div className="form-grid">
        <label>
          {t.bank}
          <select
            required
            value={formData.bank}
            onChange={(e) => handleChange('bank', e.target.value)}
          >
            <option value="" disabled>
              {t.chooseBank}
            </option>
            <option value="Al Rajhi Bank">Al Rajhi Bank</option>
            <option value="Riyad Bank">Riyad Bank</option>
          </select>
        </label>
        <label>
          {t.iban}
          <input
            required
            dir="ltr"
            placeholder={t.ibanPh}
            value={formData.iban}
            onChange={(e) => handleChange('iban', e.target.value)}
          />
        </label>
      </div>
      <p className="helper-text">{t.bankHint}</p>

      <FormActions
        saved={saved}
        onSave={handleSave}
        onBack={() => navigate(ROUTES.REGISTER_PERSONAL)}
      />
    </form>
  );
}
