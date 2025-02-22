<script lang="ts">
  export let tasks: any[] = [];
  export let sessionId: number | undefined = undefined;
  export let isPreview: boolean = false;

  import { supabase } from '$lib/supabaseClient';

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
</script>

<div class="toit-container">
  <div class="toit-torus">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle class="torus-bg" cx="50" cy="50" r="45" />
      
      <!-- Task segments -->
      {#each tasks as task, i}
        {@const segmentAngle = 360 / tasks.length}
        {@const startAngle = i * segmentAngle}
        {@const endAngle = startAngle + segmentAngle}
        <path
          class="task-segment {task.status === 'completed' ? 'completed' : ''}"
          d={describeArc(50, 50, 45, startAngle, endAngle)}
          on:click={() => toggleTaskStatus(task)}
        />
      {/each}
      
      <!-- Progress indicator -->
      <circle
        class="torus-progress"
        cx="50"
        cy="50"
        r="45"
        style="stroke-dashoffset: {strokeDashoffset}px;"
      />
    </svg>
  </div>

  {#if tasks.length === 0}
    <div class="no-tasks">
      {#if isPreview}
        Select tasks to preview
      {:else}
        No tasks in this session
      {/if}
    </div>
  {:else}
    <div class="tasks-table">
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {#each tasks as task}
            <tr>
              <td>{task.name}</td>
              <td class="status {task.status}">{task.status}</td>
              <td>{task.duration_minutes}min</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .toit-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 1rem;
  }

  .toit-torus {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  svg {
    width: 100%;
    height: auto;
  }

  .torus-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 5;
  }

  .task-segment {
    fill: none;
    stroke: #ffd54f;
    stroke-width: 8;
    cursor: pointer;
    transition: stroke 0.3s ease;
  }

  .task-segment:hover {
    stroke-width: 10;
  }

  .task-segment.completed {
    stroke: #4caf50;
  }

  .torus-progress {
    fill: none;
    stroke: rgba(76, 175, 80, 0.3);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: 282.7433388230814;
    transition: stroke-dashoffset 0.3s ease;
    pointer-events: none;
  }

  .no-tasks {
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.2rem;
    text-align: center;
  }

  .tasks-table {
    width: 100%;
    max-width: 600px;
    margin-top: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 0.75rem;
    text-align: left;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  th {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
  }

  .status {
    text-transform: capitalize;
  }

  .status.completed {
    color: #4caf50;
  }

  .status.pending {
    color: #ffd54f;
  }

  .status.in_progress {
    color: #2196f3;
  }
</style>