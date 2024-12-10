<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";

  export let maps = [];
  export let selectedMapId: number | null = null;

  const dispatch = createEventDispatcher();

  function handleSelect(event: CustomEvent) {
    dispatch('select', event);
  }
</script>

<div>
  <h2 class="text-xl font-semibold mb-2">Your Mind Maps</h2>
  <Select on:select={handleSelect} value={selectedMapId?.toString()}>
    <SelectTrigger class="w-full">
      <SelectValue placeholder="Select a mind map" />
    </SelectTrigger>
    <SelectContent>
      {#each maps as map}
        <SelectItem value={map.mindmap_id.toString()}>{map.name}</SelectItem>
      {/each}
    </SelectContent>
  </Select>
</div>

