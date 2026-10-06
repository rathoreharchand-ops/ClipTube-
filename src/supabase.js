import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdfolmjeqfaegfwitjt.supabase.co'
const supabaseKey = 'sb_publis_...' // यहाँ अपनी पूरी Publishable Key पेस्ट कर दें

export const supabase = createClient(supabaseUrl, supabaseKey)
