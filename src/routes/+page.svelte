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

<main>
  <div class="grid-container">
    <header>
      <h1>Toit - Mindful Productivity</h1>
      <p>Embrace the art of getting around to it</p>
    </header>

    <nav>
      <a href="/toit">Explore Toit</a>
      {#if isAuthenticated}
        <a href="/dashboard">Dashboard</a>
        <button on:click={handleLogout}>Logout</button>
      {:else}
        <a href="/signup" class="cta">Sign Up</a>
        <a href="/login">Login</a>
      {/if}
      <a href="/test">Test</a>
    </nav>

    <section class="hero">
      <h2>Welcome to Your Round Toit</h2>
      <p>Where thoughtful progress meets your natural rhythm</p>
      <a href="/signup" class="cta-button">Begin Your Journey</a>
    </section>

    <section class="features">
      <h2>The Toit Experience</h2>
      <ul>
        <li>Circular task visualization</li>
        <li>Balanced productivity approach</li>
        <li>Mindful time management</li>
        <li>Celebration of completion</li>
      </ul>
    </section>

    <section class="how-it-works">
      <h2>Embracing Your Toit</h2>
      <ol>
        <li>Create your circular Toit</li>
        <li>Add tasks, big and small</li>
        <li>Progress at your own pace</li>
        <li>Celebrate your Round Toit</li>
      </ol>
    </section>

    <section class="philosophy">
      <h2>The Toit Philosophy</h2>
      <p>Toit isn't about rushing or overworking. It's about acknowledging that some tasks need time, others need focus, and all deserve their moment. With Toit, you're not just crossing off a list – you're completing a circle, one meaningful segment at a time.</p>
   <p>Toit is a productivity system that helps you focus on the present and complete tasks in a balanced way. It's not about speed, it's about completion. In a world that constantly pushes us to do more, faster, and better, Toit emerges as a breath of fresh air in the realm of productivity tools. But Toit isn't just another app vying for your attention in the crowded space of task managers and to-do lists. Instead, it's a paradigm shift in how we approach our daily tasks and long-term goals.

    Toit, at its core, is a playful nod to the phrase "get around to it" - that common refrain we use when speaking of tasks we know we should do, but haven't found the right moment for yet. But rather than treating these tasks as burdens or sources of guilt, Toit transforms them into segments of a circle - a "Round Toit". This visual metaphor is powerful: it reminds us that productivity isn't a linear race to be won, but a cyclical journey to be experienced. Each task, whether it's a quick errand or a deep work session, becomes a vital part of completing our circle.
    
    What sets Toit apart is its embrace of natural rhythms and the ebb and flow of human energy. Unlike traditional productivity tools that often inadvertently promote burnout through their relentless push for efficiency, Toit encourages users to progress at their own pace. It acknowledges that some tasks require time to percolate, others need intense focus, and still others might be quick wins that provide a boost of motivation. By allowing users to visualize their progress as they gradually fill in their Round Toit, the app provides a sense of accomplishment that goes beyond the fleeting satisfaction of crossing items off a list. In essence, Toit isn't just about getting things done - it's about fostering a more mindful, balanced approach to productivity that aligns with our natural cycles of energy and motivation.</p>
    </section>

    <section class="testimonials">
      <h2>Voices of the Toit Community</h2>
      <blockquote>"Toit helped me find balance in my work. It's not about speed, it's about completion."</blockquote>
      <cite>- Alex Chen, Writer</cite>
    </section>

    <section class="pricing">
      <h2>Pricing Plans</h2>
      <div class="plan">
        <h3>Basic</h3>
        <p>Perfect for individuals</p>
        <p class="price">$9.99/month</p>
        <a href="/signup" class="cta-button">Choose Plan</a>
      </div>
      <!-- Add more pricing plans as needed -->
    </section>

    <section class="faq">
      <h2>Common Curiosities</h2>
      <details>
        <summary>What makes Toit different?</summary>
        <p>Toit embraces the natural ebb and flow of productivity. It's not about constant hustle, but about mindful progress and the satisfaction of completion.</p>
      </details>
      <!-- Add more FAQ items as needed -->
    </section>

    <footer>
      <p>&copy; 2023 Toit. All rights reserved.</p>
      <nav>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/contact">Contact Us</a>
      </nav>
    </footer>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    background: linear-gradient(135deg, #4caf50, #1a1a1a);
    color: white;
    padding: 2rem;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  header, nav, .hero, footer {
    grid-column: 1 / -1;
  }

  header, nav {
    text-align: center;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  a {
    color: #fff;
    text-decoration: none;
    padding: 10px 20px;
    background-color: #4CAF50;
    border-radius: 5px;
    transition: background-color 0.3s;
  }

  a:hover {
    background-color: #45a049;
  }

  .cta, .cta-button {
    background-color: #FFA500;
  }

  .cta:hover, .cta-button:hover {
    background-color: #FF8C00;
  }

  section {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 10px;
  }

  .features ul, .how-it-works ol {
    padding-left: 1.5rem;
  }

  .pricing .plan {
    text-align: center;
  }

  footer {
    margin-top: 2rem;
    text-align: center;
  }

  footer nav {
    margin-top: 1rem;
  }

  .toit-v3 {
    grid-column: 2;
    grid-row: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
