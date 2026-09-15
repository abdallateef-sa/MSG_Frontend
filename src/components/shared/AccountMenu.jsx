import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import Icon from '@/components/ui/Icon';

/**
 * Generic avatar dropdown: profile + language + logout.
 * The target profile route is provided by the caller so each portal keeps its
 * own profile page (courier vs supervisor).
 */
export default function AccountMenu({ profileRoute }) {
  const { t, lang, toggleLang } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', onClickOutside);
    return () => document.removeEventListener('pointerdown', onClickOutside);
  }, []);

  const handleNavigate = (route) => {
    setOpen(false);
    navigate(route);
  };

  return (
    <div className="profile-menu" ref={ref}>
      <button
        className="icon-button avatar-button"
        type="button"
        aria-label={t.profile}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="supervisor" size={22} strokeWidth={1.8} />
      </button>

      {open && (
        <div className="profile-dropdown" role="menu">
          <button type="button" role="menuitem" onClick={() => handleNavigate(profileRoute)}>
            <Icon name="profile" size={18} />
            <span>{t.profile}</span>
          </button>

          <button type="button" role="menuitem" onClick={toggleLang}>
            <Icon name="globe" size={18} />
            <span>{t.changeLanguage}</span>
            <b>{lang === 'ar' ? 'EN' : 'ع'}</b>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
              navigate(ROUTES.LOGIN);
            }}
          >
            <Icon name="logout" size={18} />
            <span>{t.logout}</span>
          </button>
        </div>
      )}
    </div>
  );
}
