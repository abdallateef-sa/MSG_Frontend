import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth, ROLES } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { getArrow } from '@/utils/rtl';
import BrandLogo from '@/components/ui/BrandLogo';
import LanguageButton from '@/components/ui/LanguageButton';

export default function Login() {
  const { t, lang, dir } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.COURIER);
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e) => {
    const val = e.target.value;
    setUsername(val);
    const lower = val.toLowerCase();
    if (lower.includes('supervisor') || val.includes('مشرف')) {
      setRole(ROLES.SUPERVISOR);
    } else if (lower.includes('hr') || val.includes('موارد')) {
      setRole(ROLES.HR);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    setLoading(true);
    login(role);

    window.setTimeout(() => {
      if (role === ROLES.SUPERVISOR) {
        navigate(ROUTES.SUPERVISOR_DASHBOARD);
      } else if (role === ROLES.HR) {
        navigate(ROUTES.HR_REQUESTS);
      } else {
        navigate(ROUTES.STATUS);
      }
    }, 350);
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
            <input
              required
              placeholder={t.userPh}
              value={username}
              onChange={handleUsernameChange}
            />
          </label>

          <label>
            {t.password}
            <input
              required
              type="password"
              placeholder={t.passPh}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label>
            {t.accountRole}
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="courier">{t.roleCourier}</option>
              <option value="supervisor">{t.roleSupervisor}</option>
              <option value="hr">{t.roleHr}</option>
            </select>
          </label>

          <div className="form-row">
            <label className="check">
              <input type="checkbox" /> {t.remember}
            </label>
            <button className="link-button" type="button">
              {t.forgot}
            </button>
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
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
