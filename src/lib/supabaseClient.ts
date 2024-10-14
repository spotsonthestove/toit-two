import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bfshmuuhkxhihwrkedtu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmc2htdXVoa3hoaWh3cmtlZHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAzMjQ2ODcsImV4cCI6MTk5NTkwMDY4N30.yL58wz-kqOLdIXTU-zK3R1MwmOEo2v8bcIfvFfDg-tQ'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)