import { createContext } from "react";

export type User = {
  id: string;
  name: string;
  email: string
  role: "ADMIN" | "COMMON";
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);