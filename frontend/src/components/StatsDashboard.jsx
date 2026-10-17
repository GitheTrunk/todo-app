import React from 'react';
import { CheckCircle2, Clock, ListTodo, Star, TrendingUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StatsDashboard({ stats }) {
  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <section className="stats-container" aria-label="Productivity Overview">
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <ListTodo size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">To Do</span>
          <span className="stat-value">{stats.todo}</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--status-todo-bg)', color: 'var(--status-todo-text)' }}>
          <Clock size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{stats.inProgress}</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--status-inprogress-bg)', color: 'var(--status-inprogress-text)' }}>
          <TrendingUp size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{stats.done}</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--status-done-bg)', color: 'var(--status-done-text)' }}>
          <CheckCircle2 size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Starred</span>
          <span className="stat-value">{stats.starred}</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
          <Star size={22} fill="currentColor" />
        </div>
      </div>

      {/* Progress Bar Row */}
      <div className="stat-progress-section">
        <div className="progress-header">
          <div className="progress-title">
            <span>Overall Completion Rate</span>
            {stats.completionPct === 100 && stats.total > 0 && (
              <button 
                type="button" 
                onClick={handleTriggerConfetti}
                className="btn-primary" 
                style={{ padding: '3px 10px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
              >
                <Sparkles size={13} /> 100% Done! Celebrate 🎉
              </button>
            )}
          </div>
          <span className="progress-pct">{stats.completionPct}%</span>
        </div>
        <div className="progress-bar-track" role="progressbar" aria-valuenow={stats.completionPct} aria-valuemin={0} aria-valuemax={100}>
          <div 
            className="progress-bar-fill" 
            style={{ width: `${stats.completionPct}%` }}
          />
        </div>
      </div>
    </section>
  );
}
