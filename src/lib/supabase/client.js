import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lkdwcyfkrsaogthddklw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZHdjeWZrcnNhb2d0aGRka2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzQwODcsImV4cCI6MjA1ODUxMDA4N30.RDHiljboqEk5HtFgin79ZqCvXJxXhBWf3ydbfBDy3jM";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 