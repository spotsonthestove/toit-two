<script lang="ts">
  import ToitTorus from '$lib/components/ToitTorus.svelte';
  import OrbComponent from '$lib/components/trying_stuff.svelte';
</script>

<h1>Test Page</h1>

<p>This is a test page to demonstrate routing in Svelte.</p>

<nav>
  <a href="/">Back to Home</a>
</nav>

<h2>Toit Torus Component Test</h2>

<ToitTorus />

<h2>Glowing Orb Test</h2>
<div class="orb-container">
  <OrbComponent size="200px" primaryColor="#FF6B00" secondaryColor="#FFB800" />
</div>

<style>
  h1 {
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
  }

  p {
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
  }

  nav {
    text-align: center;
  }

  nav a {
    color: #fff;
    text-decoration: none;
    padding: 10px 20px;
    background-color: #4CAF50;
    border-radius: 5px;
    transition: background-color 0.3s;
  }

  nav a:hover {
    background-color: #45a049;
  }

  h2 {
    text-align: center;
    color: #333;
    margin-top: 2rem;
  }

  .orb-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;
  }
</style>