import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdfolmjeqaefwitjtr.supabase.co'
const supabaseAnonKey = 'sb_publishable_EGYYZoskx3V-PbWr3Sb1kw_PH-BRuM8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
