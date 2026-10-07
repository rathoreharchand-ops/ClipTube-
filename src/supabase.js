import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdfolmjeqfaegfwitjt.supabase.co'
const supabaseKey = 'sb_publishable_EGIYZoskxn3V-PbWr3Sb1kw_PH-BRuM8'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: { 'x-client-info': 'supabase-js-web' },
  },
})
