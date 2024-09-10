<script lang="ts">
  export let progress: number = 0; // 0 to 100
  export let subtasks: { name: string; completed: boolean }[] = [
    { name: 'Task 1', completed: false },
    { name: 'Task 2', completed: false },
    { name: 'Task 3', completed: false },
  ];

  $: circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  $: strokeDashoffset = circumference - (progress / 100) * circumference;
</script>

<div class="toit-torus">
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle class="torus-bg" cx="50" cy="50" r="45" />
    <circle
      class="torus-progress"
      cx="50"
      cy="50"
      r="45"
      style="stroke-dashoffset: {strokeDashoffset}px;"
    />
    {#each subtasks as task, i}
      <circle
        class="subtask {task.completed ? 'completed' : ''}"
        cx="50"
        cy="50"
        r="35"
        transform="rotate({120 * i - 90}, 50, 50)"
      />
    {/each}
  </svg>
</div>

<style>
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
    stroke: #e0e0e0;
    stroke-width: 5;
  }

  .torus-progress {
    fill: none;
    stroke: #4caf50;
    stroke-width: 5;
    stroke-linecap: round;
    stroke-dasharray: 282.7433388230814;
    transition: stroke-dashoffset 0.3s ease;
  }

  .subtask {
    fill: #ffd54f;
    r: 5;
    transition: fill 0.3s ease;
  }

  .subtask.completed {
    fill: #4caf50;
  }
</style>