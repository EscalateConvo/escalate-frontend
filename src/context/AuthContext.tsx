import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../lib/firebase.ts";
import { toast } from "sonner";
import { logout as logoutFirebase } from "../lib/authActions.ts";
import { setToken, clearToken, apiClient, queryClient } from "@/lib/apiService";
import { useGetUser } from "../hooks/useAuth.ts";
import { QUERY_KEYS } from "../constants.ts";

// ============================================================================
// Types
// ============================================================================

interface RegisterResponse {
  message: string;
  data: {
    _doc: User;
    newUser: boolean;
  };
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  needsRoleSelection: boolean;
  logout: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
  clearRoleSelectionFlag: () => void;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  loading: true,
  needsRoleSelection: false,
  logout: async () => {},
  getToken: async () => undefined,
  clearRoleSelectionFlag: () => {},
});

// ============================================================================
// Provider
// ============================================================================

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userQueryEnabled, setUserQueryEnabled] = useState(false);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem("needsRoleSelection") === "true";
  });

  const { data: user, isLoading: userLoading } = useGetUser(userQueryEnabled);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);

        try {
          const token = await fbUser.getIdToken();
          console.log("Token", token);
          setToken(token);

          // Check if we've already processed this user's registration
          const registrationKey = `registered-${fbUser.uid}`;
          const alreadyRegistered = localStorage.getItem(registrationKey);

          if (!alreadyRegistered) {
            // First time - call register endpoint and check newUser flag
            const response =
              await apiClient.post<RegisterResponse>("/api/auth/register");
            const isNewUser = response.data.data.newUser;

            // Store registration status
            localStorage.setItem(registrationKey, "true");

            // Only set needsRoleSelection if this is a genuinely new user
            if (isNewUser) {
              localStorage.setItem("needsRoleSelection", "true");
              setNeedsRoleSelection(true);
            } else {
              // Existing user - clear any stale role selection flag
              localStorage.removeItem("needsRoleSelection");
              setNeedsRoleSelection(false);
            }
          }

          setUserQueryEnabled(true);
        } catch (error) {
          console.error("Error during auth initialization:", error);
          setFirebaseUser(null);
          clearToken();
          setUserQueryEnabled(false);
        } finally {
          setAuthLoading(false);
        }
      } else {
        // User signed out
        setFirebaseUser(null);
        clearToken();
        setUserQueryEnabled(false);
        setNeedsRoleSelection(false);
        queryClient.removeQueries({ queryKey: [QUERY_KEYS.USER.GET_USER] });
        setAuthLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const getToken = async () => {
    if (!firebaseUser) return undefined;
    try {
      return await firebaseUser.getIdToken();
    } catch (error) {
      console.error("Error getting token:", error);
      return undefined;
    }
  };

  const logout = async () => {
    if (!firebaseUser) return;

    try {
      setAuthLoading(true);
      const uid = firebaseUser.uid;
      await logoutFirebase();

      // Clear all user-related storage
      localStorage.removeItem(`registered-${uid}`);
      localStorage.removeItem("needsRoleSelection");
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.USER.GET_USER] });

      toast.success("Successfully logged out");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      console.error("Logout failed:", errorMessage);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const clearRoleSelectionFlag = () => {
    localStorage.removeItem("needsRoleSelection");
    setNeedsRoleSelection(false);
  };

  const loading = authLoading || userLoading;

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user: user || null,
        loading,
        needsRoleSelection,
        logout,
        getToken,
        clearRoleSelectionFlag,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
