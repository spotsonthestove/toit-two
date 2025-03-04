<!-- src/routes/theme-test/+page.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
</script>

<div class="container mx-auto py-8 px-4">
  <h1 class="text-4xl font-bold mb-8 text-primary">Theme Test Page</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Test Card 1 -->
    <Card class="p-6 neumorph">
      <h2 class="text-xl font-semibold mb-4 text-primary">Neumorphic Card</h2>
      <p class="text-muted-foreground mb-4">
        This card demonstrates the neumorphic shadow effect that changes with the focus level.
      </p>
      <Button variant="default" class="w-full neumorph-panel-sm">Neumorphic Button</Button>
    </Card>

    <!-- Test Card 2 -->
    <Card class="p-6 glass">
      <h2 class="text-xl font-semibold mb-4 text-primary">Glass Card</h2>
      <p class="text-muted-foreground mb-4">
        This card shows the glass effect that changes with the feeling level.
      </p>
      <Button variant="outline" class="w-full">Glass Button</Button>
    </Card>

    <!-- Test Card 3 -->
    <Card class="p-6">
      <h2 class="text-xl font-semibold mb-4 text-primary">Standard Card</h2>
      <p class="text-muted-foreground mb-4">
        This card uses standard styling to demonstrate theme colors.
      </p>
      <Button class="w-full">Standard Button</Button>
    </Card>
  </div>

  <!-- Interactive Elements -->
  <div class="mt-12 space-y-8">
    <div class="p-6 neumorph rounded-lg">
      <h2 class="text-xl font-semibold mb-4 text-primary">Interactive Elements</h2>
      
      <!-- Button Variants -->
      <div class="flex flex-wrap gap-4 mb-6">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <!-- Form Elements -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-primary">Input Field</label>
          <input 
            type="text" 
            class="w-full p-2 rounded-lg neumorph-panel-sm focus:neumorph-pressed outline-none"
            placeholder="Type something..."
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 text-primary">Select</label>
          <select class="w-full p-2 rounded-lg neumorph-panel-sm focus:neumorph-pressed outline-none">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 text-primary">Checkbox</label>
          <div class="flex items-center space-x-2">
            <input type="checkbox" class="rounded neumorph-panel-sm" />
            <span class="text-muted-foreground">Check me</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .glass {
    background-color: rgba(var(--color-background-rgb), var(--glass-opacity));
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
</style> 