import api from './api';

export async function auditList(ticketId) {
  const { data } = await api.get(`/audit/${ticketId}`);
  return data;
}