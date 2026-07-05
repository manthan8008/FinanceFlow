/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import { demoUser } from "../data/demoData.js";

const AuthContext = createContext(null);
const LOCAL_USERS_KEY = "financeflow_local_users";

function readLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function toProfile(user) {
  const profile = { ...user };
  delete profile.password;
  return profile;
}

function isNetworkFallback(error) {
  return error.message === "Network Error" || error.message.includes("timeout") || !navigator.onLine;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("financeflow_token"));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("financeflow_user") || "null"));
  const [loading, setLoading] = useState(Boolean(token));

  const logout = useCallback((showToast = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("financeflow_token");
    localStorage.removeItem("financeflow_user");
    if (showToast) toast.success("Signed out");
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (!token) return setLoading(false);
      if (token.startsWith("local-token") || token === "demo-token") {
        return setLoading(false);
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("financeflow_user", JSON.stringify(data.user));
      } catch {
        logout(false);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [token, logout]);

  const persist = useCallback((authToken, profile) => {
    setToken(authToken);
    setUser(profile);
    localStorage.setItem("financeflow_token", authToken);
    localStorage.setItem("financeflow_user", JSON.stringify(profile));
  }, []);

  const login = useCallback(async (payload) => {
    try {
      const { data } = await api.post("/auth/login", payload);
      persist(data.token, data.user);
      toast.success("Welcome back");
    } catch (error) {
      if (!isNetworkFallback(error)) throw error;
      const users = readLocalUsers();
      const localUser = users.find((user) => user.email.toLowerCase() === payload.email.toLowerCase() && user.password === payload.password);
      if (!localUser && payload.email !== demoUser.email) {
        throw new Error("Backend is offline. Create a local account or use the demo account.", { cause: error });
      }
      persist("local-token", localUser ? toProfile(localUser) : demoUser);
      toast.success("Local workspace loaded");
    }
  }, [persist]);

  const register = useCallback(async (payload) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      persist(data.token, data.user);
      toast.success("Account created");
    } catch (error) {
      if (!isNetworkFallback(error)) throw error;
      const users = readLocalUsers();
      const existingUser = users.find((user) => user.email.toLowerCase() === payload.email.toLowerCase());
      if (existingUser) throw new Error("A local account already exists for this email.", { cause: error });
      const user = {
        ...payload,
        id: `local_${crypto.randomUUID()}`,
        name: payload.name || payload.email.split("@")[0],
        monthlyIncome: Number(payload.monthlyIncome || 0),
        savingsGoal: Number(payload.savingsGoal || 0),
      };
      writeLocalUsers([user, ...users]);
      persist("local-token", toProfile(user));
      toast.success("Local account created");
    }
  }, [persist]);

  const demoLogin = useCallback(async () => {
    try {
      const { data } = await api.post("/auth/demo");
      persist(data.token, data.user);
    } catch {
      persist("demo-token", demoUser);
    }
    toast.success("Demo workspace loaded");
  }, [persist]);

  const value = useMemo(() => ({ user, token, loading, isAuthenticated: Boolean(token), login, register, demoLogin, logout, setUser }), [user, token, loading, login, register, demoLogin, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
