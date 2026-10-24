import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Header from './components/Header';
import ProfileModal from './components/ProfileModal';
import AuthModal from './components/AuthModal';
import StatsDashboard from './components/StatsDashboard';
import AddTodoForm from './components/AddTodoForm';
import TodoFilters from './components/TodoFilters';
import TodoList from './components/TodoList';
import BulkActionBar from './components/BulkActionBar';
import EditTodoModal from './components/EditTodoModal';
import Toast from './components/Toast';
import { initialProfile } from './data/initialData';
import {
  createTodo,
  deleteTodo,
  getCurrentUser,
  getProfile,
  getTodos,
  logoutUser,
  reorderTodos,
  updateProfile,
  updateTodo,
  updateTodosBulk,
} from './api';
import confetti from 'canvas-confetti';

const STORAGE_KEY_THEME = 'taskflow_theme_local_v1';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY_THEME) || 'dark');
  const [profile, setProfile] = useState(initialProfile);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  const getFilters = useCallback(
    () => ({
      ...(statusFilter !== 'all' && statusFilter !== 'starred' ? { status: statusFilter } : {}),
      ...(statusFilter === 'starred' ? { starred: true } : {}),
      q: searchQuery,
    }),
    [searchQuery, statusFilter],
  );

  const loadTodos = useCallback(async () => {
    const [all, visible] = await Promise.all([getTodos(), getTodos(getFilters())]);
    setTodos(all);
    setVisibleTodos(visible);
  }, [getFilters]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Restore the refresh-cookie session before loading user-owned resources.
        const authUser = await getCurrentUser();
        const [savedTodos, savedProfile] = await Promise.all([getTodos(), getProfile()]);
        if (!active) return;
        setTodos(savedTodos);
        setVisibleTodos(savedTodos);
        if (authUser) {
          setCurrentUser(authUser);
          setProfile((current) => ({
            ...current,
            name: authUser.name || savedProfile.displayName,
            username: authUser.email ? authUser.email.split('@')[0] : savedProfile.username,
            email: authUser.email || savedProfile.email,
          }));
        } else {
          setProfile((current) => ({
            ...current,
            name: savedProfile.displayName,
            username: savedProfile.username,
            email: savedProfile.email,
          }));
        }
        setApiError('');
      } catch (error) {
        if (active) setApiError(error.message || 'Could not connect to the API.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadTodos().catch((error) => setApiError(error.message || 'Could not load to-dos.'));
    }, searchQuery ? 250 : 0);
    return () => clearTimeout(timeout);
  }, [loadTodos, searchQuery]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3200);
  }, []);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setProfile((current) => ({
      ...current,
      name: user.name || current.name,
      email: user.email || current.email,
      username: user.email ? user.email.split('@')[0] : current.username,
    }));
    loadTodos().catch(console.error);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    loadTodos().catch(console.error);
    addToast('Signed out successfully', 'info');
  };

  const handleSaveProfile = async (form) => {
    try {
      const saved = await updateProfile({ username: form.username, displayName: form.name, email: form.email });
      setProfile((current) => ({ ...current, username: saved.username, name: saved.displayName, email: saved.email }));
      setApiError('');
      addToast('Profile updated successfully!', 'success');
      return true;
    } catch (error) {
      setApiError(error.message || 'Could not update the profile.');
      addToast(error.message || 'Could not update the profile.', 'error');
      return false;
    }
  };

  const handleAddTodo = async (todoData) => {
    try {
      await createTodo(todoData);
      await loadTodos();
      setApiError('');
      addToast('To-do added', 'success');
      return true;
    } catch (error) {
      setApiError(error.message || 'Could not create the to-do.');
      addToast(error.message || 'Could not create the to-do.', 'error');
      return false;
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      const updated = await updateTodo(id, updates);
      await loadTodos();
      setEditingTodo(null);
      setApiError('');
      if (updated.status === 'done' && todos.length > 0 && todos.every((todo) => todo.id === id || todo.status === 'done')) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
      addToast('To-do updated', 'success');
    } catch (error) {
      setApiError(error.message || 'Could not update the to-do.');
      addToast(error.message || 'Could not update the to-do.', 'error');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
      await loadTodos();
      setApiError('');
      addToast('To-do deleted', 'success');
    } catch (error) {
      setApiError(error.message || 'Could not delete the to-do.');
      addToast(error.message || 'Could not delete the to-do.', 'error');
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]));
  };

  const handleSelectAll = () => {
    const visibleIds = visibleTodos.map((todo) => todo.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) =>
      allSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])],
    );
  };

  const handleBulkStatusChange = async (status) => {
    try {
      await updateTodosBulk({ ids: selectedIds, status });
      setSelectedIds([]);
      await loadTodos();
      setApiError('');
      addToast(`Updated ${selectedIds.length} to-dos`, 'success');
    } catch (error) {
      setApiError(error.message || 'Could not update selected to-dos.');
      addToast(error.message || 'Could not update selected to-dos.', 'error');
    }
  };

  const handleBulkTogglePriority = async () => {
    try {
      const makeStarred = selectedIds.some((id) => !todos.find((todo) => todo.id === id)?.starred);
      await Promise.all(selectedIds.map((id) => updateTodo(id, { starred: makeStarred })));
      setSelectedIds([]);
      await loadTodos();
      setApiError('');
      addToast('Updated priority for selected to-dos', 'success');
    } catch (error) {
      setApiError(error.message || 'Could not update priority.');
      addToast(error.message || 'Could not update priority.', 'error');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await updateTodosBulk({ ids: selectedIds });
      const count = selectedIds.length;
      setSelectedIds([]);
      await loadTodos();
      setApiError('');
      addToast(`Deleted ${count} to-dos`, 'success');
    } catch (error) {
      setApiError(error.message || 'Could not delete selected to-dos.');
      addToast(error.message || 'Could not delete selected to-dos.', 'error');
    }
  };

  const handleReorderTodos = async (fromIndex, toIndex) => {
    const reordered = [...visibleTodos];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    try {
      const saved = await reorderTodos(reordered.map((todo) => todo.id));
      setTodos(saved);
      setVisibleTodos(saved);
      setApiError('');
    } catch (error) {
      setApiError(error.message || 'Could not save to-do order.');
      addToast(error.message || 'Could not save to-do order.', 'error');
    }
  };

  const stats = useMemo(() => {
    const total = todos.length;
    const todo = todos.filter((item) => item.status === 'todo').length;
    const inProgress = todos.filter((item) => item.status === 'in_progress').length;
    const done = todos.filter((item) => item.status === 'done').length;
    const starred = todos.filter((item) => item.starred).length;
    return { total, todo, inProgress, done, starred, completionPct: total ? Math.round((done / total) * 100) : 0 };
  }, [todos]);

  const statusCounts = useMemo(
    () => ({
      all: todos.length,
      todo: todos.filter((item) => item.status === 'todo').length,
      in_progress: todos.filter((item) => item.status === 'in_progress').length,
      done: todos.filter((item) => item.status === 'done').length,
      starred: todos.filter((item) => item.starred).length,
    }),
    [todos],
  );

  return (
    <div className="app-layout">
      <Toast toasts={toasts} />
      <Header
        profile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {apiError && (
          <p role="alert" className="api-error">
            {apiError}
          </p>
        )}
        <StatsDashboard stats={stats} />
        <AddTodoForm onAddTodo={handleAddTodo} />
        <TodoFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusCounts={statusCounts}
        />
        {loading ? (
          <p role="status">Loading to-dos…</p>
        ) : (
          <TodoList
            todos={visibleTodos}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleSelectAll}
            onUpdateTodo={handleUpdateTodo}
            onDeleteTodo={handleDeleteTodo}
            onOpenEditModal={setEditingTodo}
            onReorderTodos={handleReorderTodos}
            canReorder={statusFilter === 'all' && !searchQuery.trim()}
          />
        )}
      </main>
      <BulkActionBar
        selectedCount={selectedIds.length}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkTogglePriority={handleBulkTogglePriority}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedIds([])}
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        stats={stats}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onShowToast={addToast}
      />
      <EditTodoModal
        isOpen={Boolean(editingTodo)}
        onClose={() => setEditingTodo(null)}
        todo={editingTodo}
        onSave={(todo) => handleUpdateTodo(todo.id, { title: todo.title, status: todo.status })}
      />
    </div>
  );
}
