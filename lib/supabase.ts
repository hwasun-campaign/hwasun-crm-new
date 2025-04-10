import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wxdlitplwqgmapjolnup.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4ZGxpdHBsd3FnbWFwam9sbnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDcxODYsImV4cCI6MjA1OTgyMzE4Nn0.exP52Z3w89VypSJD1rIgQXejpif1yP5jI_OV8vsAK2k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)