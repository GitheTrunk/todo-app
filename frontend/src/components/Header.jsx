import React from 'react';
import { CheckSquare, Moon, Sun, LogIn, LogOut } from 'lucide-react';

export default function Header({
  profile,
  onOpenProfile,
  theme,
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onLogout,
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-wrapper">
          <div className="brand-logo">
            <CheckSquare size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="brand-title">TaskFlow</h1>
              <span className="brand-badge">React</span>
              {currentUser?.role === 'ADMIN' && (
                <span className="badge-admin">Admin</span>
              )}
            </div>
          </div>
        </div>

        <div className="header-actions">
          {/* Theme Switcher Button */}
          <button
            type="button"
            className="btn-icon"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Auth Button or User Profile Pill */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                className="profile-pill-trigger"
                onClick={onOpenProfile}
                role="button"
                tabIndex={0}
                title="View & Edit User Profile"
                id="profile-trigger-btn"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenProfile();
                  }
                }}
              >
                <img
                  src={profile.avatar}
                  alt={currentUser.name || profile.name}
                  className="profile-avatar-thumb"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="profile-user-info">
                  <span className="profile-user-name">
                    {currentUser.name || profile.name || 'User'}
                  </span>
                  <span className="profile-user-tag">
                    {currentUser.email || `@${profile.username}`}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn-icon"
                onClick={onLogout}
                title="Sign out of your account"
                id="logout-btn"
                aria-label="Sign out"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-primary auth-header-btn"
              onClick={onOpenAuth}
              id="header-signin-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '0.875rem',
              }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
