<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { user } from '$lib/stores/userStore';
  import { Button } from "$lib/components/ui/button";
  import { page } from '$app/stores';
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import ThemeTransition from '$lib/components/ThemeTransition.svelte';
  import ThemeProvider from '$lib/components/ThemeProvider.svelte';
  import "../app.css";
  import "$lib/styles/themes.css";

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

  // Navigation items - consolidated as per UI-dev-v2.md
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
  
  // Determine if we're on the landing page
  $: isLandingPage = currentPath === '/';
</script>

<svelte:head>
  <!-- Favicon: Using your logo from the static directory -->
  <link rel="icon" href="/logo.jpg" type="image/jpeg">
</svelte:head>

<!-- Theme Provider wraps the entire app -->
<ThemeProvider>
  <!-- Theme transition overlay -->
  <ThemeTransition />

  <div class="min-h-screen flex flex-col">
    <header class="px-4 lg:px-6 h-16 flex items-center bg-background shadow-sm">
      <a 
        class="flex items-center justify-center" 
        href="/"
      >
        <img src="/logo.jpg" alt="Toit logo" class="h-10 w-auto mr-2" />
        <span class="font-bold text-2xl forestry-gradient-text">toit</span>
      </a>
      
      <nav class="ml-10 hidden md:flex gap-4 sm:gap-6">
        {#each navItems as item}
          {#if !item.requiresAuth || isAuthenticated}
            <a 
              href={item.href} 
              class="px-3 py-2 text-primary hover:text-secondary transition-colors duration-200 {isActive(item.href) ? 'border-b-2 border-secondary text-secondary' : ''}"
            >
              {item.label}
            </a>
          {/if}
        {/each}
      </nav>
      
      <div class="ml-auto flex gap-4 sm:gap-6">
        {#if isAuthenticated}
          <Button variant="ghost" class="text-primary hover:bg-background/50 transition-all duration-200" on:click={handleLogout}>
            Logout
          </Button>
        {:else}
          <a href="/signup">
            <Button variant="secondary" class="bg-secondary hover:bg-primary text-white transition-all duration-200">Sign Up</Button>
          </a>
          <a href="/login">
            <Button variant="ghost" class="text-primary hover:bg-background/50 transition-all duration-200">Login</Button>
          </a>
        {/if}
      </div>
    </header>

    <!-- Mobile navigation for smaller screens -->
    <div class="md:hidden bg-background border-t border-border fixed bottom-0 left-0 right-0 z-50">
      <div class="flex justify-around items-center h-16">
        <a 
          href="/" 
          class="flex flex-col items-center justify-center p-2 {isActive('/') ? 'text-secondary' : 'text-primary'}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs">Home</span>
        </a>
        
        {#if isAuthenticated}
          {#each navItems.filter(item => !item.requiresAuth || isAuthenticated) as item}
            <a 
              href={item.href} 
              class="flex flex-col items-center justify-center p-2 {isActive(item.href) ? 'text-secondary' : 'text-primary'}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {#if item.label === 'Mind Maps'}
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                {:else if item.label === 'Toit Sessions'}
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                {:else}
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                {/if}
              </svg>
              <span class="text-xs">{item.label}</span>
            </a>
          {/each}
        {:else}
          <a 
            href="/login" 
            class="flex flex-col items-center justify-center p-2 {isActive('/login') ? 'text-secondary' : 'text-primary'}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span class="text-xs">Login</span>
          </a>
          <a 
            href="/signup" 
            class="flex flex-col items-center justify-center p-2 {isActive('/signup') ? 'text-secondary' : 'text-primary'}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span class="text-xs">Sign Up</span>
          </a>
        {/if}
      </div>
    </div>

    <main class="flex-1 pb-16 md:pb-0">
      <slot />
    </main>

    <footer class="py-6 px-4 bg-background border-t border-border">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center mb-4 md:mb-0">
          <img src="/logo.jpg" alt="Toit logo" class="h-8 w-auto mr-2" />
          <span class="text-primary">© {new Date().getFullYear()} Toit</span>
        </div>
        <div class="flex gap-6">
          <a href="/" class="text-primary hover:text-secondary transition-colors duration-200">Home</a>
          <a href="/about" class="text-primary hover:text-secondary transition-colors duration-200">About</a>
          <a href="/privacy" class="text-primary hover:text-secondary transition-colors duration-200">Privacy</a>
        </div>
      </div>
    </footer>

    <!-- Theme switcher -->
    <ThemeSwitcher />
  </div>
</ThemeProvider>