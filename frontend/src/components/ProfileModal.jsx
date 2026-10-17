import React, { useState } from 'react';
import { X, User, Check } from 'lucide-react';

function ProfileModalContent({ onClose, profile, onSaveProfile, stats }) {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    username: profile.username || '',
    email: profile.email || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const saved = await onSaveProfile(formData);
    setSaving(false);
    if (saved) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-labelledby="profile-modal-title">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={20} color="var(--primary)" /><h2 id="profile-modal-title" className="modal-title">Account Profile</h2></div>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Close profile dialog"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-display-name">Display name</label>
              <input id="profile-display-name" name="name" type="text" className="form-control" value={formData.name} onChange={handleChange} maxLength={150} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-username">Username</label>
              <input id="profile-username" name="username" type="text" className="form-control" value={formData.username} onChange={handleChange} maxLength={100} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email</label>
              <input id="profile-email" name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} maxLength={255} />
            </div>
            <div className="profile-task-summary">Tasks done: {stats.done} · In progress: {stats.inProgress}</div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}><Check size={16} /> {saving ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfileModal({ isOpen, onClose, profile, onSaveProfile, stats }) {
  if (!isOpen) return null;
  return <ProfileModalContent onClose={onClose} profile={profile} onSaveProfile={onSaveProfile} stats={stats} />;
}
