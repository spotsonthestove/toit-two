import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bamzyxrbnmouzbgnczgp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbXp5eHJibm1vdXpiZ25jemdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI4MDQwMTAsImV4cCI6MTk3ODM4MDAxMH0.Nm-u2ctTIRHc8I6lB9JcbuXVzlxZNZQJU_z5PEIUNOA'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)