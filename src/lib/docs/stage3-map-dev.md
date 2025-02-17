# Stage 3: MindMap3D Development Plan

## Objective
This document outlines an iterative development plan to achieve a user interface where text flows along each tapered branch in our 3D mind map. The text should dynamically follow the curvature and tapering of a branch and update seamlessly when the branch is modified.

## Background
Two versions of the component exist:

- **MindMap3D.svelte:**  
  - Uses `TubeGeometry` for the branches which creates smooth curves but lacks tapering.
  - Positions text on flat planes with dynamic reorientation (using `lookAt`) toward the camera.

- **MindMap3D_TEST.svelte:**  
  - Implements a custom tapered branch using a `BufferGeometry` with variable radii.
  - Incorporates a "text aligner" helper (`THREE.Object3D`) to adjust text orientation, aligning it with a branch's tangent.
  - Although the tapered branch and text alignment ideas are promising, the final behavior is not yet fully "flowing" along the branch.

## Iterative Development & Testing Plan

### 1. Establish a Baseline: Ensure Proper Text Orientation
- **Goal:** **Guarantee the basic functionality** where text always faces the camera.
- **Approach:**
  - In your branch update functions, ensure that after repositioning the text mesh, it is reoriented with:
    ```js
    textMesh.lookAt(camera.position);
    ```
  - **Testing:** Manually drag nodes and observe that the text neither flips nor rotates unnaturally.

### 2. Implement and Test Tapered Branch Geometry
- **Goal:** **Integrate a naturally tapered branch geometry** that transitions smoothly from a wider parent node to a narrower child node.
- **Approach:**
  - Adapt the custom `BufferGeometry` approach from `MindMap3D_TEST.svelte`.
  - Define `startRadius` and `endRadius` for the branch and interpolate these values along the curve segments.
  - **Testing:** Validate visually that the branch tapers uniformly and smoothly.

### 3. Attach Text to the Branch Using a Helper Object
- **Goal:** **Ensure the text flows along the branch, following its curvature.**
- **Approach:**
  - Create a parent `THREE.Group` for each branch that holds both the branch geometry and its corresponding text mesh.
  - Add a helper `textAligner` object positioned at the midpoint of the branch. Use the branch's tangent to orient the aligner.
  - Make the text mesh a child of `textAligner` so it inherits and follows all transformations.
  - **Testing:** Drag nodes to update branches and confirm that the text moves with the branch, maintaining alignment and position relative to the branch's midpoint.

### 4. Advance to Curved Text Rendering
- **Goal:** **Render text that conforms to the branch's curve** rather than using a simple flat plane.
- **Approach:**
  - Consider deforming text geometry along the branch curve using a custom vertex shader or spline deformation.
  - Experiment with generating the text as vector shapes and applying spline-based deformation.
  - **Alternative:** Explore libraries like [Troika-3d-text](https://github.com/protectwise/troika/tree/master/packages/troika-3d-text), which specialize in advanced text rendering and may support curve deformation.
  - **Testing:** Confirm that text meshes appear naturally curved along the branch path and adjust dynamically as the branch changes.

### 5. Refactor & Consolidate Common Logic
- **Goal:** **Improve maintainability** by reducing duplication.
- **Approach:**
  - Extract shared functionalities such as scene setup, branch creation, text alignment, and cleanup into common utility functions or modules.
  - **Testing:** After refactoring, ensure that both component variants (if they continue to coexist) maintain their expected behaviors without regression.

### 6. Iterative Testing and Performance Validation
- **Goal:** **Ensure smooth performance and UI responsiveness** under dynamic changes.
- **Approach:**
  - Begin with a simple mind map with a few nodes and branches, gradually increasing the complexity.
  - Utilize browser dev tools to monitor performance (frame rate, memory usage) as the number of nodes increases.
  - Consider writing unit tests for key functions (e.g., branch geometry computation) to catch issues early.
  - **Testing:** Validate performance under different loads and adjust geometry or shader parameters as needed.

## Additional Resources & Further Learning
- **Three.js Documentation:**
  - [BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry)
  - [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- **Third-Party Libraries:**
  - [Troika-3d-text](https://github.com/protectwise/troika/tree/master/packages/troika-3d-text) for advanced text rendering.
- **Tutorials and Examples:**
  - Explore official Three.js examples and community projects on CodePen or GitHub.
  - Look up tutorials on custom shader development and spline deformation.

## Conclusion
By following this step-by-step plan, you will systematically integrate tapered branch geometries with dynamic, flowing text that adapts to branch curvature. This iterative approach, coupled with thorough testing and leveraging specialized libraries, will guide you toward achieving a refined and visually appealing mind map interface.

Happy coding and keep iterating!
