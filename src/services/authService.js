import { supabase } from './supabase';

/**
 * Sign up a new user with email, password, and full name.
 */
export const signUp = async ({ email, password, fullName }) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      return { data: null, error: authError.message };
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          role: 'citizen',
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return { data: authData, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Sign in a user with email and password.
 */
export const signIn = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data: true, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get the currently authenticated user.
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data.user, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get a user's profile by their user id.
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Check if a user is an admin.
 */
export const isAdmin = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      return { data: false, error: error.message };
    }

    return { data: data.role === 'admin', error: null };
  } catch (err) {
    return { data: false, error: err.message };
  }
};

/**
 * Listen for auth state changes.
 * @param {function} callback - Called with (event, session)
 * @returns {object} subscription — call subscription.unsubscribe() to stop
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
};
