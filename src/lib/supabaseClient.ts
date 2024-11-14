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

// Get all mind maps for the current user
export async function getMindMaps() {
  const { data, error } = await supabase
    .from('mindmaps')
    .select(`
      mindmap_id,
      name,
      description,
      created_at,
      mindmap_nodes (
        node_id,
        content,
        x,
        y,
        z,
        parent_node_id,
        node_type
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Create a new mind map with nodes
export async function createMindMap(name: string, description: string, nodes: Node[]) {
  try {
    // Get the current user's ID
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log('User data:', userData);
    console.log('User error:', userError);

    if (userError) throw userError;
    if (!userData.user) throw new Error('User not authenticated');

    const user = userData.user;
    console.log('Attempting to create mindmap for user:', user.id);

    // First create the mind map with the user_id
    const { data: mindmap, error: mindmapError } = await supabase
      .from('mindmaps')
      .insert({ 
        name, 
        description,
        user_id: user.id
      })
      .select()
      .single();

    console.log('Mindmap creation attempt:', { mindmap, mindmapError });

    if (mindmapError) {
      console.error('Mindmap creation error:', mindmapError);
      throw mindmapError;
    }

    // Then create all nodes for this mind map
    const nodesWithMindMapId = nodes.map(node => ({
      mindmap_id: mindmap.mindmap_id,
      content: node.id.toString(),
      x: node.x,
      y: node.y,
      z: node.z,
      node_type: node.isCenter ? 'concept' : 'note'
    }));

    console.log('Attempting to create nodes:', nodesWithMindMapId);

    const { data: mindmapNodes, error: nodesError } = await supabase
      .from('mindmap_nodes')
      .insert(nodesWithMindMapId)
      .select();

    console.log('Node creation result:', { mindmapNodes, nodesError });

    if (nodesError) {
      console.error('Node creation error:', nodesError);
      throw nodesError;
    }

    return { ...mindmap, nodes: mindmapNodes };
  } catch (error) {
    console.error('Complete error object:', error);
    throw error;
  }
}
