import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, Eye, EyeOff, Sparkles } from 'lucide-react';
import { loginUser, registerUser } from '../api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, onShowToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await loginUser({
          email: formData.email.trim(),
          password: formData.password,
        });
        onShowToast?.(`Welcome back, ${response.user?.name || response.user?.email}!`, 'success');
        onAuthSuccess(response.user);
        onClose();
      } else {
        const response = await registerUser({
          email: formData.email.trim(),
          password: formData.password,
          name: formData.name.trim() || undefined,
        });
        onShowToast?.('Account created successfully!', 'success');
        onAuthSuccess(response.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (email, password, name = '') => {
    setFormData({ email, password, name });
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', width: '100%' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo" style={{ width: '32px', height: '32px' }}>
              <Lock size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
                {isLogin ? 'Sign In to TaskFlow' : 'Create an Account'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {isLogin ? 'Access your private tasks & profile' : 'Start organizing your tasks seamlessly'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close authentication dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-group" style={{ display: 'flex', padding: '0 24px', gap: '8px', marginTop: '16px' }}>
          <button
            type="button"
            className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            id="auth-tab-signin"
          >
            <LogIn size={15} style={{ marginRight: '6px' }} />
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            id="auth-tab-signup"
          >
            <UserPlus size={15} style={{ marginRight: '6px' }} />
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 24px' }}>
            {error && (
              <div className="auth-error-banner" role="alert">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">
                  Full Name
                </label>
                <div className="input-with-icon-wrapper">
                  <User size={16} className="input-field-icon" />
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    className="form-control with-icon"
                    placeholder="Alex Morgan"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">
                Email Address
              </label>
              <div className="input-with-icon-wrapper">
                <Mail size={16} className="input-field-icon" />
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  className="form-control with-icon"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">
                Password
              </label>
              <div className="input-with-icon-wrapper">
                <Lock size={16} className="input-field-icon" />
                <input
                  id="auth-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control with-icon"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="btn-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {!isLogin && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Must be at least 6 characters
                </span>
              )}
            </div>

            {/* Quick Demo Pre-fill for ease of testing */}
            <div className="auth-quick-fill-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Sparkles size={13} color="var(--primary)" />
                <span>Quick demo credentials:</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-quick-chip"
                  onClick={() => handleFillDemo('alex@example.com', 'alex123', 'Alex Morgan')}
                  title="Click to fill: alex@example.com / alex123"
                >
                  <strong>alex@example.com</strong> (alex123)
                </button>
                <button
                  type="button"
                  className="btn-quick-chip"
                  onClick={() => handleFillDemo('user@example.com', 'password123', 'John Doe')}
                  title="Click to fill: user@example.com / password123"
                >
                  <strong>user@example.com</strong> (password123)
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              id="auth-submit-btn"
            >
              {loading ? (
                'Processing…'
              ) : isLogin ? (
                <>
                  <LogIn size={16} /> Sign In
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Create Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
