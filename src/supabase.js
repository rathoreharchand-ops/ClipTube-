import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdfolmjeqfaegfwitjt.supabase.co'
const supabaseKey = 'sb_publishable_EGYYZoskx3V-PbWr3Sb1kw_PH-BRuM8'

export const supabase = createClient(supabaseUrl, supabaseKey)
