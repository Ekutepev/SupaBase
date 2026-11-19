import {createContext, useContext, useEffect, useState, type ReactNode, } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "../../lib/supabase";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Check for an existing session when the app starts.
    async function loadSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.log("Session error:", error.message);
        }

        if (active) {
          setSession(data.session);
        }
      } catch (error) {
        console.log("Could not load session:", error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    // Listen for changes to the user's authentication state.
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, newSession) => {
        if (active) {
          setSession(newSession);
          setIsLoading(false);
        }
      });

    loadSession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Supabase handles checking the user's credentials.
  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      throw error;
    }
  }

  // Returns true if the user has an active session.
  // Returns false if email confirmation is required.
  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      throw error;
    }

    return data.session !== null;
  }

  // Supabase removes the current session when signing out.
  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
