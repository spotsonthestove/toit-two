<script lang="ts">
    import { user } from '$lib/stores/userStore';
    import { supabase } from '$lib/supabaseClient';
    import { Button } from "$lib/components/ui/button";
    import { Card } from "$lib/components/ui/card";
    import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "$lib/components/ui/accordion";
    import { Clock, BrainCircuit, List, MapPin } from 'lucide-svelte';
  
  
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
  
  <div class="flex flex-col min-h-screen">
    <header class="px-4 lg:px-6 h-14 flex items-center">
      <a class="flex items-center justify-center" href="/">
        <span class="font-bold text-2xl">toit</span>
      </a>
      <nav class="ml-auto flex gap-4 sm:gap-6">
        <a href="/maps" class="text-sm font-medium hover:underline underline-offset-4">
          Mind Maps
        </a>
        <a href="/toit" class="text-sm font-medium hover:underline underline-offset-4">
          Toit
        </a>
        {#if isAuthenticated}
          <a href="/dashboard" class="text-sm font-medium hover:underline underline-offset-4">
            Dashboard
          </a>
          <Button variant="ghost" on:click={handleLogout}>
            Logout
          </Button>
        {:else}
          <a href="/signup">
            <Button variant="secondary">Sign Up</Button>
          </a>
          <a href="/login">
            <Button variant="ghost">Login</Button>
          </a>
        {/if}
      </nav>
    </header>
    <main class="flex-1">
      <section class="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div class="container px-4 md:px-6">
          <div class="flex flex-col items-center space-y-4 text-center">
            <div class="space-y-2">
              <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Let's get a round Toit, when we can.
              </h1>
              <p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Balance what you have to do with what you want to do. Toit helps you structure your life by connecting routine tasks with your deeper passions. 
                Embrace the art of getting around to it
              </p>
            </div>
            <div class="space-x-4">
                <a class="text-sm font-medium hover:underline underline-offset-4" href="#features">Features</a>
                <a class="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">How It Works</a>
                <a class="text-sm font-medium hover:underline underline-offset-4" href="#faq">FAQ</a>
                <Button>Get Started</Button>
              <Button size="lg">Start Your Journey</Button>
              <Button variant="outline" size="lg">Watch Demo</Button>
            </div>
          </div>
        </div>
      </section>
      <section id="features" class="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div class="container px-4 md:px-6">
          <div class="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
            <div class="space-y-4">
              <div class="inline-block rounded-lg bg-background px-3 py-1 text-sm">Features</div>
              <h2 class="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Gentle Productivity
              </h2>
              <p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Split your goals into quick wins and deeper work, connecting them with activities you already enjoy. Progress at your natural rhythm.
                Toit is a productivity system that helps you focus on the present and complete tasks in a balanced way. It's not about speed, it's about completion. In a world that constantly pushes us to do more, faster, and better, Toit emerges as a breath of fresh air in the realm of productivity tools. But Toit isn't just another app vying for your attention in the crowded space of task managers and to-do lists. Instead, it's a paradigm shift in how we approach our daily tasks and long-term goals.

                Toit, at its core, is a playful nod to the phrase "get around to it" - that common refrain we use when speaking of tasks we know we should do, but haven't found the right moment for yet. But rather than treating these tasks as burdens or sources of guilt, Toit transforms them into segments of a circle - a "Round Toit". This visual metaphor is powerful: it reminds us that productivity isn't a linear race to be won, but a cyclical journey to be experienced. Each task, whether it's a quick errand or a deep work session, becomes a vital part of completing our circle.
                
                What sets Toit apart is its embrace of natural rhythms and the ebb and flow of human energy. Unlike traditional productivity tools that often inadvertently promote burnout through their relentless push for efficiency, Toit encourages users to progress at their own pace. It acknowledges that some tasks require time to percolate, others need intense focus, and still others might be quick wins that provide a boost of motivation. By allowing users to visualize their progress as they gradually fill in their Round Toit, the app provides a sense of accomplishment that goes beyond the fleeting satisfaction of crossing items off a list. In essence, Toit isn't just about getting things done - it's about fostering a more mindful, balanced approach to productivity that aligns with our natural cycles of energy and motivation.
              
            </p>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <Card>
                <div class="p-6">
                  <Clock class="size-12 mb-4" />
                  <h3 class="font-bold mb-2">Natural Rhythms</h3>
                  <p class="text-sm text-muted-foreground">
                    Work with your energy cycles, not against them. Balance quick tasks with deeper work.
                  </p>
                </div>
              </Card>
              <Card>
                <div class="p-6">
                  <BrainCircuit class="size-12 mb-4" />
                  <h3 class="font-bold mb-2">AI-Powered</h3>
                  <p class="text-sm text-muted-foreground">
                    Smart task breakdown and personalized productivity insights
                  </p>
                </div>
              </Card>
              <Card>
                <div class="p-6">
                  <List class="size-12 mb-4" />
                  <h3 class="font-bold mb-2">Flexible Views</h3>
                  <p class="text-sm text-muted-foreground">Switch between simple lists and detailed mind maps</p>
                </div>
              </Card>
              <Card>
                <div class="p-6">
                  <MapPin class="size-12 mb-4" />
                  <h3 class="font-bold mb-2">Context Aware</h3>
                  <p class="text-sm text-muted-foreground">
                    UI adapts to your current context and productivity style
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" class="w-full py-12 md:py-24 lg:py-32">
        <div class="container px-4 md:px-6">
          <div class="flex flex-col items-center justify-center space-y-4 text-center">
            <div class="space-y-2">
              <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">How Toit Works</h2>
              <p class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Transform procrastination into progress by connecting tasks with activities you already enjoy.
                Toit isn't about rushing or overworking. It's about acknowledging that some tasks need time, others need focus, and all deserve their moment. With Toit, you're not just crossing off a list – you're completing a circle, one meaningful segment at a time.
              </p>
            </div>
          </div>
          <div class="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div class="flex flex-col justify-center space-y-4">
              <div class="flex size-12 items-center justify-center rounded-full bg-muted text-lg font-bold">1</div>
              <h3 class="text-xl font-bold">Map Your Aspirations</h3>
              <p class="text-muted-foreground">
                Identify both your routine tasks and deeper passions
              </p>
            </div>
            <div class="flex flex-col justify-center space-y-4">
              <div class="flex size-12 items-center justify-center rounded-full bg-muted text-lg font-bold">2</div>
              <h3 class="text-xl font-bold">Break Them Down</h3>
              <p class="text-muted-foreground">
                Split your goals into manageable pieces that fit your schedule
              </p>
            </div>
            <div class="flex flex-col justify-center space-y-4">
              <div class="flex size-12 items-center justify-center rounded-full bg-muted text-lg font-bold">3</div>
              <h3 class="text-xl font-bold">Take Action</h3>
              <p class="text-muted-foreground">
                Associate tasks with activities you enjoy and watch your progress
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="faq" class="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div class="container px-4 md:px-6">
          <div class="flex flex-col items-center justify-center space-y-4 text-center">
            <div class="space-y-2">
              <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
              <p class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to know about Toit and how it can help you achieve your goals.
              </p>
            </div>
          </div>
          <div class="mx-auto max-w-3xl space-y-4 pt-12">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How does Toit help me get things done?</AccordionTrigger>
                <AccordionContent>
                  Toit transforms "getting around to it" into action by connecting tasks with activities you already enjoy. It's not about avoiding tasks, but about finding natural moments to progress on what matters to you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does the AI integration work?</AccordionTrigger>
                <AccordionContent>
                  Our AI helps identify patterns in your productivity, suggests task breakdowns, and adapts to your working
                  style. It's like having a personal productivity coach that learns and grows with you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I switch between different view modes?</AccordionTrigger>
                <AccordionContent>
                  Yes! Toit offers flexible views including simple lists and mind maps. You can switch between them anytime
                  based on your current needs and preferences.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What makes Toit different from traditional to-do lists?</AccordionTrigger>
                <AccordionContent>
                  Unlike linear task lists, Toit acknowledges that productivity isn't a race but a cyclical journey. We help you balance quick wins with deeper work, adapting to your natural rhythms and energy levels.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
      <section class="w-full py-12 md:py-24 lg:py-32">
        <div class="container px-4 md:px-6">
          <div class="flex flex-col items-center justify-center space-y-4 text-center">
            <div class="space-y-2">
              <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
              <p class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of others who are achieving their goals with Toit.
              </p>
            </div>
            <div class="space-x-4">
              <Button size="lg">Start Free Trial</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer class="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p class="text-xs text-muted-foreground">© 2024 Toit. All rights reserved.</p>
      <nav class="sm:ml-auto flex gap-4 sm:gap-6">
        <a class="text-xs hover:underline underline-offset-4" href="/terms">Terms of Service</a>
        <a class="text-xs hover:underline underline-offset-4" href="/privacy">Privacy</a>
      </nav>
    </footer>
  </div>