"use client";
// ==============================================================================
// core/providers/auth-provider.tsx
// Supabase Auth session & profile hydration provider
// ==============================================================================
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseAuthRepository } from "@features/authentication/data/repositories/supabase-auth.repository";
import { GetCurrentUserUseCase } from "@features/authentication/domain/usecases";
import type { UserProfileEntity } from "@features/authentication/domain/entities/user-profile.entity";
import { useAuthStore } from "@features/authentication/presentation/stores/auth.store";

interface AuthContextValue {
  user: UserProfileEntity | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refetchUser: () => Promise<UserProfileEntity | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const repository = new SupabaseAuthRepository();
const getCurrentUserUseCase = new GetCurrentUserUseCase(repository);

/**
 * Provides Supabase authentication state & hydrated admin profile to the React tree.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [profileUser, setProfileUser] = useState<UserProfileEntity | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();
  const { setUser, clearUser, setLoading: setStoreLoading } = useAuthStore();

  const fetchAndStoreUser = async (): Promise<UserProfileEntity | null> => {
    try {
      const userEntity = await getCurrentUserUseCase.execute();
      if (userEntity) {
        setProfileUser(userEntity);
        setUser(userEntity);
        return userEntity;
      } else {
        setProfileUser(null);
        clearUser();
        return null;
      }
    } catch {
      setProfileUser(null);
      clearUser();
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      setStoreLoading(true);
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        setSession(currentSession);

        if (currentSession?.user) {
          const userEntity = await getCurrentUserUseCase.execute();
          if (isMounted) {
            if (userEntity) {
              setProfileUser(userEntity);
              setUser(userEntity);
            } else {
              setProfileUser(null);
              clearUser();
            }
          }
        } else {
          if (isMounted) {
            setProfileUser(null);
            clearUser();
          }
        }
      } catch {
        if (isMounted) {
          setProfileUser(null);
          clearUser();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setStoreLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, newSession: Session | null) => {
      setSession(newSession);

      if (event === "SIGNED_OUT") {
        if (isMounted) {
          setProfileUser(null);
          clearUser();
          setIsLoading(false);
          setStoreLoading(false);
        }
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (newSession?.user) {
          try {
            const userEntity = await getCurrentUserUseCase.execute();
            if (isMounted) {
              if (userEntity) {
                setProfileUser(userEntity);
                setUser(userEntity);
              } else {
                setProfileUser(null);
                clearUser();
              }
            }
          } catch {
            if (isMounted) {
              setProfileUser(null);
              clearUser();
            }
          } finally {
            if (isMounted) {
              setIsLoading(false);
              setStoreLoading(false);
            }
          }
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = async () => {
    await supabase.auth.signOut();
    clearUser();
    setSession(null);
    setProfileUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: profileUser,
        session,
        isLoading,
        isAuthenticated: !!profileUser,
        signOut,
        refetchUser: fetchAndStoreUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
