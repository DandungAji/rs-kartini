import { createContext, useContext, useEffect, useState } from "react";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Get user error:", error.message);
          throw error;
        }

        if (user) {
          console.log("Fetched user:", user.id, user.email);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, full_name, email, phone, role')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.warn("Failed to fetch profile:", profileError);
            // Fallback ke user_metadata atau email
            setUser({
              ...user,
              user_metadata: {
                ...user.user_metadata,
                username: user.user_metadata?.username || user.email,
                full_name: user.user_metadata?.full_name || user.email,
                role: user.user_metadata?.role || 'author',
              },
            });
          } else {
            console.log("Fetched profile:", profile);
            setUser({
              ...user,
              user_metadata: {
                ...user.user_metadata,
                username: profile.username || user.email,
                full_name: profile.full_name || user.email,
                email: profile.email || user.email,
                phone: profile.phone,
                role: profile.role || user.user_metadata?.role || 'author',
              },
            });
          }
        } else {
          setUser(null);
        }
      } catch (error: any) {
        console.error("Auth error:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (identifier: string, password: string) => {
    try {
      console.log("Attempting signIn with identifier:", identifier);
      let email = identifier;

      if (!identifier.includes('@')) {
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single();

        console.log("Username query result:", { data, error });
        if (error || !data?.email) {
          throw new Error("Username tidak ditemukan");
        }
        email = data.email;
      }

      console.log("Using email for auth:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Auth error:", error);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error("Username atau kata sandi salah");
        }
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Gagal mendapatkan data pengguna");
      }

      console.log("Signed in user:", data.user.id, data.user.email);
      setUser(data.user);
    } catch (error: any) {
      console.error("SignIn error:", error.message);
      throw new Error(error.message || "Gagal login: Terjadi kesalahan");
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting signOut");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("SignOut error:", error);
        throw error;
      }
      setUser(null);
      navigate('/login');
      console.log("Signed out successfully");
    } catch (error: any) {
      console.error("SignOut error:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}