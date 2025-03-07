# Stage 2: Toit Development (Toit Dev)

This document outlines the development stages for enhancing our AI subtask splitting and integrating the results into our mind map and Toit task systems. As we progress through these phases, user testing and feedback remain central. All work should be iterative, with manual testing at each phase.

---

## Overview

In Stage 2, we will extend our task splitting functionality (as implemented in the AI assistant) to not only insert AI-generated subtasks as mind map nodes but also combine these subtasks into structured Toit tasks. A Toit task is envisioned as a three-piece entity that helps users visually and functionally organize their tasks into a central concept and grouped subtasks.

---

## Phase 1: Enhancing AI Subtask Splitting and Node Insertion

### Objectives

- **Validate and Enhance Parsing**: Ensure the AI output is cleanly parsed into separate subtasks.
- **Database Integration**:  
  - Insert each subtask as a new node in the `mindmap_nodes` table.
  - If required, create a central node for the main task if not already present.
  
### Steps

1. **Receive and Parse AI Response**  
   - Leverage the existing implementation in `src/routes/sample-ai/+page.svelte` to get the AI response.
   - Enhance parsing logic to work robustly when subtasks vary in number or format.

2. **Map Subtasks to Mind Map Nodes**  
   - For each parsed subtask, generate a node object with required fields (title, description, coordinates, node type).
   - Ensure that nodes derived from AI output are tagged appropriately (e.g., an extra flag `ai_generated: true` may be considered in future schema enhancements).

3. **Insert Nodes into the Database**  
   - Extend the insertion logic (via Supabase client) so that each subtask is inserted into the `mindmap_nodes` table.
   - Validate that all necessary fields are captured and that relationships (such as `parent_node_id`) are correctly set.

4. **User Testing Step**  
   - Manually test task input in the web interface.
   - Confirm that AI-generated subtasks appear as new nodes on the mind map.
  
### Implementation Notes and Learnings

#### Phase 1 Implementation Details

The AI subtask splitting and node insertion has been successfully implemented with the following key components:

1. **AI Integration Pattern**:
   ```typescript
   // Configuration for longer AI operations
   export const config = {
       runtime: 'edge',
       maxDuration: 60
   };

   // Standardized AI model configuration
   const response = await platform.env.AI.run('@cf/mistral/mistral-7b-instruct-v0.1', {
       messages: [
           {
               role: 'system',
               content: SYSTEM_PROMPT
           },
           {
               role: 'user',
               content: `Break this task into 3 subtasks: ${task}`
           }
       ],
       stream: false,
       max_tokens: 256,
       temperature: 0.3
   });
   ```

2. **Database Integration Pattern**:
   ```typescript
   // Create mindmap with proper user ownership
   const { data: mindmap } = await supabase
       .from('mindmaps')
       .insert([{
           name: taskDescription.split('\n')[0] || 'New Task',
           description: taskDescription,
           user_id: session.user.id  // Critical for RLS
       }]);

   // Create concept node
   const { data: mainTask } = await supabase
       .from('mindmap_nodes')
       .insert([{
           mindmap_id: mindmap.mindmap_id,
           title: taskDescription,
           node_type: 'concept',
           content: taskDescription,
           x: 0, y: 0, z: 0
       }]);

   // Create subtask nodes
   const subtaskNodes = subtasks.map(subtask => ({
       mindmap_id: mindmap.mindmap_id,
       title: subtask,
       node_type: 'note',
       parent_node_id: mainTask.node_id,
       content: subtask,
       x: 0, y: 0, z: 0
   }));
   ```

3. **Authentication Flow**:
   - Server-side authentication using `locals.getSession()`
   - Token passing between client and API endpoints
   - RLS policy compliance through proper user ownership

4. **Critical Considerations**:
   - Proper node type hierarchy ('concept' for center, 'note' for subtasks)
   - RLS policy compliance through user ownership
   - Parent-child relationships in node creation
   - Timeout configuration for AI operations
   - Error handling and validation at each step

#### Key Learnings and Best Practices

1. **Database Operations**:
   - Always set user_id for RLS compliance
   - Maintain proper node type hierarchy
   - Ensure parent-child relationships are correctly set
   - Use proper coordinate system for node positioning

2. **AI Integration**:
   - Configure appropriate timeouts for AI operations
   - Implement retry mechanisms for reliability
   - Standardize AI model configuration across endpoints
   - Validate and parse AI responses carefully

3. **Authentication**:
   - Use server-side authentication through locals
   - Properly pass tokens between client and API
   - Implement comprehensive error handling
   - Validate authentication at each step

4. **Error Handling**:
   - Implement type-safe error handling
   - Provide user-friendly error messages
   - Log errors comprehensively
   - Handle edge cases and timeouts

#### Next Steps and Recommendations

1. **Immediate Improvements**:
   - Implement retry mechanism for AI requests
   - Add proper coordinate distribution for subtasks
   - Enhance visual feedback during AI processing
   - Consider task templates or presets

2. **Future Enhancements**:
   - Add batch processing capabilities
   - Implement undo/redo functionality
   - Add task prioritization
   - Enhance visualization options

3. **Performance Optimizations**:
   - Implement request caching
   - Add request debouncing
   - Optimize database queries
   - Enhance error recovery mechanisms

This implementation provides a solid foundation for the Toit task management system, successfully bridging AI-powered task splitting with our mind map visualization. The next phases will build upon this foundation to create a more comprehensive and user-friendly task management solution.

---

## Phase 2: Forming Toit Tasks from Subtasks

### Objectives

- **Design Toit Grouping**: Combine three related subtasks into a structured Toit task.
- **Route and Model Adjustments**:
  - Update the Toit route to handle a "Toit session" or task grouping.
  - Clarify the process by which individual subtasks are merged into a Toit.
- **Visual Task Management**:
  - Implement circular task visualization with the ToitTorus component.
  - Enable interactive task status management.
  - Provide clear progress indication.

### Implementation Progress

1. **Toit Session Creation**  
   - Created form structure for session creation
   - Implemented mindmap selection
   - Added node selection from chosen mindmap
   - Database integration with proper RLS policies

2. **ToitTorus Component Implementation**
   - Circular task visualization:
     ```typescript
     // Task segment calculation
     function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
       const start = polarToCartesian(x, y, radius, endAngle);
       const end = polarToCartesian(x, y, radius, startAngle);
       const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
       return [
         "M", start.x, start.y,
         "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
       ].join(" ");
     }
     ```
   - Interactive task status management:
     - Click to toggle task completion
     - Real-time database updates
     - Visual status indication
   - Progress tracking:
     - Sweeping progress indicator
     - Dynamic progress calculation
     - Smooth transitions

3. **Database Integration**
   - Proper RLS policy implementation
   - Real-time task status updates
   - Optimistic UI updates
   - Error handling and recovery

### Current Features

1. **Session Management**
   - Create new Toit sessions
   - Select tasks from mindmaps
   - View existing sessions
   - Track session progress

2. **Task Visualization**
   - Circular task arrangement
   - Status-based coloring
   - Interactive task segments
   - Overall progress indication

3. **Task Management**
   - Toggle task completion
   - View task details
   - Track completion status
   - Monitor session progress

### Next Steps

1. **Enhanced Visualization**
   - Add task labels to segments
   - Implement task reordering
   - Add progress animations
   - Consider subtask visualization

2. **User Experience**
   - Add keyboard shortcuts
   - Enhance accessibility
   - Improve error messaging
   - Add user preferences

3. **Data Management**
   - Implement session archiving
   - Add task history
   - Enable data export
   - Add batch operations

4. **Testing and Validation**
   - Add comprehensive testing
   - Validate edge cases
   - Test performance
   - Gather user feedback

The implementation now provides a solid foundation for task management with clear visual feedback and intuitive interaction. The circular design effectively represents the Toit concept while maintaining functionality and user experience.

---

## Phase 3: Iterative Testing, User Feedback, and Roadmap for Future Enhancements

### Objectives

- Validate integration across the web app and Toit routes.
- Gather user feedback to inform future improvements.
- Lay groundwork for advanced features (e.g., AI-driven vectorization for documents).

### Steps

1. **Comprehensive End-to-End Testing**  
   - Combine phases 1 and 2 to validate that a user can:
     - Input a task.
     - See the AI generate subtasks.
     - Have those subtasks inserted as mind map nodes.
     - Group the subtasks into a properly formed Toit task.
     
2. **Collect and Document Feedback**  
   - Use manual testing sessions with real users to collect qualitative feedback.
   - Identify pain points, UI issues, or connectivity challenges between components.
     
3. **Roadmap Planning for Future Features**  
   - Based on test results, plan additional features such as:
     - **Dynamic Viewing Modes**: Switch between a mind map and a list view.
     - **Advanced AI Integration**: Introduce document vectorization that converts PDFs into mind maps.
     - **Detailed Schema Migrations**: Update the database to store additional tracking information (e.g., Toit_group_id).
     
4. **Documentation Updates**  
   - Continuously update this document and the project requirements to reflect any changes made.
   - Ensure that future developers have clear instructions on testing and migration steps.

---

## Summary

In Stage 2, we are making significant strides:
- **Phase 1** strengthens the link between AI-generated subtasks and our core mind map node architecture.
- **Phase 2** focuses on grouping these subtasks effectively into Toit tasks, updating our API/Toit routes, and suggesting minimal schema enhancements.
- **Phase 3** is dedicated to iterative testing and planning for advanced, AI-driven improvements.

By following these steps, the development process remains manageable, testable, and responsive to user feedback.

*Remember: Regular manual testing and keeping the documentation up-to-date are vital as we expand the system's functionality.*

---

*End of Stage 2: Toit Dev Document*
