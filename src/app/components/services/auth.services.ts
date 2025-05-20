import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthError, AuthUser } from '@/types/auth';

const supabase = createClientComponentClient();

export const authService = {
  async login(email: string, password: string): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      // First, attempt to sign in
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        return {
          user: null,
          error: {
            message: 'Invalid email or password',
            field: 'password'
          }
        };
      }

      if (!authData.user) {
        return {
          user: null,
          error: {
            message: 'No user found',
            field: 'email'
          }
        };
      }

      // Get user role from profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        return {
          user: null,
          error: {
            message: 'Error fetching user role',
            field: null
          }
        };
      }

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          role: profile.role
        },
        error: null
      };
    } catch (error: any) {
      return {
        user: null,
        error: {
          message: 'An unexpected error occurred',
          field: null
        }
      };
    }
  },

  async verifySession(): Promise<AuthUser | null> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email!,
      role: profile.role
    };
  }
};