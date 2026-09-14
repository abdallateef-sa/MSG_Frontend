import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import FormActions from '@/components/shared/FormActions';
import { toEnglishDigits } from '@/utils/digits';

function splitPlate(plate = '') {
  return {
    letters: (plate.match(/\p{L}+/gu) || []).join(' '),
    numbers: toEnglishDigits((plate.match(/[0-9٠-٩۰-۹]+/g) || []).join('')),
  };
}

function getIbanNumbers(iban = '') {
  return toEnglishDigits(iban).replace(/^SA/i, '').replace(/\D/g, '').slice(0, 22);
}

export default function VehicleBank() {
  const { t, lang } = useLanguage();
  const { hasVehicle, vehicleBank, updateVehicleBank } = useOnboarding();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const savedPlate = splitPlate(vehicleBank.plate);

  const [formData, setFormData] = useState({
    plate: vehicleBank.plate || '',
    plateLetters: savedPlate.letters,
    plateNumbers: savedPlate.numbers,
    type: vehicleBank.type || '',
    bank: vehicleBank.bank || '',
    iban: toEnglishDigits(vehicleBank.iban),
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlateChange = (field, value) => {
    setFormData((prev) => {
      const plateLetters = field === 'plateLetters' ? value : prev.plateLetters;
      const plateNumbers =
        field === 'plateNumbers' ? toEnglishDigits(value) : prev.plateNumbers;

      return {
        ...prev,
        plateLetters,
        plateNumbers,
        plate: `${plateLetters.trim()} ${plateNumbers.trim()}`.trim(),
      };
    });
  };

  const handleIbanChange = (value) => {
    const numbers = toEnglishDigits(value).replace(/\D/g, '').slice(0, 22);
    handleChange('iban', numbers ? `SA${numbers}` : '');
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
            <div className="plate-entry">
              {t.plate}
              <div className="plate-fields" role="group" aria-label={t.plate}>
                <label>
                  {t.plateLetters}
                  <input
                    required
                    maxLength={3}
                    placeholder={t.plateLettersPh}
                    value={formData.plateLetters}
                    onChange={(e) => handlePlateChange('plateLetters', e.target.value)}
                  />
                </label>
                <label>
                  {t.plateNumbers}
                  <input
                    required
                    dir="ltr"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder={t.plateNumbersPh}
                    value={formData.plateNumbers}
                    onChange={(e) => handlePlateChange('plateNumbers', e.target.value)}
                  />
                </label>
              </div>
            </div>
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
          <div className="iban-input" dir="ltr">
            <span>SA</span>
            <input
              required
              inputMode="numeric"
              minLength={22}
              maxLength={22}
              pattern="[0-9]{22}"
              title={t.ibanFormat}
              placeholder="0000000000000000000000"
              value={getIbanNumbers(formData.iban)}
              onChange={(e) => handleIbanChange(e.target.value)}
            />
          </div>
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
