import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Profile, authAPI, profileAPI } from '../lib/mongodb';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await profileAPI.getProfile(userId);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user._id);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);

      const userData: User = {
        _id: response.user_id || response._id,
        email: response.email,
        full_name: response.full_name,
        role: response.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(userData);
      await fetchProfile(userData._id);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string, role: string) => {
    try {
      const response = await authAPI.signup(email, password, fullName, role as any);
      // After successful signup, automatically log in the user
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    // Clear any stored tokens or session data
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedProfile = localStorage.getItem('profile');

        if (storedUser && storedProfile) {
          const userData = JSON.parse(storedUser);
          const profileData = JSON.parse(storedProfile);
          setUser(userData);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('profile');
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Store user and profile in localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('profile');
    }
  }, [profile]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile, login, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
