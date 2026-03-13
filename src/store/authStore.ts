import { create } from 'zustand';
import { auth } from '../lib/firebase';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user, loading: false, initialized: true }),
  signOut: async () => {
    await auth.signOut();
    set({ user: null });
  },
}));
