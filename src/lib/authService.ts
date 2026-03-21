import { supabase } from './supabaseClient';

/**
 * Sign up a new user with email/password.
 * Automatically creates a profile row via the database trigger.
 */
export async function signUp(email: string, password: string, displayName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: displayName } }
  });
  return { data, error };
}

/**
 * Sign in with email/password.
 * Falls back to a demo mock if credentials match admin@royal.com / royal123.
 */
export async function signIn(email: string, password: string) {
  // Demo fallback for unauthenticated environments
  if (email === 'admin@royal.com' && password === 'royal123') {
    localStorage.setItem('demoUser', JSON.stringify({ email, name: 'المدير الملكي', role: 'admin' }));
    return { data: { user: { email } }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  localStorage.removeItem('demoUser');
  await supabase.auth.signOut();
}

/**
 * Get the current authenticated user (Supabase or demo).
 */
export async function getCurrentUser() {
  const demoUser = localStorage.getItem('demoUser');
  if (demoUser) return JSON.parse(demoUser);

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
