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
  <div class="fixed right-4 top-4 w-80 glass-panel transition-all duration-300 z-50">
    <h3 class="text-lg font-semibold mb-4 text-shadow-moss">Edit Node</h3>
    <form on:submit|preventDefault={handleSave} class="space-y-4">
      <div>
        <Label for="nodeTitle" class="text-shadow-moss">Title</Label>
        <Input id="nodeTitle" bind:value={$selectedNode.title} required class="input-field" />
      </div>
      <div>
        <Label for="nodeDescription" class="text-shadow-moss">Description</Label>
        <Textarea id="nodeDescription" bind:value={$selectedNode.description} class="input-field" />
      </div>
      <div>
        <Label for="nodeType" class="text-shadow-moss">Node Type</Label>
        <select 
          id="nodeType"
          bind:value={$selectedNode.nodeType} 
          class="input-field"
        >
          <option value="concept">Concept</option>
          <option value="note">Note</option>
        </select>
      </div>
      <div class="flex justify-end space-x-2">
        <Button type="button" variant="ghost" class="btn-ghost" on:click={handleClose}>Cancel</Button>
        <Button type="submit" class="btn-primary">Save</Button>
      </div>
    </form>
  </div>
{/if}

