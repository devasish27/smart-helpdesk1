import api from './api';

// list tickets
export async function ticketList() {
  const { data } = await api.get('/tickets');
  return data;
}

// get single ticket
export async function ticketGet(id) {
  const { data } = await api.get(`/tickets/${id}`);
  return data;
}

// create
export async function ticketCreate(payload) {
  const { data } = await api.post('/tickets', payload);
  return data;
}

// update
export async function ticketUpdate(id, payload) {
  const { data } = await api.put(`/tickets/${id}`, payload);
  return data;
}

// delete
export async function ticketDelete(id) {
  const { data } = await api.delete(`/tickets/${id}`);
  return data;
}

// run triage
export async function ticketTriage(id) {
  const { data } = await api.post(`/triage/${id}/triage`);
  return data;
}