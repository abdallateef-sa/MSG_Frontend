import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import { getArrow } from '@/utils/rtl';

export default function Documents() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState({});

  const upload = (name) => setUploaded((current) => ({ ...current, [name]: true }));

  const docs = [
    ['identity', t.identityDoc, t.required],
    ['license', t.license, t.required],
    ['vehicle', t.vehicleDoc, t.required],
    ['photo', t.personalPhoto, t.optional],
  ];

  return (
    <form
      className="courier-card form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(ROUTES.STATUS);
      }}
    >
      <h2>{t.documents}</h2>
      <p className="muted">{t.uploadHint}</p>
      <div className="upload-grid">
        {docs.map(([id, label, requirement]) => (
          <label className={`upload-card ${uploaded[id] ? 'uploaded' : ''}`} key={id}>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              required={requirement === t.required}
              onChange={() => upload(id)}
            />
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
