const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    throw new Error(message || `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

const toUiTodo = (todo) => ({ ...todo, status: todo.status.toLowerCase() });
const toApiTodo = (todo) => ({ ...todo, ...(todo.status ? { status: todo.status.toUpperCase() } : {}) });

export const getTodos = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status.toUpperCase());
  if (filters.q?.trim()) params.set('q', filters.q.trim());
  if (filters.starred !== undefined) params.set('starred', String(filters.starred));
  const query = params.size ? `?${params.toString()}` : '';
  return (await request(`/todos${query}`)).map(toUiTodo);
};
export const createTodo = async (todo) => toUiTodo(await request('/todos', {
  method: 'POST', body: JSON.stringify(toApiTodo(todo)),
}));
export const updateTodo = async (id, updates) => toUiTodo(await request(`/todos/${id}`, {
  method: 'PATCH', body: JSON.stringify(toApiTodo(updates)),
}));
export const deleteTodo = (id) => request(`/todos/${id}`, { method: 'DELETE' });
export const updateTodosBulk = async ({ ids, status }) => {
  const body = { ids, ...(status ? { status: status.toUpperCase() } : {}) };
  const result = await request('/todos/bulk', { method: 'PATCH', body: JSON.stringify(body) });
  return Array.isArray(result) ? result.map(toUiTodo) : result;
};
export const reorderTodos = async (ids) =>
  (await request('/todos/order', { method: 'PATCH', body: JSON.stringify({ ids }) })).map(toUiTodo);
export const getProfile = () => request('/profile');
export const updateProfile = (profile) => request('/profile', {
  method: 'PATCH', body: JSON.stringify(profile),
});
