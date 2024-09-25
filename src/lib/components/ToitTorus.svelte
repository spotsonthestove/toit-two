<script lang="ts">
  let subtasks: { name: string; completed: boolean }[] = [];
  let newTaskName = '';

  // Use a reactive declaration for progress
  $: progress = subtasks.length > 0
    ? (subtasks.filter(task => task.completed).length / subtasks.length) * 100
    : 0;

  $: circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  $: strokeDashoffset = circumference - (progress / 100) * circumference;

  function toggleTask(index: number) {
    subtasks = subtasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    );
  }

  function addTask() {
    if (newTaskName.trim()) {
      subtasks = [...subtasks, { name: newTaskName.trim(), completed: false }];
      newTaskName = '';
    }
  }

  function deleteTask(index: number) {
    subtasks = subtasks.filter((_, i) => i !== index);
  }
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

<div class="task-form">
  <form on:submit|preventDefault={addTask}>
    <input
      type="text"
      bind:value={newTaskName}
      placeholder="Enter new task"
    />
    <button type="submit">Add Task</button>
  </form>
</div>

<div class="task-table">
  <table>
    <thead>
      <tr>
        <th>Task</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each subtasks as task, i}
        <tr>
          <td>{task.name}</td>
          <td>
            <input
              type="checkbox"
              checked={task.completed}
              on:change={() => toggleTask(i)}
            />
          </td>
          <td>
            <button on:click={() => deleteTask(i)}>Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
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

  .task-form {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .task-form form {
    display: flex;
    gap: 10px;
  }

  .task-form input {
    padding: 5px;
    font-size: 16px;
  }

  .task-form button {
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }

  .task-table {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    max-width: 500px;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  td button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
</style>