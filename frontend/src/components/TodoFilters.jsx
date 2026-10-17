import React from 'react';
import { Search, X } from 'lucide-react';

export default function TodoFilters({ searchQuery, onSearchChange, statusFilter, onStatusFilterChange, statusCounts }) {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'todo', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'done', label: 'Done' },
    { id: 'starred', label: 'Starred ★' },
  ];

  return (
    <div className="toolbar-container">
      <div className="search-and-sort-row">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            id="todo-search-input"
            type="text"
            className="search-input"
            placeholder="Search to-dos by title..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {searchQuery && <button type="button" className="search-clear-btn" onClick={() => onSearchChange('')} title="Clear search"><X size={15} /></button>}
        </div>
      </div>
      <div className="filter-tabs-row">
        <div className="filter-tabs" role="tablist" aria-label="Filter to-dos by status">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={statusFilter === tab.id}
              type="button"
              className={`filter-tab ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => onStatusFilterChange(tab.id)}
            >
              <span>{tab.label}</span><span className="tab-badge">{statusCounts[tab.id]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
