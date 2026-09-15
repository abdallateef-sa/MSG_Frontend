import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { getArrow } from '@/utils/rtl';
import Icon from '@/components/ui/Icon';

export default function Documents() {
  const { t, lang } = useLanguage();
  const { personal, hasVehicle, documents, submitCourierApplication, updateDocuments } = useOnboarding();
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(documents);
  const [submitError, setSubmitError] = useState('');

  const upload = (name, file) => {
    setSubmitError('');
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploaded((current) => ({ ...current, [name]: true }));
      if (updateDocuments) {
        updateDocuments(name, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // If applicant has no vehicle, vehicle registration document is excluded
  const needsPassport =
    Boolean(personal.nationality) && !['سعودي', 'Saudi'].includes(personal.nationality);
  const docs = [
    ['identity', t.identityDoc, t.required],
    ...(needsPassport ? [['passport', t.passportDoc, t.required]] : []),
    ['license', t.license, t.required],
    ...(hasVehicle !== false ? [['vehicle', t.vehicleDoc, t.required]] : []),
    ['photo', t.personalPhoto, t.optional],
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const missingRequiredDocument = docs.some(
      ([id, , requirement]) => requirement === t.required && !uploaded[id],
    );
    if (missingRequiredDocument) {
      setSubmitError(t.documentsRequired);
      return;
    }
    submitCourierApplication();
    navigate(ROUTES.STATUS);
  };

  return (
    <form className="courier-card form-stack" onSubmit={handleSubmit}>
      <h2>{t.documents}</h2>
      <p className="muted">{t.uploadHint}</p>
      <div className="upload-grid">
        {docs.map(([id, label, requirement]) => (
          <label className={`upload-card ${uploaded[id] ? 'uploaded' : ''}`} key={id}>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) => upload(id, event.target.files?.[0])}
            />
            <span className="upload-icon">
              <Icon name={uploaded[id] ? 'check' : 'upload'} size={18} strokeWidth={2} />
            </span>
            <b>{uploaded[id] ? t.uploaded : label}</b>
            <small>{uploaded[id] ? t.replace : `${requirement} · ${t.pdfOrImage}`}</small>
          </label>
        ))}
      </div>
      {submitError && <p className="form-error">{submitError}</p>}
      <div className="form-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={() => navigate(ROUTES.REGISTER_VEHICLE_BANK)}
        >
          {t.previous}
        </button>
        <button className="primary-button" type="submit">
          {t.submit} <span>{getArrow(lang)}</span>
        </button>
      </div>
    </form>
  );
}
