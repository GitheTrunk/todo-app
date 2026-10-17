import React, { useState } from 'react';
import { GripVertical, Star, Check, Trash2, Edit3 } from 'lucide-react';
import { STATUS_OPTIONS } from '../data/initialData';

export default function TodoItem({
  todo, index, isSelected, onToggleSelect, onUpdateTodo, onDeleteTodo,
  onOpenEditModal, onDragStart, onDragEnter, onDragEnd, isDragging, canReorder,
}) {
  const [busy, setBusy] = useState(false);

  const handleStatusChange = async (event) => {
    setBusy(true);
    await onUpdateTodo(todo.id, { status: event.target.value });
    setBusy(false);
  };

  return (
    <div
      className={`todo-item-card status-${todo.status} ${isSelected ? 'is-selected' : ''} ${isDragging ? 'is-dragging' : ''}`}
      draggable={canReorder}
      onDragStart={(event) => onDragStart(event, index)}
      onDragEnter={(event) => onDragEnter(event, index)}
      onDragEnd={onDragEnd}
      onDragOver={(event) => event.preventDefault()}
      id={`todo-item-${todo.id}`}
    >
      <div className="drag-handle" title={canReorder ? 'Drag to reorder' : 'Clear filters to reorder'} aria-label="Reorder to-do">
        <GripVertical size={18} />
      </div>
      <div
        className={`custom-checkbox ${isSelected ? 'checked' : ''}`}
        onClick={() => onToggleSelect(todo.id)}
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={0}
        onKeyDown={(event) => { if (event.key === ' ' || event.key === 'Enter') onToggleSelect(todo.id); }}
        aria-label={`Select ${todo.title}`}
      >
        {isSelected && <Check size={13} strokeWidth={3} />}
      </div>
      <button type="button" className={`star-btn ${todo.starred ? 'active' : ''}`} onClick={() => onUpdateTodo(todo.id, { starred: !todo.starred })} aria-label={todo.starred ? 'Remove star' : 'Star to-do'} aria-pressed={todo.starred}>
        <Star size={18} fill={todo.starred ? 'currentColor' : 'none'} />
      </button>
      <div className="todo-content"><div className="todo-title-row"><span className="todo-title">{todo.title}</span></div></div>
      <select
        className={`status-pill-select status-${todo.status}`}
        value={todo.status}
        onChange={handleStatusChange}
        disabled={busy}
        aria-label={`Status for ${todo.title}`}
      >
        {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <button type="button" className="action-btn" onClick={() => onOpenEditModal(todo)} aria-label="Edit to-do"><Edit3 size={16} /></button>
      <button type="button" className="action-btn delete-btn" onClick={() => onDeleteTodo(todo.id)} aria-label="Delete to-do"><Trash2 size={16} /></button>
    </div>
  );
}
