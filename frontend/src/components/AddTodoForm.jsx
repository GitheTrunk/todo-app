import React, { useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { STATUS_OPTIONS } from '../data/initialData';

export default function AddTodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('todo');
  const [starred, setStarred] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const created = await onAddTodo({ title: cleanTitle, status, starred });
    if (created) {
      setTitle('');
      setStatus('todo');
      setStarred(false);
    }
  };

  return (
    <div className="add-task-card">
      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="add-task-primary-row">
          <input
            id="new-todo-title-input"
            type="text"
            className="add-task-input"
            placeholder="Add a new to-do..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            required
          />
          <select className="form-select" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Initial status">
            {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <button type="button" className={`star-toggle-btn ${starred ? 'active' : ''}`} onClick={() => setStarred((value) => !value)} aria-pressed={starred}>
            <Star size={14} fill={starred ? 'currentColor' : 'none'} /> {starred ? 'Starred' : 'Star'}
          </button>
          <button type="submit" className="btn-primary" id="add-todo-submit-btn" disabled={!title.trim()}>
            <Plus size={18} /><span>Add To-do</span>
          </button>
        </div>
      </form>
    </div>
  );
}
