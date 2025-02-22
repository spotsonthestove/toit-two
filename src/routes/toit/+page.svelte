<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import ToitTorus from '$lib/components/ToitTorus.svelte';
  import type { PageData } from './$types';
  import OrbComponent from '$lib/components/trying_stuff.svelte';

  export let data: PageData;

  let mindmaps: any[] = [];
  let selectedMindmap: string | null = null;
  let mindmapNodes: any[] = [];
  let selectedNodes: string[] = [];
  let sessionName: string = '';
  let loading = false;
  let error: string | null = null;
  let toitSessions: any[] = [];
  let currentSession: any = null;
  let currentTasks: any[] = [];

  async function loadToitSessions() {
    try {
      const { data: sessions, error: sessionsError } = await supabase
        .from('toit_sessions')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;
      toitSessions = sessions;
      
      // Load the most recent session if it exists
      if (sessions.length > 0) {
        await loadSessionTasks(sessions[0].session_id);
      }
    } catch (e) {
      error = 'Failed to load Toit sessions';
      console.error('Error loading sessions:', e);
    }
  }

  async function loadSessionTasks(sessionId: number) {
    try {
      const { data: tasks, error: tasksError } = await supabase
        .from('toit_tasks')
        .select(`
          *,
          mindmap_nodes (
            title,
            content
          )
        `)
        .eq('session_id', sessionId);

      if (tasksError) throw tasksError;
      currentSession = toitSessions.find(s => s.session_id === sessionId);
      currentTasks = tasks;
    } catch (e) {
      error = 'Failed to load session tasks';
      console.error('Error loading tasks:', e);
    }
  }

  onMount(async () => {
    try {
      // Load mindmaps for the current user
      const { data: mindmapsData, error: mindmapsError } = await supabase
        .from('mindmaps')
        .select('*')
        .eq('user_id', data.user.id);

      if (mindmapsError) throw mindmapsError;
      mindmaps = mindmapsData;

      // Load Toit sessions
      await loadToitSessions();
    } catch (e) {
      error = 'Failed to load mindmaps';
      console.error('Error loading mindmaps:', e);
    }
  });

  async function handleMindmapSelect() {
    if (!selectedMindmap) return;
    
    try {
      const { data: nodesData, error: nodesError } = await supabase
        .from('mindmap_nodes')
        .select('*')
        .eq('mindmap_id', selectedMindmap)
        .eq('node_type', 'note'); // Only get note nodes (subtasks)

      if (nodesError) throw nodesError;
      mindmapNodes = nodesData;
    } catch (e) {
      error = 'Failed to load mindmap nodes';
      console.error('Error loading nodes:', e);
    }
  }

  async function createToitSession() {
    if (!sessionName || selectedNodes.length === 0) return;
    
    loading = true;
    error = null;

    try {
      // Get the current session to ensure we have the user's ID
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error('No active session');

      // Create a new toit session with user_id
      const { data: sessionData, error: sessionError2 } = await supabase
        .from('toit_sessions')
        .insert([{
          name: sessionName,
          start_time: new Date().toISOString(),
          status: 'planned',
          user_id: session.user.id  // Use the session user ID
        }])
        .select()
        .single();

      if (sessionError2) throw sessionError2;

      // Create toit tasks for each selected node
      const tasks = selectedNodes.map((nodeId, index) => ({
        session_id: sessionData.session_id,
        mindmap_node_id: nodeId,
        name: mindmapNodes.find(node => node.node_id === nodeId)?.title || 'Untitled Task',
        description: mindmapNodes.find(node => node.node_id === nodeId)?.content || '',
        duration_minutes: 25,
        position_in_circle: index,
        status: 'pending'
      }));

      const { error: tasksError } = await supabase
        .from('toit_tasks')
        .insert(tasks);

      if (tasksError) throw tasksError;

      // Reset form
      sessionName = '';
      selectedNodes = [];
      selectedMindmap = null;
      mindmapNodes = [];

      // Reload sessions to show the new one
      await loadToitSessions();

    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to create Toit session';
      console.error('Error creating Toit session:', e);
    } finally {
      loading = false;
    }
  }
</script>

<div class="container">
  <h1>Create Toit Session</h1>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <form on:submit|preventDefault={createToitSession}>
    <div class="form-group">
      <label for="sessionName">Session Name</label>
      <input 
        type="text" 
        id="sessionName" 
        bind:value={sessionName} 
        required
        placeholder="Enter session name"
      />
    </div>

    <div class="form-group">
      <label for="mindmap">Select Mindmap</label>
      <select 
        id="mindmap" 
        bind:value={selectedMindmap} 
        on:change={handleMindmapSelect}
      >
        <option value="">Choose a mindmap...</option>
        {#each mindmaps as mindmap}
          <option value={mindmap.mindmap_id}>{mindmap.name}</option>
        {/each}
      </select>
    </div>

    {#if mindmapNodes.length > 0}
      <div class="form-group">
        <label>Select Tasks</label>
        {#each mindmapNodes as node}
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              value={node.node_id} 
              bind:group={selectedNodes}
            />
            {node.title || node.content}
          </label>
        {/each}
      </div>
    {/if}

    <button type="submit" disabled={loading || !sessionName || selectedNodes.length === 0}>
      {loading ? 'Creating...' : 'Create Toit Session'}
    </button>
  </form>

  {#if toitSessions.length > 0}
    <div class="sessions">
      <h2>Your Toit Sessions</h2>
      <div class="sessions-list">
        {#each toitSessions as session}
          <div 
            class="session-card" 
            class:active={currentSession?.session_id === session.session_id}
            on:click={() => loadSessionTasks(session.session_id)}
          >
            <h3>{session.name}</h3>
            <div class="session-meta">
              <span class="status">{session.status}</span>
              <span class="date">{new Date(session.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        {/each}
      </div>

      {#if currentSession && currentTasks.length > 0}
        <div class="toit-view">
          <h2>{currentSession.name}</h2>
          <div class="toit-container">
            <ToitTorus 
              tasks={currentTasks}
              sessionId={currentSession.session_id}
            />
          </div>
          
          <!-- Task management interface moved to side panel -->
          <div class="task-panel">
            <h3>Task Details</h3>
            <div class="tasks-list">
              {#each currentTasks as task}
                <div class="task-card">
                  <h4>{task.name}</h4>
                  <div class="task-meta">
                    <span class="duration">{task.duration_minutes}min</span>
                    <span class="status">{task.status}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}

  {#if selectedNodes.length > 0}
    <div class="preview">
      <h2>Selected Tasks Preview</h2>
      <div class="toit-container">
        <ToitTorus 
          tasks={selectedNodes.map((nodeId, index) => ({
            task_id: `preview-${index}`,
            name: mindmapNodes.find(node => node.node_id === nodeId)?.title || 'Untitled Task',
            description: mindmapNodes.find(node => node.node_id === nodeId)?.content || '',
            duration_minutes: 25,
            position_in_circle: index,
            status: 'pending'
          }))}
          isPreview={true}
        />
      </div>
    </div>
  {/if}
</div>

<h2>Glowing Orb Test</h2>
<div class="orb-container">
  <OrbComponent size="200px" primaryColor="#FF6B00" secondaryColor="#FFB800" />
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #fff;
  }

  input[type="text"],
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .checkbox-label input[type="checkbox"] {
    margin: 0;
  }

  button {
    background-color: #4CAF50;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .error {
    color: #ff4444;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 4px;
    background-color: rgba(255, 68, 68, 0.1);
  }

  .preview {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  h1 {
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
  }

  p {
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
  }

  nav {
    text-align: center;
  }

  nav a {
    color: #fff;
    text-decoration: none;
    padding: 10px 20px;
    background-color: #4CAF50;
    border-radius: 5px;
    transition: background-color 0.3s;
  }

  nav a:hover {
    background-color: #45a049;
  }

  h2 {
    text-align: center;
    color: #333;
    margin-top: 2rem;
  }

  .orb-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;
  }

  .sessions {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #ccc;
  }

  .sessions-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }

  .session-card {
    background: #fff;
    padding: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .session-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .session-card.active {
    border: 2px solid #4CAF50;
  }

  .session-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #666;
  }

  .current-session {
    margin-top: 2rem;
  }

  .tasks-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }

  .task-card {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
  }

  .task-card h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .task-card p {
    margin: 0 0 1rem 0;
    color: #666;
    font-size: 0.875rem;
  }

  .task-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #888;
  }

  h2, h3 {
    color: #fff;
    margin-bottom: 1rem;
  }

  .toit-view {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2rem;
    margin-top: 2rem;
  }

  .toit-container {
    aspect-ratio: 1;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .task-panel {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 8px;
    max-height: 600px;
    overflow-y: auto;
  }

  .task-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    transition: all 0.2s ease;
  }

  .task-card:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .preview .toit-container {
    max-width: 400px;
    margin: 2rem auto;
  }
</style>