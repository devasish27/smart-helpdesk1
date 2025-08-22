import api from './api';

// login
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  return data.user;
}

// search KB
export async function kbSearch({ query = '', status = '', page = 1, limit = 10 }) {
  const { data } = await api.get('/kb', { params: { query, status, page, limit } });
  return data;
}

// create article
export async function kbCreate(payload) {
  const { data } = await api.post('/kb', payload);
  return data;
}

// update article
export async function kbUpdate(id, payload) {
  const { data } = await api.put(`/kb/${id}`, payload);
  return data;
}

// delete article
export async function kbDelete(id) {
  const { data } = await api.delete(`/kb/${id}`);
  return data;
}

// publish/unpublish article
export async function kbPublish(id, status) {
  const { data } = await api.patch(`/kb/${id}/status`, { status });
  return data;
}