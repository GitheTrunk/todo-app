const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
let accessToken = null;
let accessTokenExpiresAt = 0;
let refreshPromise = null;

export const getAuthToken = () => accessToken;
export const setAuthToken = (token) => {
  accessToken = token || null;
  accessTokenExpiresAt = 0;
  if (!accessToken) return;
  try {
    const encodedPayload = accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=');
    const payload = JSON.parse(atob(paddedPayload));
    accessTokenExpiresAt = payload.exp ? payload.exp * 1000 : 0;
  } catch {
    accessTokenExpiresAt = 0;
  }
};
export const clearAuthToken = () => setAuthToken(null);

const NO_REFRESH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

async function request(path, options = {}, retryAfterRefresh = true) {
  if (
    accessToken &&
    accessTokenExpiresAt &&
    accessTokenExpiresAt - Date.now() < 30_000 &&
    !NO_REFRESH_PATHS.includes(path)
  ) {
    try {
      await refreshAccessToken();
    } catch {
      clearAuthToken();
    }
  }

  const token = getAuthToken();
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    if (
      response.status === 401 &&
      retryAfterRefresh &&
      !NO_REFRESH_PATHS.includes(path)
    ) {
      try {
        await refreshAccessToken();
        return request(path, options, false);
      } catch {
        clearAuthToken();
      }
    }
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    throw new Error(message || `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Session expired');
      const data = await response.json();
      setAuthToken(data.accessToken);
      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

const toUiTodo = (todo) => ({ ...todo, status: todo.status.toLowerCase() });
const toApiTodo = (todo) => ({ ...todo, ...(todo.status ? { status: todo.status.toUpperCase() } : {}) });

// Auth endpoints
export const registerUser = async (credentials) => {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (data?.accessToken) {
    setAuthToken(data.accessToken);
  }
  return data;
};

export const loginUser = async (credentials) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (data?.accessToken) {
    setAuthToken(data.accessToken);
  }
  return data;
};

export const getCurrentUser = async () => {
  try {
    if (!getAuthToken()) await refreshAccessToken();
    const data = await request('/auth/me');
    return data;
  } catch {
    clearAuthToken();
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {},
    });
  } catch {
    // Clear the local session even if the API is unreachable.
  } finally {
    clearAuthToken();
  }
};

// Todo endpoints
export const getTodos = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status.toUpperCase());
  if (filters.q?.trim()) params.set('q', filters.q.trim());
  if (filters.starred !== undefined) params.set('starred', String(filters.starred));
  const query = params.size ? `?${params.toString()}` : '';
  return (await request(`/todos${query}`)).map(toUiTodo);
};

export const createTodo = async (todo) =>
  toUiTodo(
    await request('/todos', {
      method: 'POST',
      body: JSON.stringify(toApiTodo(todo)),
    }),
  );

export const updateTodo = async (id, updates) =>
  toUiTodo(
    await request(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toApiTodo(updates)),
    }),
  );

export const deleteTodo = (id) => request(`/todos/${id}`, { method: 'DELETE' });

export const updateTodosBulk = async ({ ids, status }) => {
  const body = { ids, ...(status ? { status: status.toUpperCase() } : {}) };
  const result = await request('/todos/bulk', { method: 'PATCH', body: JSON.stringify(body) });
  return Array.isArray(result) ? result.map(toUiTodo) : result;
};

export const reorderTodos = async (ids) =>
  (await request('/todos/order', { method: 'PATCH', body: JSON.stringify({ ids }) })).map(toUiTodo);

export const getProfile = () => request('/profile');
export const updateProfile = (profile) =>
  request('/profile', {
    method: 'PATCH',
    body: JSON.stringify(profile),
  });
