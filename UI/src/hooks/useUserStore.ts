import { create } from "zustand";
import { User } from "../interfaces";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updatedFields) =>
    set((state) => ({
      user: { ...state.user, ...updatedFields },
    })),
}));
