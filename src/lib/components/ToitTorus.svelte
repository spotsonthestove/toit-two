<script lang="ts">
  export let tasks: any[] = [];
  export let sessionId: number | undefined = undefined;
  export let isPreview: boolean = false;

  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';
  import { fade, scale, fly } from 'svelte/transition';

  // Calculate progress based on completed tasks
  $: progress = tasks.length > 0
    ? (tasks.filter(task => task.status === 'completed').length / tasks.length) * 100
    : 0;

  // Calculate the circumference and stroke offset
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  $: strokeDashoffset = circumference - (progress / 100) * circumference;

  // Function to calculate segment path
  function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  }

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  // Calculate segment angles based on task duration
  function calculateSegmentAngles() {
    if (tasks.length === 0) return [];
    
    // Get total duration
    const totalDuration = tasks.reduce((sum, task) => sum + (task.duration_minutes || 25), 0);
    
    // Calculate angles
    let startAngle = 0;
    return tasks.map(task => {
      const duration = task.duration_minutes || 25;
      const segmentAngle = (duration / totalDuration) * 360;
      const segment = {
        startAngle,
        endAngle: startAngle + segmentAngle,
        task
      };
      startAngle += segmentAngle;
      return segment;
    });
  }

  $: segments = calculateSegmentAngles();

  // Function to toggle task status
  async function toggleTaskStatus(task: any) {
    if (!sessionId || isPreview) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    try {
      const { error } = await supabase
        .from('toit_tasks')
        .update({ status: newStatus })
        .eq('task_id', task.task_id);

      if (error) throw error;
      
      // Update local state
      task.status = newStatus;
      tasks = [...tasks]; // Trigger reactivity
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  }

  // Get status color class based on task status
  function getStatusColor(status: string) {
    switch(status) {
      case 'completed': return 'bg-gradient-completed';
      case 'in_progress': return 'bg-gradient-progress';
      default: return 'bg-gradient-pending';
    }
  }

  // Get status text color based on task status
  function getStatusTextColor(status: string) {
    switch(status) {
      case 'completed': return 'text-green-tone-ink';
      case 'in_progress': return 'text-walnut-shell';
      default: return 'text-good-as-gold';
    }
  }

  // Animation for task completion
  let animatingTaskId: string | null = null;
  let showCelebration = false;
  
  function handleTaskClick(task: any) {
    if (!sessionId || isPreview) return;
    
    animatingTaskId = task.task_id;
    setTimeout(() => {
      toggleTaskStatus(task);
      
      // If this completes the last task, show celebration
      if (task.status !== 'completed' && 
          tasks.filter(t => t.status !== 'completed').length === 1) {
        setTimeout(() => {
          showCelebration = true;
          setTimeout(() => {
            showCelebration = false;
          }, 3000);
        }, 300);
      }
      
      setTimeout(() => {
        animatingTaskId = null;
      }, 300);
    }, 300);
  }
</script>

<div class="w-full flex flex-col items-center gap-8 p-4">
  <div class="w-full max-w-xs mx-auto relative">
    <div class="relative w-full pb-[100%]">
      <!-- Neumorphic background circle -->
      <div class="absolute inset-0 rounded-full shadow-neumorph bg-speed-of-light"></div>
      
      <!-- SVG for task segments and progress -->
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="absolute inset-0 w-full h-full z-10">
        <!-- Task segments -->
        {#each segments as segment, i}
          <path
            class="fill-none stroke-[8] cursor-pointer transition-all duration-300 ease-in-out hover:stroke-[10] hover:brightness-110"
            class:stroke-gradient-completed={segment.task.status === 'completed'}
            class:stroke-gradient-pending={segment.task.status === 'pending'}
            class:stroke-gradient-progress={segment.task.status === 'in_progress'}
            d={describeArc(50, 50, 45, segment.startAngle, segment.endAngle)}
            on:click={() => handleTaskClick(segment.task)}
            in:fade={{ delay: i * 100, duration: 500 }}
          >
            <title>{segment.task.name} ({segment.task.duration_minutes}min)</title>
          </path>
          
          <!-- Enhanced segment labels -->
          {#if segment.endAngle - segment.startAngle > 30}
            <!-- Calculate label position -->
            {#each [{ 
              midAngle: (segment.startAngle + segment.endAngle) / 2,
              labelPos: polarToCartesian(50, 50, 35, (segment.startAngle + segment.endAngle) / 2)
            }] as labelData}
              <g 
                class="pointer-events-none"
                in:fade={{ delay: i * 100 + 200, duration: 300 }}
              >
                <!-- Small dot at the segment -->
                <circle 
                  cx={labelData.labelPos.x} 
                  cy={labelData.labelPos.y} 
                  r="1.5" 
                  class="fill-white"
                />
                
                <!-- Task name label -->
                <text 
                  x={labelData.labelPos.x} 
                  y={labelData.labelPos.y} 
                  text-anchor="middle" 
                  dominant-baseline="middle" 
                  class="text-[3px] fill-white font-medium"
                  transform={`rotate(${labelData.midAngle}, ${labelData.labelPos.x}, ${labelData.labelPos.y})`}
                >
                  {segment.task.name.length > 10 ? segment.task.name.substring(0, 10) + '...' : segment.task.name}
                </text>
              </g>
            {/each}
          {/if}
        {/each}
        
        <!-- Progress indicator with animation -->
        <circle
          class="fill-none stroke-green-tone-ink/20 stroke-[2] stroke-linecap-round pointer-events-none transition-all duration-1000 ease-in-out"
          cx="50"
          cy="50"
          r="45"
          style="stroke-dasharray: {circumference}px; stroke-dashoffset: {strokeDashoffset}px;"
        />
        
        <!-- Animated progress glow effect -->
        <circle
          class="fill-none stroke-green-tone-ink/10 stroke-[4] stroke-linecap-round pointer-events-none blur-[2px] transition-all duration-1000 ease-in-out"
          cx="50"
          cy="50"
          r="45"
          style="stroke-dasharray: {circumference}px; stroke-dashoffset: {strokeDashoffset}px;"
        />
      </svg>
      
      <!-- Center content -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full flex flex-col justify-center items-center bg-speed-of-light/70 backdrop-blur-md shadow-glass z-20">
        <div class="text-2xl font-bold text-shadow-moss transition-all duration-500">{Math.round(progress)}%</div>
        <div class="text-xs text-shadow-moss">Complete</div>
        
        <!-- Celebration animation when all tasks are completed -->
        {#if showCelebration}
          <div class="absolute inset-0 flex items-center justify-center" in:scale={{ duration: 300, start: 0.5 }} out:fade>
            <div class="text-3xl">🎉</div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  {#if tasks.length === 0}
    <div class="w-full max-w-xl" in:fade={{ duration: 300 }}>
      <div class="glass-panel p-4 text-center text-shadow-moss">
        {#if isPreview}
          Select tasks to preview
        {:else}
          No tasks in this session
        {/if}
      </div>
    </div>
  {:else}
    <div class="w-full max-w-xl flex flex-col gap-3">
      {#each tasks as task, i}
        <div 
          class="neumorph-panel-sm transition-all duration-200 ease-in-out hover-lift overflow-hidden"
          class:border-l-4={task.status === 'completed'}
          class:border-green-tone-ink={task.status === 'completed'}
          in:fly={{ delay: i * 50, duration: 300, y: 20 }}
          class:shadow-neumorph-pressed={animatingTaskId === task.task_id}
        >
          <div class="p-4">
            <div class="flex justify-between items-center mb-2">
              <div class="font-semibold text-shadow-moss">{task.name}</div>
              <div class="text-xs text-shadow-moss bg-neugray-200/30 px-2 py-1 rounded-full">
                {task.duration_minutes}min
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full {getStatusColor(task.status)}"></div>
              <div class="text-xs capitalize {getStatusTextColor(task.status)}">
                {task.status.replace('_', ' ')}
              </div>
              <button 
                class="ml-auto text-xs py-1 px-2 rounded bg-white shadow-neumorph-sm hover:shadow-neumorph-pressed active:shadow-neumorph-pressed text-shadow-moss transition-all duration-200"
                on:click={() => handleTaskClick(task)}
                disabled={isPreview}
              >
                {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Custom styles for SVG gradients */
  :global(.stroke-gradient-completed) {
    stroke: url(#gradientCompleted);
  }
  
  :global(.stroke-gradient-pending) {
    stroke: url(#gradientPending);
  }
  
  :global(.stroke-gradient-progress) {
    stroke: url(#gradientInProgress);
  }
</style>

<svg width="0" height="0" class="absolute">
  <!-- Gradient definitions for task segments -->
  <defs>
    <linearGradient id="gradientCompleted" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#47553C" />
      <stop offset="100%" stop-color="#2C3830" />
    </linearGradient>
    <linearGradient id="gradientPending" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D3BA75" />
      <stop offset="100%" stop-color="#AA8344" />
    </linearGradient>
    <linearGradient id="gradientInProgress" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#AA8344" />
      <stop offset="100%" stop-color="#D3BA75" />
    </linearGradient>
  </defs>
</svg>