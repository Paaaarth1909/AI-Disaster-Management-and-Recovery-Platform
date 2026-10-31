import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://boywljczgbqzzyoctoar.supabase.co';
// Strip any trailing /rest/v1 or trailing slashes so Supabase SDK forms valid endpoint paths
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJveXdsamN6Z2Jxenp5b2N0b2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNTgzNDgsImV4cCI6MjA1NzYzNDM0OH0.taJw85w4zOfd821H5hEJskbz6xz3NRPWT1EwjemBnDo';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
