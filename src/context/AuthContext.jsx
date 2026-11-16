import { createContext, useState, useEffect, useMemo } from 'react';
import {
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  getUserProfile,
  onAuthStateChange,
} from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const fetchProfile = async (userId) => {
    const { data, error } = await getUserProfile(userId);
    if (!error && data) {
      setProfile(data);
      setIsAdminUser(data.role === 'admin');
    } else {
      setProfile(null);
      setIsAdminUser(false);
    }
  };

  useEffect(() => {
    const subscription = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setIsAdminUser(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }) => {
    const result = await authSignIn({ email, password });
    return result;
  };

  const signUp = async ({ email, password, fullName }) => {
    const result = await authSignUp({ email, password, fullName });
    return result;
  };

  const signOut = async () => {
    const result = await authSignOut();
    if (!result.error) {
      setUser(null);
      setProfile(null);
      setIsAdminUser(false);
    }
    return result;
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAdmin: isAdminUser,
      signIn,
      signUp,
      signOut,
    }),
    [user, profile, loading, isAdminUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
