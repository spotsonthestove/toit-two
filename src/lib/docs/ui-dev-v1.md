# UI Development v1

This document outlines the revised UI concept for early testing of our "Beta-App" experience. In this iteration, we lean towards a sequential flow (paginated approach) rather than a unified split view. Our primary goal is to streamline task creation and visualization while maintaining core functionality for testing and future refactoring.

---

## 1. Integrating Task & Mind Map Pages

### New Workflow Overview (Beta-App Sequential Flow)

1. **User Redirection & Landing Page:**
   - **Logged In Users:**  
     Upon authentication, users will be automatically redirected to a new route named **beta-app**.  
     The beta-app adopts the sequential flow wherein users first interact with a dedicated task page for input and then, following submission, are taken to a separate mind map page for visualization.
   - **Landing Page Adjustments:**  
     The landing page is simplified and features only:
     - Sign In
     - Sign Up (and Logout for authenticated users)
     - A prominent link directing users to the **beta-app**
     
     All other navigational links are removed for now to focus users on testing the new sequential experience.

2. **Task Page (First Step):**
   - **Design & Functionality:**
     - A clear header (which might include the app logo and a minimal set of essential actions like Sign In, Sign Up, and Logout).
     - A prominent task input area where the user enters a new task.
     - A submit button that triggers AI-powered task splitting.
     - The use of subtle neumorphism effects is recommended for buttons, input fields, and cards. (Tailwind CSS and Shadcn-Svelte components offer built-in tokens and styles to help achieve this soft, tactile look.)
     
3. **Mind Map Page (Second Step):**
   - **Visualization & Interaction:**
     - Displays the input task as a central node with AI-generated subtasks arranged as child nodes.
     - Features interactive controls such as zoom in/out and node dragging.
     - When editing a node, a modal pops up; this modal should employ a pronounced glassmorphism style—featuring a translucent, frosted "glass" background with soft shadows—to give an AR type look and feel.
   - **Navigation:**
     - A simple back or return link to navigate from the mind map back to the Task Page for further edits or additional task creation.

---

## 2. UI Wireframe Ideas

### Preferred Option: Sequential Flow (Beta-App Approach)

Rather than a split-screen dashboard, the beta-app uses a page transition system where the user experience is divided into two simplified pages:

1. **Task Page:**

   ```
   -------------------------------------------------------------------------------
   | Header: Minimal, with Logo, Sign In, Sign Up, Logout, and Beta-App link     |
   -------------------------------------------------------------------------------
   | New Task Input: [ Enter Task Details ] [ Submit ]                         |
   -------------------------------------------------------------------------------
   | Task List: Display existing tasks as cards or rows                         |
   -------------------------------------------------------------------------------
   | Footer: Minimal or hidden                                                  |
   -------------------------------------------------------------------------------
   ```

2. **Mind Map Page:**

   ```
   ------------------------------------------------------------------------------
   | Header: Simplified navigation with a return link to the Task Page            |
   ------------------------------------------------------------------------------
   | Title: "Mind Map for [Task Title]"                                          |
   | [Zoom In/Out Controls]                                                      |
   |  Interactive Mind Map Canvas:                                               |
   |     - Central Node represents the task                                    |
   |     - AI-generated subtasks are arranged as child nodes                     |
   |     - On node click, a modal editor appears with a glassmorphic style       |
   ------------------------------------------------------------------------------
   | Footer: Minimal or hidden                                                  |
   ------------------------------------------------------------------------------
   ```

### Additional UI Aesthetics:

- **Neumorphism Elements:**  
  Use subtle neumorphism on UI controls—such as for buttons, input fields, and cards—to create a soft, modern, and tactile interface.

- **Glassmorphism in Modals:**  
  Enhance node detail modals with a glass-like (translucent and frosted) appearance to evoke an AR-inspired, futuristic feel. This should include gentle shadows and a semi-transparent background.

---

## 3. Revised Navigation & Routing

- **Landing Page:**  
  - The landing page should be stripped down to only display the Sign In, Sign Up, Logout actions (for authenticated users), and a prominent Beta-App link.
  - All other navigational links are temporarily hidden to reduce distraction and focus on testing the Beta-App flow.

- **Existing Routes:**  
  - The current routes will be retained for now; the Beta-App is an additional route that addresses this new paged approach.
  - The Beta-App route features the sequential flow: a dedicated Task Page followed by the Mind Map Page.

---

## 4. Next Steps for Implementation

- **UI Developers:**  
  Begin implementing the Beta-App as described. Use SvelteKit with Tailwind CSS and Shadcn-Svelte to integrate nuanced neumorphic UI elements and glassmorphic modals.
  
- **Feedback & Iteration:**  
  Conduct user testing on the Beta-App flow, with special attention to:
  - The clarity and smoothness of page transitions between the Task Page and the Mind Map Page.
  - The tactile and visual quality of neumorphic elements.
  - The immersive, AR-like experience in the mind map modal.

- **AI Integration:**  
  Ensure the AI-powered task splitting is fully integrated. Upon task submission, the generated subtasks should be seamlessly displayed on the Mind Map Page.

---

## 5. Summary

This updated UI approach is focused on a paged sequential flow (the **Beta-App**), transitioning users from task input to mind map visualization. With an uncluttered landing page and the use of neumorphism and glassmorphism for a modern, tactile, and immersive feel, this design is intended for rapid testing and incremental refinement. All existing routes remain available, and future updates will be based on user feedback and further UI iterations.

*Note: This is an interim design. Additional refinements and updates will follow based on testing insights and development progress.*

## 6. Neumorphic Design Implementation

### Color Palette
```css
/* Base Colors */
bg-gray-50    /* Main background */
bg-white      /* Component background */
text-gray-800 /* Primary text */
text-gray-600 /* Secondary text */
text-gray-500 /* Tertiary text */
text-gray-400 /* Subtle text */
border-gray-200 /* Subtle borders */
```

### Shadow Effects
```css
/* Card and Container Shadows */
shadow-[8px_8px_16px_rgba(0,0,0,0.05),-8px_-8px_16px_rgba(255,255,255,0.9)]  /* Large container shadow */
shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.9)]   /* Button default shadow */
shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.9)]     /* Button hover shadow */
shadow-inner   /* Inset shadow for input fields */
shadow-sm      /* Subtle shadow for header */
```

### Component Styling

1. **Buttons**:
   ```css
   /* Primary Button */
   bg-white 
   shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.9)]
   hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.9)]
   text-gray-700
   transition-all
   duration-200

   /* Ghost Button */
   text-gray-600
   hover:bg-gray-100
   ```

2. **Input Fields**:
   ```css
   bg-gray-50
   border
   border-gray-200
   rounded-lg
   text-gray-700
   focus:outline-none
   focus:ring-2
   focus:ring-gray-200
   focus:border-transparent
   shadow-inner
   ```

3. **Cards**:
   ```css
   bg-white
   rounded-lg
   p-6
   shadow-[8px_8px_16px_rgba(0,0,0,0.05),-8px_-8px_16px_rgba(255,255,255,0.9)]
   hover:shadow-[4px_4px_8px_rgba(0,0,0,0.05),-4px_-4px_8px_rgba(255,255,255,0.9)]
   transition-all
   duration-200
   ```

### Layout Guidelines

1. **Header**:
   ```css
   bg-white
   shadow-sm
   h-14
   flex
   items-center
   ```

2. **Container Spacing**:
   ```css
   container
   mx-auto
   px-4
   py-8
   ```

3. **Content Width**:
   ```css
   max-w-4xl
   mx-auto
   ```

### Implementation Examples

1. **Card Container**:
   ```html
   <div class="bg-white rounded-lg p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.05),-8px_-8px_16px_rgba(255,255,255,0.9)]">
     <h2 class="text-xl font-bold mb-4 text-gray-800">Title</h2>
     <!-- Content -->
   </div>
   ```

2. **Neumorphic Button**:
   ```html
   <Button 
     class="bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.9)] 
            hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.9)] 
            text-gray-700"
   >
     Click Me
   </Button>
   ```

3. **Input Field**:
   ```html
   <textarea
     class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg 
            text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 
            focus:border-transparent shadow-inner"
   ></textarea>
   ```

### Best Practices

1. **Shadow Depth**:
   - Use larger shadows for main containers
   - Medium shadows for interactive elements
   - Smaller shadows for hover states
   - Inner shadows for input fields

2. **Color Usage**:
   - Maintain high contrast for text
   - Use subtle grays for borders
   - Keep backgrounds light for shadow effect
   - Use color sparingly for emphasis

3. **Transitions**:
   - Add smooth transitions for shadow changes
   - Use `duration-200` for optimal smoothness
   - Include both shadow and background in transitions

4. **Accessibility**:
   - Maintain sufficient color contrast
   - Ensure focus states are visible
   - Keep interactive elements obvious

### Mobile Considerations

1. **Shadow Adjustments**:
   - Reduce shadow size on mobile
   - Maintain subtle depth perception
   - Consider device performance

2. **Touch Targets**:
   - Ensure sufficient padding for touch
   - Maintain clear hover/active states
   - Consider touch feedback

This neumorphic design system provides a modern, tactile feel while maintaining usability and performance. The subtle shadows and transitions create a sense of depth without overwhelming the interface.