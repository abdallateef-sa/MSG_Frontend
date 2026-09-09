import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import FormActions from '@/components/shared/FormActions';

export default function PersonalInfo() {
  const { t, lang } = useLanguage();
  const { personal, updatePersonal, hasVehicle, setHasVehicle } = useOnboarding();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: personal.fullName || '',
    idNumber: personal.idNumber || '',
    dob: personal.dob || '',
    nationality: personal.nationality || '',
    phone: personal.phone || '',
    city: personal.city || '',
    password: personal.password || '',
    confirmPassword: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = t.passwordRequired;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      updatePersonal(formData);
      setSaved(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updatePersonal(formData);
      navigate(ROUTES.REGISTER_VEHICLE_BANK);
    }
  };

  return (
    <form className="courier-card form-stack" onSubmit={handleSubmit}>
      <h2>{t.personal}</h2>
      <div className="form-grid">
        <label>
          {t.fullName}
          <input
            required
            placeholder={t.fullNamePh}
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
        </label>
        <label>
          {t.id}
          <input
            required
            inputMode="numeric"
            placeholder={t.idPh}
            value={formData.idNumber}
            onChange={(e) => handleChange('idNumber', e.target.value)}
          />
        </label>
        <label>
          {t.dob}
          <input
            required
            type="date"
            value={formData.dob}
            onChange={(e) => handleChange('dob', e.target.value)}
          />
        </label>
        <label>
          {t.nationality}
          <select
            required
            value={formData.nationality}
            onChange={(e) => handleChange('nationality', e.target.value)}
          >
            <option value="" disabled>
              {t.chooseNationality}
            </option>
            <option value={lang === 'ar' ? 'سعودي' : 'Saudi'}>
              {lang === 'ar' ? 'سعودي' : 'Saudi'}
            </option>
            <option value={lang === 'ar' ? 'مصري' : 'Egyptian'}>
              {lang === 'ar' ? 'مصري' : 'Egyptian'}
            </option>
          </select>
        </label>
        <label>
          {t.phone}
          <div className="phone-input" dir="ltr">
            <span>+966</span>
            <input
              required
              inputMode="tel"
              placeholder="5xxxxxxxx"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </label>
        <label>
          {t.city}
          <select
            required
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
          >
            <option value="" disabled>
              {t.chooseCity}
            </option>
            <option value="Riyadh">Riyadh</option>
            <option value="Jeddah">Jeddah</option>
            <option value="Dammam">Dammam</option>
          </select>
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          {t.hasVehicle}
          <select
            required
            value={hasVehicle === null ? '' : hasVehicle ? 'yes' : 'no'}
            onChange={(e) => setHasVehicle(e.target.value === 'yes')}
          >
            <option value="" disabled>
              {t.chooseVehicleOwnership}
            </option>
            <option value="yes">{t.yesVehicle}</option>
            <option value="no">{t.noVehicle}</option>
          </select>
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          {t.password}
          <input
            type="password"
            required
            placeholder={t.passwordPh}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          {errors.password && (
            <small
              style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', display: 'block' }}
            >
              {errors.password}
            </small>
          )}
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          {t.confirmPassword}
          <input
            type="password"
            required
            placeholder={t.confirmPasswordPh}
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />
          {errors.confirmPassword && (
            <small
              style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', display: 'block' }}
            >
              {errors.confirmPassword}
            </small>
          )}
        </label>
      </div>
      <FormActions saved={saved} onSave={handleSave} onBack={() => navigate(ROUTES.LOGIN)} />
    </form>
  );
}
