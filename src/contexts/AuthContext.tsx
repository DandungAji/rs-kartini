import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  username: string;
  role: 'admin' | 'editor';
} | null;

interface AuthContextType {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .eq('id', authUser.id)
          .single();
        
        if (error || !profile) {
          console.error("Failed to fetch profile:", error);
          setUser(null);
        } else {
          setUser({
            id: profile.id,
            username: profile.full_name || authUser.email || 'Unknown',
            role: profile.role as 'admin' | 'editor',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        fetchUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error || !data.user) {
      setLoading(false);
      return false;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', data.user.id)
      .single();
    
    if (profileError || !profile) {
      console.error("Failed to fetch profile:", profileError);
      setLoading(false);
      return false;
    }

    setUser({
      id: profile.id,
      username: profile.full_name || data.user.email || 'Unknown',
      role: profile.role as 'admin' | 'editor',
    });
    setLoading(false);
    return true;
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const contextValue = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}