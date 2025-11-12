import { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T];

// Example type for the users table
export type User = Tables<'users'>;

// Example type for the properties table
export type Property = Tables<'properties'>;

// Example type for the transactions table
export type Transaction = Tables<'transactions'>;

// Example type for user roles
export type UserRole = Enums<'user_role'>;
