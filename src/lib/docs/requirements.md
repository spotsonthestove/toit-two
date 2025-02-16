# Project Requirements

## Project Overview

- **Purpose**: The application aims to help users organize their tasks and ideas using mind maps, integrating task management with a visual representation of concepts and notes. With ongoing enhancements, the app now supports both iOS and web platforms.
- **Target Audience**: The app is designed for individuals and teams looking to enhance productivity and organization through dynamic, intelligent task management.

## Core Features

### Mind Map Creation

- **3D Visualization**: The mind map is rendered in a 3D space via Three.js, allowing users to navigate and interact with nodes intuitively.
- **Node Structure**: 
  - Nodes represent tasks, concepts, or notes.
  - Each node contains spatial data (x, y, z coordinates), title, description, and a type (e.g., 'concept' for central nodes and 'note' for child nodes).
- **Interactivity**: Nodes can be dragged and repositioned, with branches updating in real time.
- **Branching and Relationships**: 
  - Dynamically generated, organic-looking connections (branches) using bezier curves.
  - The hierarchical relationship is maintained through the parent–child node structure.
- **User Interface Integration**: 
  - A modal form (accessible via double-click or edit button) allows users to modify node details seamlessly.
- **Accessibility and Usability**: 
  - Supports keyboard navigation and ARIA labels to meet accessibility standards.
- **Real-time Collaboration**: 
  - Multiple users can edit the same map concurrently with changes synchronized in real time.
- **Performance Optimization**: 
  - Techniques like geometry instancing and optimized event handling ensure smooth interactions.

### Task Management and Tuit Task Integration

- **Task Splitting with AI**: 
  - The web app now employs AI to divide complex tasks into manageable subtasks.
  - Once split, each subtask is inserted into the database as a mind map node.
  - Tasks originating from AI splitting are integrated as Toit tasks and are linked to a central visual node (of type 'concept'), with the resulting subtasks represented as child nodes (of type 'note').
- **Dynamic Viewing Options**:
  - Users can view their tasks as part of the mind map or switch to a more traditional list view, depending on their preference.
  - This flexibility allows for a dynamic user experience that adapts to different task management workflows.

### User Authentication

- Secure user login and registration using Supabase Auth.

### Real-time Collaboration

- Multiple users can collaborate on mind maps simultaneously.

### Cross-Platform Support

- **iOS App**: 
  - The iOS version is fully operational with basic mind mapping, database connectivity, authentication, and mind map retrieval.
- **Web App**:
  - The web app is progressing, with a working implementation of basic AI task splitting and dynamic view options.

## Technical Stack

- **Frontend**: SvelteKit with Tailwind CSS and Shadcn-Svelte for UI components.
- **Backend**: Supabase for authentication and PostgreSQL database.
- **Hosting**: Cloudflare for web hosting.
- **Mobile**: SwiftUI and SceneKit for iOS.
- **API**: Cloudflare Workers-based API for unified communication between web and mobile platforms.

## API Implementation Using Cloudflare Workers

To maintain consistency and security, the API will:

- Provide unified access for both web and iOS apps.
- Prevent direct access to Supabase by adding authentication/validation layers.
- Leverage Cloudflare's edge network for fast responses.
- Expose endpoints for AI processing, facilitating advanced task management functionalities.

The API endpoints reside under `src/routes/api/` and include routes such as:
```
/src/routes/api/
    ├── auth.ts        (Handles login, signup via Supabase)
    ├── data.ts        (Fetches data from Supabase)
    ├── ai.ts          (Cloudflare AI endpoints)
    ├── index.ts       (API docs or default endpoint)
```

## Development Stages

- **Stage 1: Core Mind Map Implementation** ✓
  - Set up the development environment with SvelteKit and Supabase.
  - Implement basic 3D mind map visualization and interactivity.
  - Basic task management integration is already working in the iOS app.
- **Stage 2: AI Integration and Enhanced Task Management**
  - Refine AI-powered task splitting:
    - Tasks are automatically decomposed into subtasks.
    - Subtasks are linked as mind map nodes, integrated as Tuit tasks.
  - Enhance UI to support dynamic views (mind map vs. list view).
- **Stage 3: Real-time Collaboration and UI Enhancement**
  - Enable simultaneous editing with conflict resolution.
  - Optimize the overall UI and improve accessibility.
- **Stage 4: Cross-Platform Development and Deployment**
  - Improve integration for the web app to further align with the iOS functionality.
  - Deploy a unified Cloudflare Worker-based API.
  - Conduct comprehensive testing and deploy to production.
  - Establish user support and feedback channels.

## Future Enhancements

- **AI Integration**:
  - Continued refinement of features such as intelligent task prioritization, semantic analysis, and task decomposition.
  - AI-driven document processing:
    - Analyze and vectorize documents (like PDFs) to automatically generate corresponding mind maps.
- **Advanced Analytics**:
  - Provide detailed productivity insights and task completion trends.
- **Suggested Schema Updates and Integrations**:
  - **Mind Map Nodes Augmentation**: 
    - Consider adding fields (such as an origin task ID or AI-generated flag) to better track the provenance of each node.
    - This is a suggested enhancement for future iterations and does not affect the current schema.
  - **Tuit Task Linking**: 
    - Improve relationships between Tuit tasks and mind map nodes to ensure seamless data synchronization.
- **Dynamic Views**:
  - Enhance UI controls to allow users to switch effortlessly between a detailed mind map and a simplified list view, catering to various productivity workflows.

## Documentation and Support

- Maintain comprehensive documentation for both developers and users.
- Provide support channels for user feedback and issue resolution.

## AI Integration and Advanced Features

### AI-Powered Task Management

- **Task Decomposition**: 
  - Leverage Cloudflare AI to automatically break down complex tasks into manageable subtasks.
  - AI task splitting now creates associated mind map nodes and integrates them into Tuit sessions.
- **Semantic Analysis and Vectorization**:
  - Use AI to analyze task relationships and suggest optimal sequences.
  - Future plans include the vectorization of uploaded documents (e.g., PDFs) to generate corresponding mind maps.
- **Document Processing**:
  - Extract key insights from documents.
  - Convert document structure into mind map nodes, enriching the visual and data-driven aspects of the app.

