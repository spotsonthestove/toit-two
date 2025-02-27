<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import ToitTorus from '$lib/components/ToitTorus.svelte';
  import { user } from '$lib/stores/userStore';
  import { fade, fly } from 'svelte/transition';
  import { Button } from "$lib/components/ui/button";

  // Define types for our data structures
  interface ToitSession {
    session_id: number;
    name: string;
    created_at: string;
    status: string;
    user_id: string;
  }

  interface ToitTask {
    task_id: string;
    session_id: number;
    name: string;
    description?: string;
    duration_minutes: number;
    status: 'completed' | 'pending' | 'in_progress';
    created_at: string;
  }

  let sessions: ToitSession[] = [];
  let loading = true;
  let error: string | null = null;
  let selectedSession: ToitSession | null = null;
  let tasks: ToitTask[] = [];
  let tasksLoading = false;

  onMount(async () => {
    if ($user) {
      await fetchSessions();
    }
  });

  async function fetchSessions() {
    try {
      loading = true;
      const { data, error: fetchError } = await supabase
        .from('toit_sessions')
        .select('*')
        .eq('user_id', $user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      sessions = data || [];
    } catch (err) {
      console.error('Error fetching sessions:', err);
      error = 'Failed to load sessions. Please try again.';
    } finally {
      loading = false;
    }
  }

  async function fetchTasksForSession(sessionId: number) {
    if (!sessionId) return;
    
    try {
      tasksLoading = true;
      const { data, error: fetchError } = await supabase
        .from('toit_tasks')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      tasks = data || [];
    } catch (err) {
      console.error('Error fetching tasks:', err);
      error = 'Failed to load tasks. Please try again.';
    } finally {
      tasksLoading = false;
    }
  }

  async function selectSession(session: ToitSession) {
    selectedSession = session;
    await fetchTasksForSession(session.session_id);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  }

  function calculateTotalDuration(tasksList: ToitTask[]) {
    return tasksList.reduce((total: number, task: ToitTask) => total + (task.duration_minutes || 0), 0);
  }

  function calculateCompletionPercentage(tasksList: ToitTask[]) {
    if (tasksList.length === 0) return 0;
    const completedTasks = tasksList.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasksList.length) * 100);
  }
</script>

<svelte:head>
  <title>Toit Sessions</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8" in:fade={{ duration: 300, delay: 100 }}>
    <h1 class="text-3xl font-bold forestry-gradient-text mb-2">Toit Sessions</h1>
    <p class="text-shadow-moss">Manage your focused work sessions and track your progress.</p>
  </div>

  {#if loading}
    <div class="neumorph-panel p-8 text-center" in:fade>
      <div class="animate-pulse flex flex-col items-center">
        <div class="h-12 w-12 rounded-full bg-neugray-200 mb-4"></div>
        <div class="h-4 w-48 bg-neugray-200 rounded mb-2"></div>
        <div class="h-3 w-32 bg-neugray-200 rounded"></div>
      </div>
    </div>
  {:else if error}
    <div class="glass-panel p-6 text-red-500 text-center" in:fade>
      <p>{error}</p>
      <Button class="mt-4" on:click={fetchSessions}>Try Again</Button>
    </div>
  {:else if sessions.length === 0}
    <div class="glass-panel p-8 text-center" in:fade>
      <h2 class="text-xl font-semibold mb-4">No Sessions Found</h2>
      <p class="text-shadow-moss mb-6">You haven't created any Toit sessions yet.</p>
      <Button>Create Your First Session</Button>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sessions List -->
      <div class="lg:col-span-1">
        <div class="neumorph-panel p-4 mb-4" in:fade={{ duration: 300 }}>
          <h2 class="text-xl font-semibold mb-4 text-shadow-moss">Your Sessions</h2>
          <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {#each sessions as session, i}
              <div 
                class="neumorph-panel-sm p-3 cursor-pointer transition-all duration-200 hover:-translate-y-1"
                class:shadow-neumorph-pressed={selectedSession?.session_id === session.session_id}
                on:click={() => selectSession(session)}
                in:fly={{ y: 20, delay: i * 50, duration: 300 }}
              >
                <div class="font-medium text-shadow-moss">{session.name}</div>
                <div class="text-xs text-shadow-moss mt-1">{formatDate(session.created_at)}</div>
              </div>
            {/each}
          </div>
        </div>
        <div class="text-center">
          <Button variant="secondary" class="bg-green-tone-ink hover:bg-shadow-moss text-white">
            Create New Session
          </Button>
        </div>
      </div>

      <!-- Session Details and Visualization -->
      <div class="lg:col-span-2">
        {#if selectedSession}
          <div class="glass-panel p-6" in:fade={{ duration: 300 }}>
            <div class="flex justify-between items-start mb-6">
              <div>
                <h2 class="text-2xl font-bold text-shadow-moss">{selectedSession.name}</h2>
                <p class="text-shadow-moss text-sm">{formatDate(selectedSession.created_at)}</p>
              </div>
              <div class="flex gap-2">
                <Button variant="ghost" class="text-shadow-moss hover:text-green-tone-ink">
                  Edit
                </Button>
                <Button variant="ghost" class="text-red-500 hover:text-red-600">
                  Delete
                </Button>
              </div>
            </div>

            {#if tasksLoading}
              <div class="animate-pulse flex flex-col items-center p-8">
                <div class="h-32 w-32 rounded-full bg-neugray-200 mb-4"></div>
                <div class="h-4 w-48 bg-neugray-200 rounded mb-2"></div>
              </div>
            {:else if tasks.length === 0}
              <div class="text-center p-8">
                <p class="text-shadow-moss mb-4">No tasks in this session yet.</p>
                <Button>Add Tasks</Button>
              </div>
            {:else}
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="neumorph-panel-sm p-4 text-center">
                  <div class="text-xs text-shadow-moss mb-1">Total Tasks</div>
                  <div class="text-2xl font-bold text-shadow-moss">{tasks.length}</div>
                </div>
                <div class="neumorph-panel-sm p-4 text-center">
                  <div class="text-xs text-shadow-moss mb-1">Total Duration</div>
                  <div class="text-2xl font-bold text-shadow-moss">{calculateTotalDuration(tasks)} min</div>
                </div>
                <div class="neumorph-panel-sm p-4 text-center">
                  <div class="text-xs text-shadow-moss mb-1">Completion</div>
                  <div class="text-2xl font-bold text-green-tone-ink">{calculateCompletionPercentage(tasks)}%</div>
                </div>
              </div>

              <ToitTorus tasks={tasks} sessionId={selectedSession.session_id} />
            {/if}
          </div>
        {:else}
          <div class="neumorph-panel p-8 text-center flex flex-col items-center justify-center min-h-[400px]" in:fade>
            <div class="w-24 h-24 rounded-full bg-speed-of-light shadow-neumorph flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-tone-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold mb-2 text-shadow-moss">Select a Session</h2>
            <p class="text-shadow-moss max-w-md">Choose a session from the list to view its details and progress visualization.</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    @apply bg-gray-50;
  }
</style>