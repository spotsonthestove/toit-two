<script lang="ts">
  import { user } from '$lib/stores/userStore';
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  // Derive authentication status from user store
  $: isAuthenticated = !!$user;

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      $user = null; // Clear the user store
      
      // Force a page reload to clear all auth states
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
</script>

<main class="min-h-screen bg-gradient-to-br from-toit-500 to-gray-900 text-white p-8">
  <div class="max-w-7xl mx-auto space-y-8">
    <header class="text-center">
      <h1 class="text-4xl font-bold mb-2">Toit - Mindful Productivity</h1>
      <p class="text-xl text-toit-100">Embrace the art of getting around to it</p>
    </header>

    <nav class="flex justify-center gap-4">
      <a href="/maps" class="px-4 py-2 bg-toit-500 hover:bg-toit-600 rounded-lg transition-colors">
        Mind Maps
      </a>
      <a href="/toit" class="px-4 py-2 bg-toit-500 hover:bg-toit-600 rounded-lg transition-colors">
        Toit
      </a>
      {#if isAuthenticated}
        <a href="/dashboard" class="px-4 py-2 bg-toit-500 hover:bg-toit-600 rounded-lg transition-colors">
          Dashboard
        </a>
        <button 
          on:click={handleLogout}
          class="px-4 py-2 bg-toit-500 hover:bg-toit-600 rounded-lg transition-colors"
        >
          Logout
        </button>
      {:else}
        <a href="/signup" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors">
          Sign Up
        </a>
        <a href="/login" class="px-4 py-2 bg-toit-500 hover:bg-toit-600 rounded-lg transition-colors">
          Login
        </a>
      {/if}
    </nav>

    <section class="bg-white/10 rounded-lg p-8">
      <h2 class="text-3xl font-semibold mb-4">Welcome to Your Round Toit</h2>
      <p class="text-lg text-toit-100 mb-6">Where thoughtful progress meets your natural rhythm</p>
      <a href="/signup" class="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors">
        Begin Your Journey
      </a>
    </section>

    <section class="bg-white/10 rounded-lg p-8">
      <h2 class="text-3xl font-semibold mb-4">The Toit Experience</h2>
      <ul class="list-disc pl-8">
        <li>Circular task visualization</li>
        <li>Balanced productivity approach</li>
        <li>Mindful time management</li>
        <li>Celebration of completion</li>
      </ul>
    </section>

    <section class="bg-white/10 rounded-lg p-8">
      <h2 class="text-3xl font-semibold mb-4">Embracing Your Toit</h2>
      <ol class="list-decimal pl-8">
        <li>Create your circular Toit</li>
        <li>Add tasks, big and small</li>
        <li>Progress at your own pace</li>
        <li>Celebrate your Round Toit</li>
      </ol>
    </section>

    <section class="bg-white/10 rounded-lg p-8">
      <h2 class="text-3xl font-semibold mb-4">The Toit Philosophy</h2>
      <p class="text-lg text-toit-100 mb-6">
        Toit isn't about rushing or overworking. It's about acknowledging that some tasks need time, others need focus, and all deserve their moment. With Toit, you're not just crossing off a list – you're completing a circle, one meaningful segment at a time.
      </p>
      <p class="text-lg text-toit-100 mb-6">
        Toit is a productivity system that helps you focus on the present and complete tasks in a balanced way. It's not about speed, it's about completion. In a world that constantly pushes us to do more, faster, and better, Toit emerges as a breath of fresh air in the realm of productivity tools. But Toit isn't just another app vying for your attention in the crowded space of task managers and to-do lists. Instead, it's a paradigm shift in how we approach our daily tasks and long-term goals.

        Toit, at its core, is a playful nod to the phrase "get around to it" - that common refrain we use when speaking of tasks we know we should do, but haven't found the right moment for yet. But rather than treating these tasks as burdens or sources of guilt, Toit transforms them into segments of a circle - a "Round Toit". This visual metaphor is powerful: it reminds us that productivity isn't a linear race to be won, but a cyclical journey to be experienced. Each task, whether it's a quick errand or a deep work session, becomes a vital part of completing our circle.
        
        What sets Toit apart is its embrace of natural rhythms and the ebb and flow of human energy. Unlike traditional productivity tools that often inadvertently promote burnout through their relentless push for efficiency, Toit encourages users to progress at their own pace. It acknowledges that some tasks require time to percolate, others need intense focus, and still others might be quick wins that provide a boost of motivation. By allowing users to visualize their progress as they gradually fill in their Round Toit, the app provides a sense of accomplishment that goes beyond the fleeting satisfaction of crossing items off a list. In essence, Toit isn't just about getting things done - it's about fostering a more mindful, balanced approach to productivity that aligns with our natural cycles of energy and motivation.
      </p>
    </section>

    <section class="bg-white/10 rounded-lg p-8">
      <h2 class="text-3xl font-semibold mb-4">Voices of the Toit Community</h2>
      <blockquote class="text-lg text-toit-100 mb-6">"Toit helped me find balance in my work. It's not about speed, it's about completion."</blockquote>
      <cite class="text-lg text-toit-100">- Alex Chen, Writer</cite>
    </section>

    <section class="bg-white/10 rounded-lg p-8">
      <h2 class="text-3xl font-semibold mb-4">Pricing Plans</h2>
      <div class="text-center">
        <h3 class="text-2xl font-semibold mb-2">Basic</h3>
        <p class="text-lg text-toit-100 mb-4">Perfect for individuals</p>
        <p class="text-2xl font-semibold mb-2">$9.99/month</p>
        <a href="/signup" class="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors">
          Choose Plan
        </a>
      </div>
      <!-- Add more pricing plans as needed -->
    </section>

    <section class="bg-white/10 rounded-lg p-8">
      <h2 class="text-3xl font-semibold mb-4">Common Curiosities</h2>
      <details class="text-lg text-toit-100 mb-6">
        <summary class="font-semibold mb-2">What makes Toit different?</summary>
        <p class="mb-6">Toit embraces the natural ebb and flow of productivity. It's not about constant hustle, but about mindful progress and the satisfaction of completion.</p>
      </details>
      <!-- Add more FAQ items as needed -->
    </section>

    <footer class="text-center">
      <p class="text-lg text-toit-100 mb-4">&copy; 2023 Toit. All rights reserved.</p>
      <nav class="flex justify-center gap-4">
        <a href="/privacy" class="text-lg text-toit-100">Privacy Policy</a>
        <a href="/terms" class="text-lg text-toit-100">Terms of Service</a>
        <a href="/contact" class="text-lg text-toit-100">Contact Us</a>
      </nav>
    </footer>
  </div>
</main>
