import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../interfaces";

const initialState = {
  user: null,
};

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updatedFields: Partial<User>) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      resetUser: () => set(initialState),
      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),
    }),
    {
      name: "user-storage", // unique name for localStorage key
      partialize: (state) => ({ user: state.user }), // only persist user data
    }
  )
);
