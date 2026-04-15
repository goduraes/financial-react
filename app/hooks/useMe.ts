import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

export const useMe = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};