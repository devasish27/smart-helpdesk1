import { create } from 'zustand';

const userFromStorage = typeof localStorage !== 'undefined'
  ? JSON.parse(localStorage.getItem('user') || 'null')
  : null;

const tokenFromStorage = typeof localStorage !== 'undefined'
  ? localStorage.getItem('token')
  : null;


export const useAuth = create((set) => ({
  user: userFromStorage,
  token: tokenFromStorage,
  login: ({ user, token }) => {
    set({ user, token });
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
}));