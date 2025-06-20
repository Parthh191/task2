const BASE_URL = 'http://localhost:3000/api';

const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = isMultipart ? {} : { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth endpoints
  register: async (data) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register');
    }
    return response.json();
  },

  // Blog endpoints
  getBlogs: async () => {
    const response = await fetch(`${BASE_URL}/blogs`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch blogs');
    return response.json();
  },

  getBlogById: async (id) => {
    const response = await fetch(`${BASE_URL}/blogs/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch blog');
    return response.json();
  },

  createBlog: async (data) => {
    const isMultipart = data instanceof FormData;
    const response = await fetch(`${BASE_URL}/blogs`, {
      method: 'POST',
      headers: getAuthHeaders(isMultipart),
      body: isMultipart ? data : JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create blog');
    return response.json();
  },

  updateBlog: async (id, data) => {
    const isMultipart = data instanceof FormData;
    const response = await fetch(`${BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(isMultipart),
      body: isMultipart ? data : JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update blog');
    return response.json();
  },

  deleteBlog: async (id) => {
    const response = await fetch(`${BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete blog');
    return response.json();
  },

  // User endpoints
  getUsers: async () => {
    const response = await fetch(`${BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  updateUserRole: async (userId, role) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error('Failed to update user role');
    return response.json();
  },
};