<script lang="ts">
  export let nodes: Array<{ id: number; x: number; y: number; z: number }> = [];
</script>

<div class="node-table">
  <h3>Node Coordinates</h3>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>X</th>
        <th>Y</th>
        <th>Z</th>
      </tr>
    </thead>
    <tbody>
      {#each nodes as node}
        <tr>
          <td>{node.id}</td>
          <td>{node.x.toFixed(2)}</td>
          <td>{node.y.toFixed(2)}</td>
          <td>{node.z.toFixed(2)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .node-table {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 10px;
    margin-top: 10px;
  }

  h3 {
    color: #fff;
    margin-bottom: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 5px;
    text-align: right;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  th {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
