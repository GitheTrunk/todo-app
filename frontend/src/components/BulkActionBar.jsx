import React from 'react';
import { Trash2, CheckCircle2, Clock, TrendingUp, Star, X } from 'lucide-react';

export default function BulkActionBar({
  selectedCount,
  onBulkStatusChange,
  onBulkTogglePriority,
  onBulkDelete,
  onClearSelection
}) {
  if (selectedCount === 0) return null;

  return (
    <aside className="bulk-bar-floating" aria-label="Bulk actions toolbar">
      <div className="bulk-count-badge">
        {selectedCount} {selectedCount === 1 ? 'task' : 'tasks'} selected
      </div>

      <div className="bulk-actions-group">
        <button
          type="button"
          className="bulk-btn"
          onClick={() => onBulkStatusChange('todo')}
          title="Mark selected tasks as To Do"
        >
          <Clock size={14} color="#fbbf24" />
          <span>To Do</span>
        </button>

        <button
          type="button"
          className="bulk-btn"
          onClick={() => onBulkStatusChange('in_progress')}
          title="Mark selected tasks as In Progress"
        >
          <TrendingUp size={14} color="#60a5fa" />
          <span>In Progress</span>
        </button>

        <button
          type="button"
          className="bulk-btn"
          onClick={() => onBulkStatusChange('done')}
          title="Mark selected tasks as Done"
        >
          <CheckCircle2 size={14} color="#34d399" />
          <span>Done</span>
        </button>

        <button
          type="button"
          className="bulk-btn"
          onClick={onBulkTogglePriority}
          title="Toggle Star/Priority for selected tasks"
        >
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span>Toggle Star</span>
        </button>

        <button
          type="button"
          className="bulk-btn bulk-delete"
          onClick={onBulkDelete}
          title="Delete all selected tasks"
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>

        <button
          type="button"
          className="action-btn"
          onClick={onClearSelection}
          title="Cancel selection"
          style={{ marginLeft: '4px' }}
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
}
