import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import { getArrow } from '@/utils/rtl';
import BrandLogo from '@/components/ui/BrandLogo';
import LanguageButton from '@/components/ui/LanguageButton';

export default function Login() {
  const { t, lang, dir } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => navigate(ROUTES.REGISTER_PERSONAL), 350);
  };

  return (
    <div className="auth-page" dir={dir}>
      <div className="auth-card">
        <LanguageButton />
        <div className="auth-logo">
          <BrandLogo />
        </div>
        <div className="eyebrow">{t.portal}</div>
        <h1>{t.welcome}</h1>

        <form onSubmit={submit} className="form-stack">
          <label>
            {t.user}
            <input required placeholder={t.userPh} />
          </label>
          <label>
            {t.password}
            <input required type="password" placeholder={t.passPh} />
          </label>
          <div className="form-row">
            <label className="check">
              <input type="checkbox" /> {t.remember}
            </label>
            <button className="link-button" type="button">
              {t.forgot}
            </button>
          </div>
          <button className="primary-button" type="submit">
            {loading ? t.loading : t.login} <span>{getArrow(lang)}</span>
          </button>
        </form>

        <div className="or">
          <span>{t.or}</span>
        </div>
        <p className="muted">{t.joinPrompt}</p>
        <button
          className="secondary-button"
          type="button"
          onClick={() => navigate(ROUTES.REGISTER_PERSONAL)}
        >
          {t.join}
        </button>
      </div>
      <small className="auth-footer">{t.copyright}</small>
    </div>
  );
}
