import { useState, useEffect, useContext, createContext } from "react";
import toast from "react-hot-toast";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
} from "../models/models";
import { login, loginWithGoogle, register } from "../services/AuthServices";
import { getMe } from "../services/UserServices";
import { removeAccessKey } from "../services/cookies";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (c: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (c: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (u: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// ---------------------
// Provider
// ---------------------
interface AuthProviderProps {
  children: any;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const setUser = (user: User | null) =>
    setState({ user, isAuthenticated: !!user, isLoading: false });

  const setLoading = (status: boolean = true) => setState((s) => ({ ...s, isLoading: status }));

  useEffect(() => {
    const restoreSession = async () => {
      const res = await getMe(setLoading);

      if (!res.status) {
        if (res.data === "NO_TOKEN") {
          setUser(null);
          setState((s) => ({ ...s, isAuthenticated: false }));
        } else {
          // server error, show toast but keep state
          removeAccessKey()
          toast.error(res.message);
        }
        return;
      }

      // session restored
      setUser(res.data);
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: async (c: LoginCredentials) => {
          const res = await login(c, setLoading);
          if (!res.status) {
            toast.error(res.message)
          }
          setUser(res.data.user);
          toast.success("Welcome!")
        },
        loginWithGoogle: async () => {
          const res = await loginWithGoogle(setLoading);
          if (!res.status) {
            toast.error(res.message)
          }
          setUser(res.data.user);
          toast.success("Welcome!")
        },
        register: async (c: RegisterCredentials) => {
          const res = await register(c, setLoading);
          if (!res.status) {
            toast.error(res.message)
          }
          setUser(res.data.user);
          toast.success("Welcome!")
        },
        logout: () => {setUser(null); removeAccessKey();},
        updateUser: (u: Partial<User>) =>
          setState((s) => (s.user ? { ...s, user: { ...s.user, ...u } } : s)),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
