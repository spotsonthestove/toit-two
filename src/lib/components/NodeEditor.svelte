<script lang="ts">
  import { selectedNode, nodes } from '$lib/stores/mindMapStore';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";

  function handleSave() {
    if ($selectedNode) {
      nodes.update(currentNodes => 
        currentNodes.map(node => 
          node.id === $selectedNode.id ? { ...$selectedNode } : node
        )
      );
      selectedNode.set(null);
    }
  }

  function handleClose() {
    selectedNode.set(null);
  }
</script>

{#if $selectedNode}
  <div class="fixed right-4 top-4 w-80 p-4 bg-white shadow-lg rounded-lg">
    <h3 class="text-lg font-semibold mb-4">Edit Node</h3>
    <form on:submit|preventDefault={handleSave} class="space-y-4">
      <div>
        <Label for="nodeTitle">Title</Label>
        <Input id="nodeTitle" bind:value={$selectedNode.title} required />
      </div>
      <div>
        <Label for="nodeDescription">Description</Label>
        <Textarea id="nodeDescription" bind:value={$selectedNode.description} />
      </div>
      <div>
        <Label for="nodeType">Node Type</Label>
        <Select bind:value={$selectedNode.nodeType}>
          <SelectTrigger>
            <SelectValue placeholder="Select node type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="concept">Concept</SelectItem>
            <SelectItem value="note">Note</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex justify-end space-x-2">
        <Button type="button" variant="outline" on:click={handleClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  </div>
{/if}

