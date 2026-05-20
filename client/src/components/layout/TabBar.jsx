import { useNavigate, useLocation } from 'react-router-dom';
import useCartStore from '../../store/cartStore';

const tabs = [
  { path: '/',         icon: '🏠', label: 'home'     },
  { path: '/shop',     icon: '🛍',  label: 'shop'     },
  { path: '/wishlist', icon: '♡',  label: 'wishlist' },
  { path: '/login',    icon: '👤', label: 'me'       },
];

export default function TabBar() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());

  const activeTab = (path) => {
    if (path === '/')     return pathname === '/';
    if (path === '/shop') return pathname.startsWith('/shop');
    return pathname === path;
  };

  return (
    <div className="tab-bar">
      <div className="tab-bar-inner">
        {tabs.map((t) => (
          <div
            key={t.path}
            className={`tab-item${activeTab(t.path) ? ' active' : ''}`}
            onClick={() => navigate(t.path)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">
              {t.label}
              {t.path === '/shop' && totalItems > 0 ? ` (${totalItems})` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
