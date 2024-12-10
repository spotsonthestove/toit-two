## Purpose
Toit is a reason for taking time to do something.
There are things we have to do, and things we want to do.
Toit is a way to structure our lives, and to make sure we are doing the things we want to do.
There is the matter that there are important things but they aren't urgent so we never get to them.
Toit is a way to make sure we are doing the things we want to do.

## How
The idea of getting a round TOIT is to have some push to get started on a task.
Basically we take something that we enjoy or is a routine and we associate with a part of a thing that is really our passion and we have been procrastinating on.
One of the fundamental ideas is that we are not motivated by the things we want to do, but by the things we want to avoid.And that can cause some problems. We can get so caught up in avoiding the things we don't want to do that we never get to the things we do want to do.
At the core ot TOIT is to split the things we want to do into items that can be done in a short amount of time and items that take longer.
Or things that are a struggle and things that are easy.

## AI
The reason we want to have a sprinkle of AI here is that it can help us to identify the things we want to do and to help us to get started on them. By splitting the things we want to do into items that can be done in a short amount of time and items that take longer.
Or things that are a struggle and things that are easy.

## How to use
I feel the idea of a mind map is a good way to use TOIT.
It can help to pick up splitting up the things we want to do into items that can be done in a short amount of time and items that take longer.
Or things that are a struggle and things that are easy.
And that there needs to be a nature to the UI that changes depending on the context. or the mood.
So that sometimes a basic list is all we need, and sometimes we need a mind map.

## Node Data Management
The mind map nodes need to capture more detailed information beyond their spatial relationships. Each node should:

### Data Structure
- Maintain its spatial position (x, y, z coordinates)
- Store content/title
- Store detailed description
- Track node type (task, concept, note)
- Reference parent node (if applicable)
- Track creation timestamp

### User Interface Requirements
1. Modal Form Interface
   - Glassmorphic design consistent with app theme
   - Opens when:
     - Creating new node
     - Double-clicking existing node
     - Using dedicated edit button
   - Positioned relative to node location

2. Form Fields
   - Title/Content (required)
   - Description (optional)
   - Node Type selector
   - Parent Node selector (if applicable)
   - Position coordinates (read-only display)

3. Interaction Flow
   - Modal appears above mind map but doesn't block view
   - Form should be accessible via keyboard navigation
   - Changes should update both visual representation and database
   - Real-time validation with helpful feedback
   - Smooth transitions for opening/closing

4. Technical Integration
   - Separate component from MindMap3D
   - Shares state via Svelte stores
   - Updates Supabase database
   - Maintains consistency between visual and data representations
   - Handles concurrent edits gracefully

5. Accessibility Considerations
   - Keyboard navigation support
   - ARIA labels and roles
   - Focus management
   - High contrast mode support
   - Screen reader friendly
