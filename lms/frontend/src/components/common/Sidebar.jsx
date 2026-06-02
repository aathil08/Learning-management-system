import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from './Icon';

export const SIDEBAR_W = 240;

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Admin uses instructor role internally — display as "Admin"
  const isAdmin = user?.role === 'instructor';
  const displayRole = isAdmin ? 'Admin' : 'Student';

  const adminLinks = [
    { to: '/instructor/dashboard', label: 'Dashboard',  icon: 'layout' },
    { to: '/instructor/courses',   label: 'Courses',    icon: 'book'   },
    { to: '/instructor/students',  label: 'Students',   icon: 'users'  },
  ];
  const studentLinks = [
    { to: '/student/dashboard',  label: 'Dashboard',   icon: 'layout' },
    { to: '/student/browse',     label: 'Browse',      icon: 'search' },
    { to: '/student/my-courses', label: 'My Learning', icon: 'book'   },
  ];

  const links = isAdmin ? adminLinks : studentLinks;
  const profilePath = isAdmin ? '/instructor/profile' : '/student/profile';

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: SIDEBAR_W,
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      zIndex: 100, padding: '24px 0',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 32px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="book" size={19} color="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 18, letterSpacing: -0.5, color: 'var(--text)' }}>LearnFlow</div>
          <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{displayRole}</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to.endsWith('dashboard')}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 11,
              marginBottom: 4, textDecoration: 'none',
              background: isActive ? 'rgba(14,165,233,0.12)' : 'transparent',
              color: isActive ? 'var(--teal2)' : 'var(--text2)',
              fontWeight: isActive ? 700 : 500, fontSize: 14,
              transition: 'all .15s',
              borderLeft: isActive ? '3px solid var(--teal)' : '3px solid transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon name={icon} size={17} color={isActive ? 'var(--teal2)' : 'var(--text3)'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div style={{ padding: '0 12px' }}>
        <NavLink to={profilePath}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 14px', borderRadius: 11,
            marginBottom: 8, textDecoration: 'none',
            background: isActive ? 'rgba(14,165,233,0.12)' : 'transparent',
            color: isActive ? 'var(--teal2)' : 'var(--text2)',
            fontWeight: 500, fontSize: 14,
            borderLeft: isActive ? '3px solid var(--teal)' : '3px solid transparent',
          })}
        >
          <Icon name="user" size={17} color="var(--text3)" />
          Profile
        </NavLink>

        <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
              background: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {user?.avatar
                ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <Icon name="user" size={16} color="#fff" />}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{displayRole}</div>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} style={{
            width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)',
            color: 'var(--text2)', borderRadius: 8, padding: '7px',
            fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            cursor: 'pointer',
          }}>
            <Icon name="logout" size={13} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
