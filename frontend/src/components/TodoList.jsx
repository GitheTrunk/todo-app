import React, { useState } from 'react';
import TodoItem from './TodoItem';

export default function TodoList({
  todos, selectedIds, onToggleSelect, onToggleSelectAll, onUpdateTodo,
  onDeleteTodo, onOpenEditModal, onReorderTodos, canReorder,
}) {
  const [dragStartIndex, setDragStartIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const allSelected = todos.length > 0 && todos.every((todo) => selectedIds.includes(todo.id));

  const handleDragStart = (event, index) => {
    setDragStartIndex(index);
    setDragOverIndex(index);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (_event, index) => setDragOverIndex(index);

  const handleDragEnd = () => {
    if (dragStartIndex !== null && dragOverIndex !== null && dragStartIndex !== dragOverIndex) {
      onReorderTodos(dragStartIndex, dragOverIndex);
    }
    setDragStartIndex(null);
    setDragOverIndex(null);
  };

  return (
    <section className="todo-list-section" aria-label="To-do list">
      {todos.length > 0 && (
        <div className="select-all-row">
          <button type="button" className="btn-secondary" onClick={onToggleSelectAll}>
            {allSelected ? 'Deselect all' : `Select all (${todos.length})`}
          </button>
          <span>{canReorder ? 'Drag rows to reorder' : 'Clear filters to reorder'}</span>
        </div>
      )}
      <div className="todo-list-container">
        {todos.length === 0 ? <p className="empty-state">No to-dos found.</p> : todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            index={index}
            isSelected={selectedIds.includes(todo.id)}
            onToggleSelect={onToggleSelect}
            onUpdateTodo={onUpdateTodo}
            onDeleteTodo={onDeleteTodo}
            onOpenEditModal={onOpenEditModal}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
            isDragging={dragStartIndex === index}
            canReorder={canReorder}
          />
        ))}
      </div>
    </section>
  );
}
