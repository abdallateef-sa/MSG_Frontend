import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import Icon from '@/components/ui/Icon';

export default function ProfileMenu() {
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', onClickOutside);
    return () => document.removeEventListener('pointerdown', onClickOutside);
  }, []);

  return (
    <div className="profile-menu" ref={ref}>
      <button
        className="icon-button avatar-button"
        type="button"
        aria-label={t.profile}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="supervisor" size={22} strokeWidth={1.8} />
      </button>

      {open && (
        <div className="profile-dropdown">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate(ROUTES.PROFILE);
            }}
          >
            <Icon name="profile" size={18} />
            <span>{t.profile}</span>
          </button>
          <button type="button" onClick={toggleLang}>
            <Icon name="globe" size={18} />
            <span>{t.changeLanguage}</span>
            <b>{lang === 'ar' ? 'EN' : 'ع'}</b>
          </button>
          <button type="button" onClick={() => navigate(ROUTES.LOGIN)}>
            <Icon name="logout" size={18} />
            <span>{t.logout}</span>
          </button>
        </div>
      )}
    </div>
  );
}
