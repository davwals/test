// Supabase Configuration
// Replace these with your actual Supabase project credentials from https://app.supabase.com

const SUPABASE_URL = 'https://ocvfzmgaesdjxstzikcl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdmZ6bWdhZXNkanhzdHppa2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDc5MjcsImV4cCI6MjA4NDMyMzkyN30.9RAJ_MB9_bXaN1CrKJ4DE7S-kBBF6l-YCYxjDW7L9OE';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;
