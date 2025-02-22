import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null;
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(key, JSON.stringify(value));
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
      }
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Add debug function to check session
export async function checkSession() {
  const session = await supabase.auth.getSession();
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

export async function updateNode(nodeData: {
    id: number,
    title: string,
    description: string,
    nodeType: 'concept' | 'note',
    status?: 'pending' | 'in_progress' | 'completed',
    priority?: number,
    estimatedDuration?: number,
    tags?: string[],
    color?: string
}) {
    const { data, error } = await supabase
        .from('mindmap_nodes')
        .update({
            content: nodeData.title,
            title: nodeData.title,
            description: nodeData.description,
            node_type: nodeData.nodeType,
            status: nodeData.status,
            priority: nodeData.priority,
            estimated_duration_minutes: nodeData.estimatedDuration,
            tags: nodeData.tags,
            color: nodeData.color
        })
        .eq('node_id', nodeData.id)
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
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!userData.user) throw new Error('User not authenticated');

        // First create the mind map
        const { data: mindmap, error: mindmapError } = await supabase
            .from('mindmaps')
            .insert({ 
                name, 
                description,
                user_id: userData.user.id
            })
            .select()
            .single();

        if (mindmapError) throw mindmapError;

        // Find the center node
        const centerNode = nodes.find(node => node.nodeType === 'concept' && !node.parentId);
        if (!centerNode) throw new Error('No center node found');

        // First insert the center node
        const { data: createdCenterNode, error: centerNodeError } = await supabase
            .from('mindmap_nodes')
            .insert({
                mindmap_id: mindmap.mindmap_id,
                content: centerNode.title || 'Central Idea',
                title: centerNode.title || 'Central Idea',
                description: centerNode.description || '',
                x: centerNode.x || 0,
                y: centerNode.y || 0,
                z: centerNode.z || 0,
                node_type: 'concept',
                parent_node_id: null
            })
            .select()
            .single();

        if (centerNodeError) throw centerNodeError;

        // Get all non-center nodes
        const childNodes = nodes.filter(node => node.nodeType !== 'concept' || node.parentId !== null);

        // Create child nodes one by one to maintain proper relationships
        const createdNodes = [];
        const nodeMap = new Map(); // Track created nodes by their original IDs

        // First, create all nodes without parent relationships
        for (const node of childNodes) {
            const { data: createdNode, error: nodeError } = await supabase
                .from('mindmap_nodes')
                .insert({
                    mindmap_id: mindmap.mindmap_id,
                    content: node.title || 'New Node',
                    title: node.title || 'New Node',
                    description: node.description || '',
                    x: node.x || 0,
                    y: node.y || 0,
                    z: node.z || 0,
                    node_type: 'note',
                    parent_node_id: node.parentId === centerNode.id ? 
                        createdCenterNode.node_id : null // Temporarily set null for non-center parents
                })
                .select()
                .single();

            if (nodeError) throw nodeError;
            nodeMap.set(node.id, createdNode);
            createdNodes.push(createdNode);
        }

        // Update parent relationships for nodes with non-center parents
        for (const node of childNodes) {
            if (node.parentId && node.parentId !== centerNode.id) {
                const createdNode = nodeMap.get(node.id);
                const parentNode = nodeMap.get(node.parentId);
                
                if (createdNode && parentNode) {
                    const { error: updateError } = await supabase
                        .from('mindmap_nodes')
                        .update({ parent_node_id: parentNode.node_id })
                        .eq('node_id', createdNode.node_id);

                    if (updateError) throw updateError;
                }
            }
        }

        return {
            ...mindmap,
            nodes: [createdCenterNode, ...createdNodes]
        };
    } catch (error) {
        console.error('Error in createMindMap:', error);
        throw error;
    }
}

// Add this new function
export async function updateMindMap(mindmapId: number, name: string, description: string, nodes: Node[]) {
    try {
        // 1. Update mindmap details
        const { data: mindmap, error: mindmapError } = await supabase
            .from('mindmaps')
            .update({ name, description })
            .eq('mindmap_id', mindmapId)
            .select()
            .single();

        if (mindmapError) throw mindmapError;

        // 2. Get existing nodes from database
        const { data: existingNodes, error: fetchError } = await supabase
            .from('mindmap_nodes')
            .select('node_id, content, title, x, y, z, node_type, parent_node_id')
            .eq('mindmap_id', mindmapId);

        if (fetchError) throw fetchError;

        // 3. Categorize nodes for different operations
        const existingNodeIds = new Set(existingNodes.map(n => n.node_id));
        const updatedNodes = nodes.filter(n => existingNodeIds.has(n.id));
        const newNodes = nodes.filter(n => !existingNodeIds.has(n.id));
        const deletedNodeIds = existingNodes
            .filter(n => !nodes.some(node => node.id === n.node_id))
            .map(n => n.node_id);

        // 4. Perform batch operations
        const operations = [];

        // Delete nodes that no longer exist
        if (deletedNodeIds.length > 0) {
            operations.push(
                supabase
                    .from('mindmap_nodes')
                    .delete()
                    .in('node_id', deletedNodeIds)
            );
        }

        // Update existing nodes
        for (const node of updatedNodes) {
            operations.push(
                supabase
                    .from('mindmap_nodes')
                    .update({
                        content: node.title,
                        title: node.title,
                        description: node.description,
                        x: node.x,
                        y: node.y,
                        z: node.z,
                        node_type: node.nodeType,
                        parent_node_id: node.parentId
                    })
                    .eq('node_id', node.id)
            );
        }

        // Insert new nodes
        if (newNodes.length > 0) {
            operations.push(
                supabase
                    .from('mindmap_nodes')
                    .insert(
                        newNodes.map(node => ({
                            mindmap_id: mindmapId,
                            content: node.title,
                            title: node.title,
                            description: node.description,
                            x: node.x,
                            y: node.y,
                            z: node.z,
                            node_type: node.nodeType,
                            parent_node_id: node.parentId
                        }))
                    )
            );
        }

        // Execute all operations
        await Promise.all(operations);

        // 5. Fetch and return updated state
        const { data: updatedMindmapNodes, error: finalError } = await supabase
            .from('mindmap_nodes')
            .select('*')
            .eq('mindmap_id', mindmapId);

        if (finalError) throw finalError;

        return {
            ...mindmap,
            nodes: updatedMindmapNodes
        };
    } catch (error) {
        console.error('Error updating mind map:', error);
        throw error;
    }
}

// Add this function to initialize a new mindmap with a root node and two children
export async function initializeNewMindmap(mindmapId: number) {
    try {
        // Create root node
        const { data: rootNode, error: rootError } = await supabase
            .from('mindmap_nodes')
            .insert({
                mindmap_id: mindmapId,
                parent_node_id: null,
                content: 'Central Idea',
                title: 'Main Concept',
                x: 0,
                y: 0,
                z: 0,
                node_type: 'concept'
            })
            .select()
            .single();

        if (rootError) throw rootError;

        // Create two initial child nodes
        if (rootNode) {
            const { data: childNodes, error: childError } = await supabase
                .from('mindmap_nodes')
                .insert([
                    {
                        mindmap_id: mindmapId,
                        parent_node_id: rootNode.node_id,
                        content: 'Child 1',
                        title: 'Child 1',
                        x: -100,
                        y: -100,
                        z: 0,
                        node_type: 'concept'
                    },
                    {
                        mindmap_id: mindmapId,
                        parent_node_id: rootNode.node_id,
                        content: 'Child 2',
                        title: 'Child 2',
                        x: 100,
                        y: -100,
                        z: 0,
                        node_type: 'concept'
                    }
                ])
                .select();

            if (childError) throw childError;
            return { rootNode, childNodes };
        }
    } catch (error) {
        console.error('Error initializing mindmap:', error);
        throw error;
    }
}
