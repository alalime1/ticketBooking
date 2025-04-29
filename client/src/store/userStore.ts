import { create } from "zustand";

interface User {
  _id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "ADMIN",
    }),
}));
