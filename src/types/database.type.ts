export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'worker'
          created_at: string
          email: string
          full_name: string | null
        }
        Insert: {
          id: string
          role?: 'admin' | 'worker'
          created_at?: string
          email: string
          full_name?: string | null
        }
        Update: {
          id?: string
          role?: 'admin' | 'worker'
          created_at?: string
          email?: string
          full_name?: string | null
        }
      }
    }
  }
}