<script lang="ts">
  import ToitTorus from '$lib/components/ToitTorus.svelte';
</script>

<h1>Test Page</h1>

<p>This is a test page to demonstrate routing in Svelte.</p>

<nav>
  <a href="/">Back to Home</a>
</nav>

<h2>Toit Torus Component Test</h2>

<ToitTorus />

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
</style>