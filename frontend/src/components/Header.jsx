import React from 'react';
import { CheckSquare, Moon, Sun } from 'lucide-react';

export default function Header({ profile, onOpenProfile, theme, onToggleTheme }) {
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

          {/* User Account / Profile Section Pill */}
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
              alt={profile.name} 
              className="profile-avatar-thumb"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
              }}
            />
            <div className="profile-user-info">
              <span className="profile-user-name">{profile.name}</span>
              <span className="profile-user-tag">@{profile.username}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
