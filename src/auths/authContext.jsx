import { createContext, useState, useEffect } from "react";
import { supabase } from '../lib/supabase';  

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        // Prevent double calls on strict mode
        let mounted = true;

        const initializeAuth = async () => {
            try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Session restore error:', error);
                if (mounted) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                }
                return;
            }
            console.log('getSession result:', { session: !!session, user: session?.user?.id, error });

            if (session?.user && mounted) {
                setUser(session.user);
                setIsAuthenticated(true);
            } else if (mounted) {
                setUser(null);
                setIsAuthenticated(false);
            }
            if (mounted) setLoading(false);
            } catch (err) {
            console.error('Auth init failed:', err);
            if (mounted) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
            }
            }
        };

        initializeAuth();

        // Listen for future changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (mounted) {
            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
            }
        });

        return () => {
            mounted = false;
            authListener.subscription.unsubscribe();
        };
        }, []);

    // Login function – called from Login page after successful sign-in
    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            await supabase.auth.refreshSession()
            setUser(data.user);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUser(null);
            setIsAuthenticated(false);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,         
        isAuthenticated,
        loading,
        login,         
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
export default AuthProvider;