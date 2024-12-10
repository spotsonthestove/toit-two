import * as THREE from 'three';
import { setupScene } from './scene.js';
import { setupControls } from './controls.js';
import { MindMapManager } from './mindMapManager.js';
import { setupSidebar } from './sidebar.js';
import { setupEventHandlers } from './eventHandlers.js';

const container = document.getElementById('canvas-container');
const { scene, camera, renderer } = setupScene(container);
const mindMapManager = new MindMapManager(scene);
const { orbitControls, dragControls, updateDragControls } = setupControls(camera, renderer, mindMapManager);
const { showSidebar, hideSidebar } = setupSidebar(mindMapManager);

// Set up callback for node changes
mindMapManager.setOnNodesChanged(() => {
  const newDragControls = updateDragControls();
  dragControls.dispose();
  Object.assign(dragControls, newDragControls);
});

setupEventHandlers({
  container,
  camera,
  mindMapManager,
  showSidebar,
  renderer
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);
}
animate();

// Window resize handling
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});