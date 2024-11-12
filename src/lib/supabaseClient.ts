import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-bfshmuuhkxhihwrkedtu-auth-token',
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null;
        const item = window.localStorage.getItem(key);
        console.log('Getting storage item:', key, item ? 'exists' : 'null');
        return item ? JSON.parse(item) : null;
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return;
        console.log('Setting storage item:', key);
        window.localStorage.setItem(key, JSON.stringify(value));
        
        // Clean up other session storage keys
        const keysToRemove = [
          'supabase.auth.token',
          'sb-session',
          'user'
        ];
        keysToRemove.forEach(k => {
          if (k !== key) localStorage.removeItem(k);
        });
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return;
        console.log('Removing storage item:', key);
        window.localStorage.removeItem(key);
      }
    }
  }
});

// Add debug function to check session
export async function checkSession() {
  const session = await supabase.auth.getSession();
  console.log('Current session:', session);
  return session;
}

// Add these functions to interact with the toit_mindmap_node table
export async function getNodes() {
  const { data, error } = await supabase
    .from('toit_mindmap_node')
    .select('*');
  if (error) throw error;
  return data;
}

export async function addNode(x: number, y: number, z: number) {
  const { data, error } = await supabase
    .from('toit_mindmap_node')
    .insert({ x, y, z })
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateNode(id: number, x: number, y: number, z: number) {
  const { data, error } = await supabase
    .from('toit_mindmap_node')
    .update({ x, y, z })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
}

export async function createMindMapList(listName: string, listColor: string, userId: string) {
  const { data, error } = await supabase
    .from('toit_list')
    .insert({
      user_id: userId,
      list_name: listName,
      list_color: listColor
    })
    .select();
  if (error) throw error;
  return data[0];
}
