# UI Development v1

This document outlines how the task and mind map pages can work together and provides UI wireframe ideas along with a set of AI prompts for generating or refining the designs.

---

## 1. Integrating Task & Mind Map Pages

### Workflow Ideas

1. **Unified Experience via a Split View or Dashboard**

   - **Initial Input:**  
     Users start on a **task page** where they can input a new task. When they submit the task, the backend calls the AI to produce subtasks.
     
   - **Task Parsing and Node Generation:**  
     The AI splits the main task into subtasks. The application inserts each subtask as a node in a **mind map**, storing additional flags (like `ai_generated: true`) as described in the Stage 2 document.
     
   - **Transition to Mind Map View:**  
     After processing the task, the app can automatically highlight or switch to a **mind map page** where the subtasks appear as nodes. This visual representation lets users review the connections between subtasks or edit/rearrange nodes interactively.

2. **Linked Navigation and Interactivity**

   - **Navigation Flow:**  
     - **Task List Page:** Displays tasks in a list or card layout, where each task includes a button like "View Mind Map".
     - **Mind Map Page:** Shows the interactive mind map where related tasks are grouped or structured visually.
     - Both pages should include similar navigation elements (e.g., a top navigation bar) to allow users to switch views without losing context.

   - **Interactive Elements:**  
     - **Node Interaction:** Clicking a node on the mind map could open a modal with details or editing options.
     - **Drag-and-Drop Reordering:** Allow users to reposition nodes, which might update task priorities or relationships.
     - **Annotations and Filters:** Offer toggles or checkboxes to filter between AI-generated nodes and user-created ones.

3. **Validation & User Feedback Loop**

   - **User Feedback:**  
     Once subtasks are grouped into a Tuit, users can review the structure and adjust relationships directly on the mind map.
     
   - **Iterative Improvement:**  
     Manual testing should be encouraged. For example, after a new input, the system could offer an "edit" mode on the mind map where users suggest improvements. This feedback can later refine the AI's response.

---

## 2. UI Wireframe Ideas

### Option A: Split-Screen Dashboard (Tasks and Mind Map Side-by-Side)

--------------------------------------------------------------------------------
| Header: App Logo | Navigation Links (Tasks | Mind Map | Settings)           |
--------------------------------------------------------------------------------
|                |                    |                                        |
|   Task List    |                    |                                        |
|                |   [Main Panel]     |     [Interactive Mind Map Canvas]      |
|   - Task 1   ->|  ----------------  |  ------------------------------------- |
|   - Task 2   ->|  | Selected Task | |  | Node A      Node B           |     |
|   - Task 3   ->|  | Details       | |  |   \         /                |     |
|                |  ----------------  |  |     Node C (Grouped)           |     |
|                |                    |  ------------------------------------- |
--------------------------------------------------------------------------------
| Footer: Copyright, etc.                                                    |
--------------------------------------------------------------------------------

### Option B: Sequential Flow (Page Transition)

1. **Task Page:**

   ```
   -------------------------------------------------------------------------------
   | Header / Navigation                                                         |
   -------------------------------------------------------------------------------
   | New Task Input: [ Enter Task Details ] [ Submit ]                         |
   -------------------------------------------------------------------------------
   | List of Existing Tasks (cards/rows) (click on task -> preview/edit flow)    |
   -------------------------------------------------------------------------------
   | Footer                                                                      |
   -------------------------------------------------------------------------------
   ```

2. **Mind Map Page (after task submission):**

   ```
   ------------------------------------------------------------------------------
   | Header: (with back or menu options)                                        |
   ------------------------------------------------------------------------------
   | Title: "Mind Map for [Task Title]"                                         |
   |                                                                            |
   | [Zoom In/Out Controls]                                                     |
   |                                                                            |
   |  Interactive Mind Map Canvas:                                              |
   |  ---------------------------------------------------------               |
   |  |                [Central Node]                         |               |
   |  |          /         |         \                          |               |
   |  |      Node A     Node B     Node C                     |               |
   |  ---------------------------------------------------------               |
   |                                                                            |
   ------------------------------------------------------------------------------
   | Footer: Additional navigation options                                      |
   ------------------------------------------------------------------------------
   ```

### Key Points

- **Clear Navigation:** Users know exactly where they are within the app.
- **Interactive Canvas:** A dedicated area for interacting with the mind map.
- **Context Preservation:** Seamless transition between task creation and mind map visualization.

---

## 3. Document of AI Prompts for Generating UI Wireframes

You can use the following template to prompt an AI design tool (such as MidJourney, DALL·E, or Figma plugins) to generate detailed wireframes or UI mockups:
Prompt for AI UI Design:
"Design a modern and intuitive web app interface that integrates a task management system with an interactive mind map. The application should have two primary views:
A 'Task Page' where users can input new tasks and view a list of existing tasks. This page should include:
A clean header with navigation links ("Tasks", "Mind Map", "Settings").
A prominent input field for tasks with a submit button.
A layout (list or card design) that displays the existing tasks.
A 'Mind Map Page' that visually represents the selected task:
The central node represents the task, with connected nodes representing AI-generated subtasks.
An interactive mind map area that supports node click events (to open detail modals) and drag-and-drop repositioning.
Include zoom controls and a clear title displaying the current task name.
The design must provide smooth transitions between the views, maintain consistent styling, and offer clear user feedback options. Please produce a wireframe sketch and provide brief descriptions for each section."
Additional details:
Use a modern, flat UI design.
Ensure mobile responsiveness.
Annotate interactive elements and navigation flow.

---

## 4. Summary

- **Integration Approach:** Offers a seamless flow between task creation and interactive mind map visualization.
- **Wireframe Concepts:** Two main design ideas—split-screen and sequential flow—each with distinct benefits.
- **AI Prompt Document:** Includes a comprehensive prompt for generating or refining detailed UI wireframes.

*Remember: Iterative user testing and incorporating feedback are essential in refining both functionality and design.*