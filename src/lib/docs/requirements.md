# Project Requirements

## Project Overview

- **Purpose**: The application aims to help users organize their tasks and ideas using mind maps, integrating task management with a visual representation of concepts and notes.
- **Target Audience**: The app is designed for individuals and teams looking to enhance productivity and organization through visual task management.

## Core Features

### Mind Map Creation

The mind map feature will be developed using Three.js to create an interactive 3D environment where users can visualize and organize their tasks and ideas. The design and functionality will be inspired by the visual reference provided in `mindmap-example.png` and the existing code in `MindMap3D.svelte`. Key aspects of the mind map creation include:

- **3D Visualization**: The mind map will be rendered in a 3D space, allowing users to navigate and interact with nodes using intuitive controls. This will be achieved using Three.js, a powerful library for 3D graphics in the browser.

- **Node Structure**: Nodes will represent tasks, concepts, or notes. Each node will have properties such as position (x, y, z coordinates), title, description, and type (e.g., 'concept' for central nodes and 'note' for child nodes). Nodes will be visually represented as spheres, with central nodes being larger and distinct in color.

- **Interactivity**: Users will be able to drag nodes to reposition them, with real-time updates to the connections (branches) between nodes. The `OrbitControls` and `DragControls` from Three.js will be used to facilitate smooth navigation and interaction.

- **Branching and Relationships**: Nodes will be connected by branches, which are dynamically generated using bezier curves to create organic-looking connections. The branches will update automatically as nodes are moved, maintaining the hierarchical structure of the mind map.

- **User Interface Integration**: A modal form will allow users to edit node details such as title, description, and type. This form will be accessible via double-clicking a node or using a dedicated edit button, ensuring a seamless user experience.

- **Accessibility and Usability**: The mind map will support keyboard navigation and include ARIA labels for accessibility. The design will be responsive, adapting to different screen sizes and devices.

- **Real-time Collaboration**: The mind map will support real-time collaboration, allowing multiple users to work on the same map simultaneously. This will be implemented using Supabase's real-time capabilities, ensuring that changes are synchronized across all users.

- **Performance Optimization**: Efficient rendering and interaction handling will be prioritized to ensure smooth performance, even with complex mind maps. Techniques such as geometry instancing and optimized event handling will be employed.

By leveraging Three.js and integrating with the existing Svelte components, the mind map feature will provide a rich, interactive experience for users, enhancing their ability to organize and visualize their ideas effectively.

### Task Management

Integrate task tracking within mind maps, allowing users to manage tasks visually.

### User Authentication

Secure user login and registration using Supabase Auth.

### Real-time Collaboration

Allow multiple users to collaborate on mind maps in real-time.

### Cross-Platform Support

Develop the app for both web and iOS platforms.

## Technical Stack

- **Frontend**: SvelteKit with Tailwind CSS and Shadcn-Svelte for UI components.
- **Backend**: Supabase for authentication and PostgreSQL database.
- **Hosting**: Cloudflare for web hosting.
- **Mobile**: SwiftUI and SceneKit for iOS.
- **API**: Cloudflare Workers-based API for both web and mobile communication.

## API Implementation Using Cloudflare Workers

To maintain consistency and security, a Cloudflare Worker-based API will handle all communication between the frontend (web and iOS) and Supabase. This API will be embedded within the SvelteKit application and deployed as a Cloudflare Worker, offering:

- **Unified Access**: A single API for both web and iOS applications.
- **Security**: Prevents direct access to Supabase, adding extra authentication and validation layers.
- **Performance Optimization**: Cloudflare's edge network ensures fast responses.
- **Cloudflare AI Integration**: Exposes AI processing endpoints for advanced task management.

### API Structure

The API will reside under `src/routes/api/` in the SvelteKit project, handling:

```
/src/routes/api/
    ├── auth.ts        (Handles login, signup via Supabase)
    ├── data.ts        (Fetches data from Supabase)
    ├── ai.ts          (Cloudflare AI endpoints)
    ├── index.ts       (API docs or default endpoint)
```

The iOS app will interact with this API via HTTP requests instead of using the Supabase Swift SDK, ensuring centralized logic and easier maintenance.

### Example API Usage in iOS

```swift
let url = URL(string: "https://your-cloudflare-worker-url/api/data")!
var request = URLRequest(url: url)
request.httpMethod = "GET"
URLSession.shared.dataTask(with: request) { data, response, error in
    // Handle response
}.resume()
```

## Development Stages

- **Stage 1: Core Mind Map Implementation** ✓
  - Set up the development environment with SvelteKit and Supabase
  - Implement 3D mind map visualization and interaction
  - Basic task management integration
- **Stage 2: AI Integration and Enhanced Task Management**
  - Implement AI-powered task decomposition and suggestions
  - Integrate document processing capabilities
  - Develop semantic analysis features
  - Enhance task management with AI insights
- **Stage 3: Real-time Collaboration and UI Enhancement**
  - Enable simultaneous editing and collaboration
  - Implement conflict resolution
  - Optimize user interface and experience
  - Refine accessibility features
- **Stage 4: Cross-Platform Development and Deployment**
  - Adapt web app for iOS compatibility
  - Implement Cloudflare Worker-based API for mobile communication
  - Conduct comprehensive testing
  - Deploy to production environments
  - Establish support and feedback channels

## Future Enhancements

- **AI Integration**: Explore AI features to suggest task prioritization or mind map organization.
- **Advanced Analytics**: Provide users with insights into their productivity and task completion trends.

## Documentation and Support

- Maintain comprehensive documentation for developers and users.
- Provide support channels for user feedback and issue resolution.

## AI Integration and Advanced Features

### AI-Powered Task Management

- **Task Decomposition**: Leverage Cloudflare AI to automatically break down complex tasks into manageable subtasks.
- **Semantic Analysis**: Use AI to identify relationships between tasks and suggest optimal task sequences.
- **Document Processing**:
  - Extract key insights from uploaded PDFs
  - Generate task suggestions based on document content
  - Create mind map nodes from document structure

### AI Integration Technologies

- **AI Processing**: Cloudflare Workers AI
- **Vector Storage Options**:
  1. Cloudflare Vectorize
  2. Supabase pgvector
- **Supported AI Capabilities**:
  - Natural language task parsing
  - Semantic similarity detection
  - Intelligent task prioritization
  - Context-aware task recommendations

