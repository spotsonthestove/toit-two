<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { user } from '$lib/stores/userStore';
  import { Button } from "$lib/components/ui/button";
  import { page } from '$app/stores';
  import "../app.css";

  export let data;

  $: isAuthenticated = !!$user;

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        $user = session.user;
      } else {
        $user = null;
      }
      
      invalidate('supabase:auth');
    });

    return () => subscription.unsubscribe();
  });

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  // Navigation items
  const navItems = [
    { href: '/beta-app', label: 'Mind Maps', requiresAuth: true },
    { href: '/toit', label: 'Toit Sessions', requiresAuth: true },
    { href: '/maps', label: '3D Maps', requiresAuth: true },
  ];

  // Check if the current route matches the nav item
  $: currentPath = $page.url.pathname;
  $: isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };
</script>

<svelte:head>
  <!-- Favicon: Using your logo from the static directory -->
  <link rel="icon" href="/logo.jpg" type="image/jpeg">
</svelte:head>

<div class="min-h-screen bg-speed-of-light flex flex-col">
  <header class="px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm">
    <a class="flex items-center justify-center" href="/">
      <img src="/logo.jpg" alt="Toit logo" class="h-10 w-auto mr-2" />
      <span class="font-bold text-2xl forestry-gradient-text">toit</span>
    </a>
    
    <nav class="ml-10 hidden md:flex gap-4 sm:gap-6">
      {#each navItems as item}
        {#if !item.requiresAuth || isAuthenticated}
          <a 
            href={item.href} 
            class="px-3 py-2 text-shadow-moss hover:text-green-tone-ink transition-colors {isActive(item.href) ? 'border-b-2 border-green-tone-ink text-green-tone-ink' : ''}"
          >
            {item.label}
          </a>
        {/if}
      {/each}
    </nav>
    
    <div class="ml-auto flex gap-4 sm:gap-6">
      {#if isAuthenticated}
        <Button variant="ghost" class="text-shadow-moss hover:bg-speed-of-light" on:click={handleLogout}>
          Logout
        </Button>
      {:else}
        <a href="/signup">
          <Button variant="secondary" class="bg-green-tone-ink hover:bg-shadow-moss text-white">Sign Up</Button>
        </a>
        <a href="/login">
          <Button variant="ghost" class="text-shadow-moss hover:bg-speed-of-light">Login</Button>
        </a>
      {/if}
    </div>
  </header>

  <main class="flex-1">
    <slot />
  </main>

  <footer class="py-6 px-4 bg-white border-t border-neugray-200">
    <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
      <div class="flex items-center mb-4 md:mb-0">
        <img src="/logo.jpg" alt="Toit logo" class="h-8 w-auto mr-2" />
        <span class="text-shadow-moss">© {new Date().getFullYear()} Toit</span>
      </div>
      <div class="flex gap-6">
        <a href="/" class="text-shadow-moss hover:text-green-tone-ink">Home</a>
        <a href="/about" class="text-shadow-moss hover:text-green-tone-ink">About</a>
        <a href="/privacy" class="text-shadow-moss hover:text-green-tone-ink">Privacy</a>
      </div>
    </div>
  </footer>
</div>