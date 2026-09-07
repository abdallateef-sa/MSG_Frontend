import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { getArrow } from '@/utils/rtl';

export default function Documents() {
  const { t, lang } = useLanguage();
  const { hasVehicle, submitCourierApplication, updateDocuments } = useOnboarding();
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState({});

  const upload = (name) => {
    setUploaded((current) => ({ ...current, [name]: true }));
    if (updateDocuments) {
      updateDocuments(name, true);
    }
  };

  // If applicant has no vehicle, vehicle registration document is excluded
  const docs = [
    ['identity', t.identityDoc, t.required],
    ['license', t.license, t.required],
    ...(hasVehicle !== false ? [['vehicle', t.vehicleDoc, t.required]] : []),
    ['photo', t.personalPhoto, t.optional],
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={() => upload(id)} />
            <span className="upload-icon">{uploaded[id] ? '✓' : '↑'}</span>
            <b>{uploaded[id] ? t.uploaded : label}</b>
            <small>{uploaded[id] ? t.replace : `${requirement} · ${t.pdfOrImage}`}</small>
          </label>
        ))}
      </div>
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
