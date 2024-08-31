<script lang="ts">
  // Add any necessary imports here
</script>

<main>
  <h1>Toit</h1>

  <h2>This will be something when I get a round Toit</h2>
  <nav>
    <a href="/toit">Go to Toit</a>
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  </nav>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #4caf50, #1a1a1a);
    color: white;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  nav {
    display: flex;
    gap: 1rem;
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
</style>