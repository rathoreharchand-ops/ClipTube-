import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdfolmjeqaefwitjtr.supabase.co'
const supabaseAnonKey = 'YOUR_ANON_KEY_HERE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
