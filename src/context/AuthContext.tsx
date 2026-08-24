import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { ADMIN_UID } from "../constants";

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  isAdmin: false,
  loading: true,
  login: async () => "Auth unavailable",
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    if (!auth) return "Firebase is not configured. See constants.ts";
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (cred.user.uid !== ADMIN_UID) {
        await signOut(auth);
        return "This account is not authorised to access the portal.";
      }
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "Login failed.";
    }
  };

  const logout = async () => {
    if (auth) await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: Boolean(user && ADMIN_UID && user.uid === ADMIN_UID),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}