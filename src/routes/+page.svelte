<script lang="ts">
//  import ToitV3 from '$lib/components/toit-v3.svelte';
  // Add any other necessary imports here
</script>

<main>
  <div class="grid-container">
    <header>
      <h1>Toit - Organize Your Thoughts</h1>
      <p>Streamline your ideas and boost productivity</p>
    </header>

    <nav>
      <a href="/toit">Explore Toit</a>
      <a href="/signup" class="cta">Sign Up</a>
      <a href="/login">Login</a>
      <a href="/test">Test</a>
    </nav>

    <section class="hero">
      <h2>Welcome to Toit</h2>
      <p>Your personal thought organizer and productivity booster</p>
      <a href="/signup" class="cta-button">Get Started</a>
    </section>

    <section class="features">
      <h2>Key Features</h2>
      <ul>
        <li>Intuitive mind mapping</li>
        <li>Collaborative workspaces</li>
        <li>Task management integration</li>
        <li>Real-time synchronization</li>
      </ul>
    </section>

    <!-- <section class="toit-v3">
      <ToitV3 />
    </section> -->

    <section class="how-it-works">
      <h2>How It Works</h2>
      <ol>
        <li>Sign up for an account</li>
        <li>Create your first mind map</li>
        <li>Invite collaborators</li>
        <li>Boost your productivity</li>
      </ol>
    </section>

    <section class="testimonials">
      <h2>What Our Users Say</h2>
      <blockquote>"Toit has revolutionized the way I organize my thoughts!"</blockquote>
      <cite>- Jane Doe, Product Manager</cite>
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
      <h2>Frequently Asked Questions</h2>
      <details>
        <summary>How secure is my data?</summary>
        <p>Your data is encrypted and stored securely on our servers.</p>
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