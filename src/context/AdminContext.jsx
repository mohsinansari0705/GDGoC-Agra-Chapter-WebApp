import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      // Check if there's an active Supabase Auth session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch admin details using the user_id
        const { data, error } = await supabase.rpc('get_admin_by_user_id', {
          p_user_id: session.user.id
        });

        if (error) throw error;

        if (data && data.length > 0) {
          setAdmin(data[0]);
        } else {
          // User exists but no admin record - logout
          await supabase.auth.signOut();
        }
      }
    } catch (err) {
      console.error('Session check error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function using custom validation with 4 fields
  const login = async (email, teamName, adminPosition, password) => {
    try {
      setError(null);
      setIsLoading(true);

      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      // Validate credentials using custom RPC
      const { data, error } = await supabase.rpc('validate_admin_login', {
        p_email: email,
        p_team_name: teamName,
        p_admin_position: adminPosition,
        p_password: password
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('Invalid credentials or access denied');
      }

      const admin = data[0];

      // Now sign in with Supabase Auth to create session
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      setAdmin(admin);

      return { success: true, admin };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAdmin(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Helper to check if admin is super_admin
  const isSuperAdmin = () => admin?.admin_type === 'super_admin';

  // Helper to check if admin is admin or above
  const isAdminOrAbove = () => ['super_admin', 'admin'].includes(admin?.admin_type);

  // Helper to check if admin has access to a specific feature
  const hasAccess = (feature) => {
    if (!admin) return false;

    const { admin_type } = admin;

    switch (feature) {
      case 'admins':
        return admin_type === 'super_admin';
      
      case 'events':
      case 'gallery':
        return ['super_admin', 'admin'].includes(admin_type);
      
      case 'members':
        return admin_type === 'super_admin';
      
      case 'blogs':
      case 'resources':
        // All admins can create, but only super_admin can see all
        return true;
      
      default:
        return false;
    }
  };

  const value = {
    admin,
    isLoading,
    error,
    login,
    logout,
    isSuperAdmin,
    isAdminOrAbove,
    hasAccess,
    isAuthenticated: !!admin
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
