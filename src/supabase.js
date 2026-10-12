import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdfolmjeqaefwitjtr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZm9sbWplcWZhZWdmd2l0anRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2ODcwMzksImV4cCI6MjEwNjI2MzAzOX0.TlLx1xa-aMHys4ip7jzsy6v2qsAlnu3R9lTP-ACh3_c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)