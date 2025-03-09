# UI Development v2: Mind Map Visualization Enhancement

This document outlines the implementation plan for enhancing the 3D mind map visualization component with dynamic theming capabilities, auto-arrangement features, and improved user experience. It serves as a guide for the next AI engineer to implement these features.

## 1. Auto-Arrangement Features

The MindMap3D component currently lacks automatic node arrangement capabilities, requiring manual positioning of nodes. We need to implement several intuitive layout algorithms to automatically arrange nodes in visually appealing patterns.

### 1.1 Layout Algorithms

#### Radial Layout
- Places the central node at the origin
- Arranges child nodes in concentric circles
- Nodes at the same hierarchical level appear on the same circle
- Spacing increases with each level from center

```typescript
function applyRadialLayout() {
  // Find center node
  // Group nodes by hierarchical level
  // For each level, arrange nodes in a circle
  // Update branches and node positions
}
```

#### Force-Directed Layout (✅ Implemented)
- Uses physics simulation for natural node positioning
- Implements forces of attraction between connected nodes
- Applies repulsion between all nodes to prevent overlap
- Adds center attraction to maintain cohesive structure

```typescript
function applyForceDirectedLayout() {
  // Create simulation objects for each node
  // Apply repulsion forces between all nodes
  // Apply attraction forces between connected nodes
  // Apply center attraction for non-center nodes
  // Run simulation for fixed iterations
}
```

**Implementation Status:** Complete. The force-directed layout has been successfully implemented with three key forces (repulsion, attraction, and center attraction). The implementation includes proper database integration to save node positions and UI controls for applying the layout.

**Key Insights:**
- Force parameters require careful tuning for optimal results
- Damping is essential for stable layouts
- Fixed center node provides better stability
- Existing branch update mechanism handles layout changes well
- Performance considerations for larger mind maps should be addressed in future iterations

#### Tree Layout
- Arranges nodes in a traditional hierarchical tree
- Supports both vertical and horizontal orientations
- Maintains consistent spacing between levels
- Centers parent nodes above their children

```typescript
function applyTreeLayout(horizontal = false) {
  // Build tree structure from nodes
  // Position nodes recursively based on hierarchy
  // Adjust spacing to prevent overlap
  // Update branches and node positions
}
```

#### Spiral Layout
- Arranges nodes in an expanding spiral pattern
- Provides space-efficient visualization
- Creates visually interesting patterns
- Maintains proximity between related nodes

```typescript
function applySpiralLayout() {
  // Position center node at origin
  // Arrange non-center nodes along spiral path
  // Control spiral tightness and vertical rise
  // Update branches and node positions
}
```

### 1.2 User Interface Integration

Provide a control panel for users to select and apply different layouts:

```typescript
// Add these functions to your component
export function applyLayout(layoutType) {
    switch(layoutType) {
        case 'radial':
            applyRadialLayout();
            break;
        case 'force':
            applyForceDirectedLayout();
            break;
        case 'tree-vertical':
            applyTreeLayout(false);
            break;
        case 'tree-horizontal':
            applyTreeLayout(true);
            break;
        case 'spiral':
            applySpiralLayout();
            break;
        default:
            console.warn('Unknown layout type:', layoutType);
    }
}
```

**Implementation Status:** Partially complete. The layout selection function has been implemented, but currently only supports the force-directed layout. The UI integration includes a "Layout Options" panel with an "Apply Force Layout" button. Additional layout options will be added as they are implemented.

```svelte
<div class="glass-panel p-4">
  <h3 class="text-foreground mb-4">Layout Options</h3>
  <button on:click={() => mindMapComponent?.applyLayout('force')} class="btn-secondary w-full mb-2">
    Apply Force Layout
  </button>
  <p class="text-sm text-muted-foreground">
    Note: This will rearrange nodes but their positions will be saved to the database when you save the mind map.
  </p>
</div>
```

## 2. Theme Integration with Three.js

Based on the existing theming system documented in ui-dev-v2-themes.md, we need to extend the Focus/Feeling controls to affect the 3D mind map visualization. This will create a cohesive experience where the entire application responds to theme changes.

### 2.1 ThreeJS Theme Integration

The MindMap3D component should respond to the same Focus/Feeling dimensions that control the rest of the UI:

#### Focus Dimension (1-10) Effects on Mind Map:
- **Node Density**: Higher focus values create more compact layouts
- **Text Detail**: Higher focus shows more detailed text at smaller sizes
- **Animation Speed**: Higher focus reduces animation duration
- **Branch Thickness**: Higher focus creates thinner, more precise branches
- **Shadow Intensity**: Higher focus increases shadow contrast

#### Feeling Dimension (1-10) Effects on Mind Map:
- **Color Saturation**: Higher feeling increases color vibrancy
- **Node Shape Organicity**: Higher feeling creates more organic, less geometric nodes
- **Branch Curvature**: Higher feeling creates more curved, flowing branches
- **Decorative Elements**: Higher feeling adds particle effects and glows
- **Background Texture**: Higher feeling adds subtle background patterns

### 2.2 Implementation Approach

#### 2.2.1 Theme Store Integration

Connect the MindMap3D component to the existing theme store:

```typescript
// In MindMap3D.svelte
import { focusLevel, feelingLevel } from '$lib/stores/themeStore';

// Subscribe to theme changes
let unsubscribeFocus: () => void;
let unsubscribeFeeling: () => void;

onMount(() => {
  unsubscribeFocus = focusLevel.subscribe(value => {
    updateFocusEffects(value);
  });
  
  unsubscribeFeeling = feelingLevel.subscribe(value => {
    updateFeelingEffects(value);
  });
});

onDestroy(() => {
  if (unsubscribeFocus) unsubscribeFocus();
  if (unsubscribeFeeling) unsubscribeFeeling();
});

// Update functions
function updateFocusEffects(focusValue: number) {
  // Update node density, text detail, animation speed, etc.
}

function updateFeelingEffects(feelingValue: number) {
  // Update color saturation, node shape, branch curvature, etc.
}
```

#### 2.2.2 Theme-Responsive Materials

Create materials that respond to theme changes:

```typescript
function createNodeMaterial(nodeData: MindMapNode, $focusLevel: number, $feelingLevel: number) {
  // Base color from node type or theme
  const baseColor = nodeData.isCenter ? 0x4CAF50 : 0x00ff00;
  
  // Adjust saturation based on feeling level
  const saturation = $feelingLevel / 10;
  const color = adjustColorSaturation(baseColor, saturation);
  
  // Create material with theme-responsive properties
  const material = new THREE.MeshPhongMaterial({ 
    color: color,
    emissive: 0x000000,
    shininess: 100 - ($feelingLevel * 5), // More organic at higher feeling
    flatShading: $feelingLevel > 7 // Geometric at low feeling, organic at high
  });
  
  return material;
}

function createBranchMaterial($focusLevel: number, $feelingLevel: number) {
  // Adjust opacity and color based on theme
  const opacity = 0.7 + ($feelingLevel * 0.02);
  const shininess = 30 - ($feelingLevel * 2);
  
  return new THREE.MeshPhongMaterial({ 
    color: 0xff0000,
    transparent: true,
    opacity: opacity,
    shininess: shininess
  });
}
```

#### 2.2.3 Theme-Responsive Geometry

Adjust geometry based on theme values:

```typescript
function createNodeGeometry(isCenter: boolean, $focusLevel: number, $feelingLevel: number) {
  // Base size adjustments
  const size = isCenter ? 0.75 : 0.5;
  const detail = Math.max(16, Math.floor(16 + ($feelingLevel * 1.6))); // More detailed at higher feeling
  
  // Choose geometry based on feeling level
  if ($feelingLevel <= 3) {
    // Low feeling: More geometric (cube/octahedron)
    return new THREE.BoxGeometry(size, size, size);
  } else if ($feelingLevel <= 7) {
    // Medium feeling: Sphere with medium detail
    return new THREE.SphereGeometry(size, detail, detail);
  } else {
    // High feeling: Organic shape (icosahedron or custom)
    return new THREE.IcosahedronGeometry(size, Math.floor($feelingLevel / 3));
  }
}

function createBranchGeometry(startPoint, endPoint, midPoint, $focusLevel: number, $feelingLevel: number) {
  // Adjust curve complexity based on feeling
  const curveSegments = Math.max(20, Math.floor(20 + ($feelingLevel * 4)));
  
  // Adjust thickness based on focus
  const startRadius = 0.08 - (($focusLevel - 5) * 0.005);
  const endRadius = 0.03 - (($focusLevel - 5) * 0.002);
  
  // Create points with varying curvature based on feeling
  const points = [];
  for (let i = 0; i <= curveSegments; i++) {
    const t = i / curveSegments;
    const point = new THREE.Vector3();
    
    // Higher feeling = more curved paths
    const curveFactor = 0.5 + (($feelingLevel - 5) * 0.05);
    midPoint.y += ($feelingLevel * 0.05);
    
    point.x = startPoint.x * (1 - t) * (1 - t) + midPoint.x * 2 * (1 - t) * t * curveFactor + endPoint.x * t * t;
    point.y = startPoint.y * (1 - t) * (1 - t) + midPoint.y * 2 * (1 - t) * t * curveFactor + endPoint.y * t * t;
    point.z = startPoint.z * (1 - t) * (1 - t) + midPoint.z * 2 * (1 - t) * t * curveFactor + endPoint.z * t * t;
    points.push(point);
  }
  
  // Create custom geometry with theme-responsive properties
  // ... (existing custom geometry code with theme adjustments)
}
```

#### 2.2.4 Theme-Responsive Text

Adjust text appearance based on theme:

```typescript
function createTextMaterial(text: string, $focusLevel: number, $feelingLevel: number) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 128;
  
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Adjust font size based on focus (smaller at higher focus)
    const fontSize = Math.max(36, 56 - ($focusLevel * 2));
    const fontWeight = $focusLevel >= 7 ? 'bold' : 'normal';
    
    // Font style based on theme
    const fontFamily = $feelingLevel <= 3 ? 
      'monospace' : // Low feeling: Utilitarian
      ($feelingLevel >= 8 ? 
        'cursive' : // High feeling: Playful
        'Arial'); // Medium feeling: Balanced
    
    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Text styling based on theme
    const outlineWidth = Math.max(3, 5 - ($focusLevel * 0.3));
    const outlineOpacity = 0.6 - (($focusLevel - 5) * 0.05);
    
    // Add text outline for contrast
    context.strokeStyle = `rgba(255, 255, 255, ${outlineOpacity})`;
    context.lineWidth = outlineWidth;
    context.strokeText(text, canvas.width / 2, canvas.height / 2);
    
    // Text color based on focus (darker at higher focus)
    const textBrightness = Math.max(10, 34 - ($focusLevel * 2));
    context.fillStyle = `rgb(${textBrightness}, ${textBrightness}, ${textBrightness})`;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Add decorative elements at high feeling
    if ($feelingLevel >= 8) {
      // Add subtle decorative underline or glow
      const glowColor = `rgba(255, 255, 255, ${($feelingLevel - 7) * 0.1})`;
      context.shadowColor = glowColor;
      context.shadowBlur = ($feelingLevel - 7) * 5;
      context.strokeText(text, canvas.width / 2, canvas.height / 2);
      context.shadowBlur = 0;
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    alphaTest: 0.1
  });
}
```

#### 2.2.5 Theme-Responsive Environment

Adjust scene environment based on theme:

```typescript
function updateSceneEnvironment($focusLevel: number, $feelingLevel: number) {
  // Background color based on theme
  const bgBrightness = Math.max(150, 204 - ($focusLevel * 5));
  scene.background = new THREE.Color(`rgb(${bgBrightness}, ${bgBrightness}, ${bgBrightness})`);
  
  // Lighting adjustments
  ambientLight.intensity = 0.4 - (($focusLevel - 5) * 0.03);
  directionalLight.intensity = 0.5 + (($focusLevel - 5) * 0.05);
  
  // Add fog at high feeling levels for atmosphere
  if ($feelingLevel >= 7) {
    const fogDensity = ($feelingLevel - 6) * 0.01;
    scene.fog = new THREE.FogExp2(scene.background, fogDensity);
  } else {
    scene.fog = null;
  }
  
  // Add particle effects at high feeling levels
  if ($feelingLevel >= 8 && !particleSystem) {
    createParticleSystem($feelingLevel);
  } else if (particleSystem) {
    updateParticleSystem($feelingLevel);
  }
}
```

### 2.3 Theme Presets for Mind Map

Create specialized presets for the mind map visualization:

```typescript
const MIND_MAP_PRESETS = {
  ANALYTICAL: { 
    focus: 8, 
    feeling: 2, 
    name: 'Analytical',
    description: 'Clean, precise visualization with straight lines and clear text'
  },
  BALANCED: { 
    focus: 5, 
    feeling: 5, 
    name: 'Balanced',
    description: 'Moderate styling with good readability and some visual interest'
  },
  CREATIVE: { 
    focus: 3, 
    feeling: 8, 
    name: 'Creative',
    description: 'Organic shapes, flowing connections, and decorative elements'
  },
  EVANGELION: {
    focus: 9,
    feeling: 2,
    name: 'Evangelion',
    description: 'Terminal-like visualization with monospace text and technical styling'
  }
};
```

## 3. Performance Optimizations

The current MindMap3D implementation has several areas where performance can be improved, especially when handling large mind maps or applying theme changes.

### 3.1 Geometry and Material Pooling

Implement object pooling to reduce garbage collection:

```typescript
// Material and geometry pools
const geometryPool = {
  sphere: {},  // Indexed by size and detail
  box: {},     // Indexed by size
  icosahedron: {} // Indexed by size and detail
};

const materialPool = {
  node: {},    // Indexed by color and properties
  branch: {},  // Indexed by color and opacity
  text: {}     // Indexed by text content (limited pool size)
};

// Get or create geometry
function getNodeGeometry(type, size, detail) {
  const key = `${size}-${detail}`;
  if (!geometryPool[type][key]) {
    // Create and store new geometry
    switch(type) {
      case 'sphere':
        geometryPool[type][key] = new THREE.SphereGeometry(size, detail, detail);
        break;
      case 'box':
        geometryPool[type][key] = new THREE.BoxGeometry(size, size, size);
        break;
      case 'icosahedron':
        geometryPool[type][key] = new THREE.IcosahedronGeometry(size, detail);
        break;
    }
  }
  return geometryPool[type][key];
}

// Similar functions for materials
```

### 3.2 Level of Detail (LOD)

Implement LOD for nodes based on camera distance:

```typescript
function createNodeWithLOD(position, nodeData, $focusLevel, $feelingLevel) {
  const lod = new THREE.LOD();
  
  // High detail for close viewing
  const highDetailGeometry = createNodeGeometry(nodeData.isCenter, $focusLevel, $feelingLevel);
  const highDetailMaterial = createNodeMaterial(nodeData, $focusLevel, $feelingLevel);
  const highDetailMesh = new THREE.Mesh(highDetailGeometry, highDetailMaterial);
  
  // Medium detail for medium distance
  const mediumDetailGeometry = createNodeGeometry(nodeData.isCenter, $focusLevel, Math.max(1, $feelingLevel - 3));
  const mediumDetailMaterial = createNodeMaterial(nodeData, $focusLevel, Math.max(1, $feelingLevel - 3));
  const mediumDetailMesh = new THREE.Mesh(mediumDetailGeometry, mediumDetailMaterial);
  
  // Low detail for far viewing
  const lowDetailGeometry = new THREE.SphereGeometry(nodeData.isCenter ? 0.75 : 0.5, 8, 8);
  const lowDetailMaterial = new THREE.MeshBasicMaterial({ color: nodeData.isCenter ? 0x4CAF50 : 0x00ff00 });
  const lowDetailMesh = new THREE.Mesh(lowDetailGeometry, lowDetailMaterial);
  
  // Add levels to LOD
  lod.addLevel(highDetailMesh, 0);    // Use high detail when close
  lod.addLevel(mediumDetailMesh, 5);  // Switch to medium at distance 5
  lod.addLevel(lowDetailMesh, 15);    // Switch to low at distance 15
  
  lod.position.copy(position);
  lod.userData = nodeData;
  
  return lod;
}
```

### 3.3 Frustum Culling and Occlusion

Implement frustum culling to avoid rendering off-screen objects:

```typescript
function updateVisibility() {
  // Create frustum from camera
  const frustum = new THREE.Frustum();
  const matrix = new THREE.Matrix4().multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  frustum.setFromProjectionMatrix(matrix);
  
  // Check each node against frustum
  threeNodes.forEach(node => {
    const nodeVisible = frustum.containsPoint(node.position);
    node.visible = nodeVisible;
    
    // Also update related branches
    branches.forEach(branch => {
      if (branch.startNode === node || branch.endNode === node) {
        branch.branch.visible = branch.startNode.visible && branch.endNode.visible;
        branch.textMesh.visible = branch.branch.visible;
      }
    });
  });
}
```

### 3.4 Batch Updates

Batch updates to avoid unnecessary recalculations:

```typescript
// Throttle update functions
const throttledUpdateBranches = throttle(updateBranches, 100);
const throttledUpdateNodePositions = throttle(updateNodePositions, 100);

// Throttle implementation
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

## 4. User Experience Enhancements

### 4.1 Node Selection and Highlighting

Improve node selection feedback:

```typescript
function highlightNode(node, isSelected) {
  if (node && node.material instanceof THREE.MeshPhongMaterial) {
    if (isSelected) {
      // Store original color
      node.userData.originalColor = node.material.color.getHex();
      
      // Apply highlight effect
      node.material.emissive.setHex(0x555555);
      node.material.color.setHex(0x00BFFF); // Highlight color
      
      // Scale up slightly
      node.scale.set(1.2, 1.2, 1.2);
    } else {
      // Restore original appearance
      if (node.userData.originalColor) {
        node.material.color.setHex(node.userData.originalColor);
      }
      node.material.emissive.setHex(0x000000);
      node.scale.set(1, 1, 1);
    }
  }
}
```

### 4.2 Camera Controls Enhancement

Improve camera controls for better navigation:

```typescript
function setupEnhancedControls() {
  // Improved orbit controls
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.1;
  orbitControls.rotateSpeed = 0.7;
  orbitControls.zoomSpeed = 1.2;
  orbitControls.panSpeed = 0.8;
  
  // Add double-click to focus on node
  renderer.domElement.addEventListener('dblclick', (event) => {
    // Raycast to find clicked node
    const node = findNodeUnderMouse(event);
    if (node) {
      focusCameraOnNode(node);
    }
  });
  
  // Add keyboard navigation
  window.addEventListener('keydown', (event) => {
    switch(event.key) {
      case 'Home':
        resetCameraPosition();
        break;
      case '+':
      case '=':
        zoomIn();
        break;
      case '-':
      case '_':
        zoomOut();
        break;
      // Add more keyboard shortcuts
    }
  });
}

function focusCameraOnNode(node) {
  // Calculate target position
  const targetPosition = node.position.clone();
  
  // Calculate camera position
  const offset = new THREE.Vector3(0, 0, 5); // Offset from node
  const cameraTargetPosition = targetPosition.clone().add(offset);
  
  // Animate camera movement
  new TWEEN.Tween(camera.position)
    .to(cameraTargetPosition, 1000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .start();
    
  // Animate orbit controls target
  new TWEEN.Tween(orbitControls.target)
    .to(targetPosition, 1000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .start();
}
```

### 4.3 Node Grouping and Filtering

Add ability to group and filter nodes:

```typescript
// Node grouping by type or other properties
function groupNodesByProperty(property) {
  // Get unique property values
  const uniqueValues = [...new Set(
    $nodesStore.map(node => node[property])
  )];
  
  // Apply different colors to each group
  const colorMap = generateColorMap(uniqueValues.length);
  
  // Update node colors
  threeNodes.forEach(node => {
    const propertyValue = node.userData[property];
    const groupIndex = uniqueValues.indexOf(propertyValue);
    if (groupIndex >= 0 && node.material instanceof THREE.MeshPhongMaterial) {
      node.material.color.setHex(colorMap[groupIndex]);
    }
  });
  
  // Update legend
  updateGroupLegend(uniqueValues, colorMap, property);
}

// Node filtering
function filterNodesByProperty(property, value) {
  threeNodes.forEach(node => {
    const matches = node.userData[property] === value;
    
    // Set visibility
    node.visible = matches;
    
    // Update related branches
    branches.forEach(branch => {
      if (branch.startNode === node || branch.endNode === node) {
        const bothNodesVisible = branch.startNode.visible && branch.endNode.visible;
        branch.branch.visible = bothNodesVisible;
        branch.textMesh.visible = bothNodesVisible;
      }
    });
  });
}
```

### 4.4 Search and Navigation

Add search functionality:

```typescript
function searchNodes(query) {
  // Normalize query
  const normalizedQuery = query.toLowerCase().trim();
  
  // Find matching nodes
  const matchingNodes = threeNodes.filter(node => {
    const title = (node.userData.title || '').toLowerCase();
    const description = (node.userData.description || '').toLowerCase();
    return title.includes(normalizedQuery) || description.includes(normalizedQuery);
  });
  
  if (matchingNodes.length > 0) {
    // Highlight matching nodes
    threeNodes.forEach(node => highlightNode(node, false));
    matchingNodes.forEach(node => highlightNode(node, true));
    
    // Focus camera on first match
    focusCameraOnNode(matchingNodes[0]);
    
    // Return results for UI
    return matchingNodes.map(node => ({
      id: node.userData.id,
      title: node.userData.title,
      description: node.userData.description
    }));
  }
  
  return [];
}
```

## 5. Implementation Roadmap

### Phase 1: Auto-Arrangement Features
1. Implement basic layout algorithms (radial, tree, force-directed)
2. Create layout control UI
3. Add smooth transitions between layouts
4. Test with various mind map structures

### Phase 2: Theme Integration
1. Connect MindMap3D to theme store
2. Implement theme-responsive materials and geometries
3. Create theme-responsive text rendering
4. Add environment effects based on theme
5. Test theme transitions and presets

### Phase 3: Performance Optimizations
1. Implement geometry and material pooling
2. Add level of detail (LOD) for nodes
3. Implement frustum culling
4. Optimize batch updates
5. Profile and optimize render loop

### Phase 4: User Experience Enhancements
1. Improve node selection and highlighting
2. Enhance camera controls
3. Add node grouping and filtering
4. Implement search functionality
5. Add keyboard shortcuts and navigation aids

### Phase 5: Testing and Refinement
1. Test with large mind maps (100+ nodes)
2. Optimize for mobile devices
3. Add accessibility features
4. Refine theme integration
5. Document API and usage

## 6. Theme Integration Analysis

Based on the existing theming system documented in ui-dev-v2-themes.md and the development journal, we've identified several opportunities to enhance the MindMap3D component with theme responsiveness.

### 6.1 Current Theme System Analysis

The current theme system uses:
- Focus/Feeling dimensions to control UI density, contrast, and styling
- CSS variables for dynamic property updates
- Theme classes for major visual changes
- Smooth transitions between states

Key challenges for Three.js integration:
1. Three.js doesn't use CSS variables directly
2. Material and geometry updates are more expensive than CSS changes
3. Theme transitions need to be synchronized with the rest of the UI
4. Performance considerations for large mind maps

### 6.2 Theme Transition Issues

From the development journal (2024-05-15), we identified several issues with theme transitions:

1. **Theme Switching Flicker**:
   - Elements temporarily show incorrect theme during transition
   - Background and styling occasionally fade back to previous state
   - Timing issues with CSS variable updates

2. **Theme Element Mixing**:
   - Some components retain previous theme's styling
   - Incomplete cleanup of theme classes
   - Need for more robust class management

These issues will need to be addressed in the Three.js integration to ensure smooth transitions.

### 6.3 Evangelion Theme Integration

The Evangelion theme (from ui-dev-v2-themes.md) provides a good example of how to create a distinctive visual style:

```css
.theme-evangelion {
  /* Base colors inspired by Evangelion anime */
  --color-primary: #6B3E26; /* Eva-01 purple-green */
  --color-background: #1A1A1A; /* Dark background */
  --color-text: #F0F0F0; /* Light text */
  --color-accent: #EC5252; /* NERV red */
  /* ... more variables ... */
}
```

For the MindMap3D component, we should create a similar set of theme-specific overrides:

```typescript
// Evangelion theme for MindMap3D
function applyEvangelionTheme() {
  // Update scene background
  scene.background = new THREE.Color(0x1A1A1A);
  
  // Update node materials
  threeNodes.forEach(node => {
    if (node.material instanceof THREE.MeshPhongMaterial) {
      if (node.userData.isCenter) {
        node.material.color.setHex(0x6B3E26); // Eva-01 color
      } else {
        node.material.color.setHex(0x3D7171); // Terminal green
      }
      node.material.emissive.setHex(0x000000);
      node.material.shininess = 30;
    }
  });
  
  // Update branch materials
  branches.forEach(({ branch }) => {
    if (branch.material instanceof THREE.MeshPhongMaterial) {
      branch.material.color.setHex(0xEC5252); // NERV red
      branch.material.opacity = 0.7;
    }
  });
  
  // Update text with terminal-like styling
  branches.forEach(({ textMesh }) => {
    updateTextWithTerminalStyle(textMesh);
  });
  
  // Add grid helper for technical feel
  if (!gridHelper) {
    gridHelper = new THREE.GridHelper(20, 20, 0xEC5252, 0x333333);
    gridHelper.position.y = -5;
    scene.add(gridHelper);
  }
}

function updateTextWithTerminalStyle(textMesh) {
  // Create terminal-like text
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 128;
  
  if (context && textMesh.userData && textMesh.userData.text) {
    context.fillStyle = '#1A1A1A';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Terminal-like text
    context.font = 'bold 48px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Text with red glow
    context.shadowColor = 'rgba(236, 82, 82, 0.7)';
    context.shadowBlur = 10;
    context.fillStyle = '#F0F0F0';
    context.fillText(textMesh.userData.text, canvas.width / 2, canvas.height / 2);
    
    // Update texture
    if (textMesh.material instanceof THREE.MeshBasicMaterial && textMesh.material.map) {
      textMesh.material.map.dispose();
      textMesh.material.map = new THREE.CanvasTexture(canvas);
      textMesh.material.needsUpdate = true;
    }
  }
}
```

### 6.4 Synchronized Theme Transitions

To address the theme transition issues identified in the development journal, we need to implement synchronized transitions for Three.js elements:

```typescript
// In MindMap3D.svelte
import { currentTheme, isTransitioning } from '$lib/stores/themeStore';

// Theme transition handler
$: if ($isTransitioning) {
  // Prepare for transition
  prepareThemeTransition();
}

$: if ($currentTheme !== previousTheme && !$isTransitioning) {
  // Apply theme change
  applyThemeToMindMap($currentTheme);
  previousTheme = $currentTheme;
}

function prepareThemeTransition() {
  // Create a transition overlay in the scene
  const transitionPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false
    })
  );
  
  transitionPlane.position.z = camera.position.z - 1;
  transitionPlane.renderOrder = 9999; // Ensure it renders on top
  scene.add(transitionPlane);
  
  // Animate transition overlay
  new TWEEN.Tween(transitionPlane.material)
    .to({ opacity: 0.5 }, 300)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onComplete(() => {
      // Apply theme changes while overlay is visible
      applyThemeToMindMap($currentTheme);
      
      // Fade out overlay
      new TWEEN.Tween(transitionPlane.material)
        .to({ opacity: 0 }, 300)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onComplete(() => {
          scene.remove(transitionPlane);
          transitionPlane.material.dispose();
          transitionPlane.geometry.dispose();
        })
        .start();
    })
    .start();
}
```

### 6.5 Theme Debugging Tools

To help diagnose theme transition issues, we should implement debugging tools:

```typescript
// In MindMap3D.svelte
let debugMode = false;

// Debug panel for theme visualization
function createDebugPanel() {
  const debugContainer = document.createElement('div');
  debugContainer.className = 'mind-map-debug';
  debugContainer.style.cssText = `
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 10px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    z-index: 1000;
  `;
  
  container.appendChild(debugContainer);
  
  // Update debug info
  function updateDebugInfo() {
    debugContainer.innerHTML = `
      <div>Theme: ${$currentTheme}</div>
      <div>Focus: ${$focusLevel}</div>
      <div>Feeling: ${$feelingLevel}</div>
      <div>Transitioning: ${$isTransitioning ? 'Yes' : 'No'}</div>
      <div>Nodes: ${threeNodes.length}</div>
      <div>Branches: ${branches.length}</div>
      <div>FPS: ${Math.round(1000 / renderTime)}</div>
    `;
    
    requestAnimationFrame(updateDebugInfo);
  }
  
  updateDebugInfo();
  
  return debugContainer;
}

// Toggle debug mode
export function toggleDebugMode() {
  debugMode = !debugMode;
  
  if (debugMode) {
    debugPanel = createDebugPanel();
  } else if (debugPanel) {
    debugPanel.remove();
    debugPanel = null;
  }
}
```

## 7. Accessibility Considerations

The MindMap3D component should be accessible to all users, including those with disabilities. Here are some key accessibility enhancements to implement:

### 7.1 Keyboard Navigation

```typescript
function setupKeyboardNavigation() {
  // Add tabindex to make canvas focusable
  renderer.domElement.setAttribute('tabindex', '0');
  renderer.domElement.setAttribute('aria-label', 'Mind map visualization');
  
  // Focus handling
  renderer.domElement.addEventListener('focus', () => {
    // Visual indicator for keyboard focus
    renderer.domElement.style.outline = '2px solid #4CAF50';
  });
  
  renderer.domElement.addEventListener('blur', () => {
    renderer.domElement.style.outline = 'none';
  });
  
  // Keyboard controls
  renderer.domElement.addEventListener('keydown', (event) => {
    // Get currently focused node or use center node
    const focusedNode = getFocusedNode() || findCenterNode();
    
    switch(event.key) {
      case 'ArrowUp':
        navigateToNodeInDirection(focusedNode, 'up');
        event.preventDefault();
        break;
      case 'ArrowDown':
        navigateToNodeInDirection(focusedNode, 'down');
        event.preventDefault();
        break;
      case 'ArrowLeft':
        navigateToNodeInDirection(focusedNode, 'left');
        event.preventDefault();
        break;
      case 'ArrowRight':
        navigateToNodeInDirection(focusedNode, 'right');
        event.preventDefault();
        break;
      case 'Enter':
        if (focusedNode) {
          selectNode(focusedNode);
        }
        event.preventDefault();
        break;
      case 'Escape':
        resetView();
        event.preventDefault();
        break;
    }
  });
}

function navigateToNodeInDirection(currentNode, direction) {
  if (!currentNode) return;
  
  // Find closest node in specified direction
  let closestNode = null;
  let closestDistance = Infinity;
  
  threeNodes.forEach(node => {
    if (node === currentNode) return;
    
    const vector = new THREE.Vector3().subVectors(node.position, currentNode.position);
    
    // Check if node is in the right direction
    let inDirection = false;
    switch(direction) {
      case 'up':
        inDirection = vector.y > 0 && Math.abs(vector.x) < Math.abs(vector.y);
        break;
      case 'down':
        inDirection = vector.y < 0 && Math.abs(vector.x) < Math.abs(vector.y);
        break;
      case 'left':
        inDirection = vector.x < 0 && Math.abs(vector.x) > Math.abs(vector.y);
        break;
      case 'right':
        inDirection = vector.x > 0 && Math.abs(vector.x) > Math.abs(vector.y);
        break;
    }
    
    if (inDirection) {
      const distance = vector.length();
      if (distance < closestDistance) {
        closestDistance = distance;
        closestNode = node;
      }
    }
  });
  
  if (closestNode) {
    setFocusedNode(closestNode);
    focusCameraOnNode(closestNode);
  }
}
```

### 7.2 Screen Reader Support

```typescript
function enhanceScreenReaderSupport() {
  // Add ARIA live region for announcements
  const ariaLive = document.createElement('div');
  ariaLive.setAttribute('aria-live', 'polite');
  ariaLive.setAttribute('aria-atomic', 'true');
  ariaLive.className = 'sr-only'; // Screen reader only
  container.appendChild(ariaLive);
  
  // Announce node selection
  function announceNode(node) {
    if (!node) return;
    
    const title = node.userData.title || 'Untitled node';
    const description = node.userData.description || 'No description';
    const nodeType = node.userData.nodeType || 'unknown type';
    const childCount = countChildNodes(node);
    
    ariaLive.textContent = `Selected ${nodeType} node: ${title}. ${description}. ${
      childCount > 0 ? `Has ${childCount} connected nodes.` : 'Has no connected nodes.'
    }`;
  }
  
  // Override node selection to include announcements
  const originalSelectNode = selectNode;
  selectNode = (node) => {
    originalSelectNode(node);
    announceNode(node);
  };
  
  // Add node count and description to canvas
  renderer.domElement.setAttribute('aria-description', 
    `3D mind map with ${threeNodes.length} nodes. Use arrow keys to navigate between nodes, Enter to select a node, and Escape to reset the view.`
  );
}

function countChildNodes(node) {
  return threeNodes.filter(n => n.userData.parentId === node.userData.id).length;
}
```

### 7.3 Color Contrast and Visual Accessibility

```typescript
function enhanceVisualAccessibility($focusLevel, $feelingLevel) {
  // Ensure sufficient contrast for text
  branches.forEach(({ textMesh }) => {
    if (textMesh.material instanceof THREE.MeshBasicMaterial && textMesh.material.map) {
      // Regenerate text with enhanced contrast
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 128;
      
      if (context && textMesh.userData && textMesh.userData.text) {
        // High contrast background
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // High contrast text
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // White text with black outline for maximum contrast
        context.strokeStyle = 'black';
        context.lineWidth = 6;
        context.strokeText(textMesh.userData.text, canvas.width / 2, canvas.height / 2);
        
        context.fillStyle = 'white';
        context.fillText(textMesh.userData.text, canvas.width / 2, canvas.height / 2);
        
        // Update texture
        textMesh.material.map.dispose();
        textMesh.material.map = new THREE.CanvasTexture(canvas);
        textMesh.material.needsUpdate = true;
      }
    }
  });
  
  // Enhance node visibility
  threeNodes.forEach(node => {
    if (node.material instanceof THREE.MeshPhongMaterial) {
      // Add outline for better visibility
      if (!node.userData.outlineAdded) {
        const outlineMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xffffff,
          side: THREE.BackSide
        });
        
        const outlineMesh = new THREE.Mesh(
          node.geometry.clone(),
          outlineMaterial
        );
        
        outlineMesh.scale.multiplyScalar(1.05);
        node.add(outlineMesh);
        node.userData.outlineAdded = true;
      }
    }
  });
}
```

## 8. Conclusion and Next Steps

The MindMap3D component enhancement plan outlined in this document provides a comprehensive roadmap for implementing auto-arrangement features, theme integration, performance optimizations, and user experience improvements. By following this plan, the next AI engineer can create a more intuitive, visually appealing, and accessible mind map visualization that integrates seamlessly with the application's theming system.

### Key Takeaways

1. **Auto-Arrangement**: Implementing multiple layout algorithms (radial, force-directed, tree, spiral) will give users flexibility in visualizing their mind maps.

2. **Theme Integration**: Connecting the MindMap3D component to the existing theme system will create a cohesive experience where the entire application responds to theme changes.

3. **Performance Optimizations**: Implementing geometry pooling, level of detail, and frustum culling will ensure smooth performance even with large mind maps.

4. **User Experience**: Enhancing node selection, camera controls, and adding search functionality will make the mind map more intuitive and user-friendly.

5. **Accessibility**: Adding keyboard navigation and screen reader support will make the mind map accessible to all users.

### Next Steps

1. Begin implementation with the auto-arrangement features, as they provide immediate value to users.

2. Follow with theme integration, focusing on smooth transitions and consistent visual styling.

3. Implement performance optimizations as the complexity of the mind map increases.

4. Add user experience enhancements to make the mind map more intuitive and user-friendly.

5. Ensure accessibility features are implemented throughout the development process.

By following this implementation plan, the MindMap3D component will become a more powerful, flexible, and user-friendly tool for visualizing and interacting with mind maps, while maintaining consistency with the application's overall design system.