import React, { useState } from 'react';
import { X, Check, Edit3 } from 'lucide-react';
import { STATUS_OPTIONS } from '../data/initialData';

function EditTodoModalContent({ onClose, todo, onSave }) {
  const [title, setTitle] = useState(todo.title);
  const [status, setStatus] = useState(todo.status);

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    onSave({ ...todo, title: cleanTitle, status });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-labelledby="edit-todo-modal-title">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Edit3 size={18} color="var(--primary)" /><h2 id="edit-todo-modal-title" className="modal-title">Edit To-do</h2></div>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Close edit dialog"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-todo-title">Title</label>
              <input id="edit-todo-title" type="text" className="form-control" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-todo-status">Status</label>
              <select id="edit-todo-status" className="form-control" value={status} onChange={(event) => setStatus(event.target.value)}>
                {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" id="save-todo-btn"><Check size={16} /> Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditTodoModal({ isOpen, onClose, todo, onSave }) {
  if (!isOpen || !todo) return null;
  return <EditTodoModalContent key={todo.id} onClose={onClose} todo={todo} onSave={onSave} />;
}
