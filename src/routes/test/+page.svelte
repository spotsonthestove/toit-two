<script lang="ts">
  import ToitTorus from '$lib/components/ToitTorus.svelte';

  // Add any necessary imports or logic here

  // Add these variables for the ToitTorus component
  let progress = 33; // Example progress value
  let subtasks = [
    { name: 'Task 1', completed: true },
    { name: 'Task 2', completed: false },
    { name: 'Task 3', completed: false },
  ];

  function updateProgress() {
    const completedTasks = subtasks.filter(task => task.completed).length;
    progress = (completedTasks / subtasks.length) * 100;
  }

  function toggleTask(index: number) {
    subtasks[index].completed = !subtasks[index].completed;
    updateProgress();
  }
</script>

<h1>Test Page</h1>

<p>This is a test page to demonstrate routing in Svelte.</p>

<nav>
  <a href="/">Back to Home</a>
</nav>

<h2>Toit Torus Component Test</h2>

<ToitTorus {progress} {subtasks} />

<div class="task-list">
  {#each subtasks as task, i}
    <label>
      <input
        type="checkbox"
        bind:checked={task.completed}
        on:change={() => toggleTask(i)}
      />
      {task.name}
    </label>
  {/each}
</div>

<style>
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

  .task-list {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  label {
    margin: 5px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
  }
</style>