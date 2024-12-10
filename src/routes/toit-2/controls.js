import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

export function setupControls(camera, renderer, mindMapManager) {
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.05;

  function updateDragControls() {
    const objects = mindMapManager.getDraggableObjects();
    const dragControls = new DragControls(objects, camera, renderer.domElement);
    
    dragControls.addEventListener('dragstart', (event) => {
      orbitControls.enabled = false;
      event.object.userData.isDragging = true;
    });

    dragControls.addEventListener('drag', (event) => {
      const nodeId = event.object.userData.nodeId;
      const node = mindMapManager.getNode(nodeId);
      if (node) {
        mindMapManager.updateNodePosition(nodeId, event.object.position);
      }
    });

    dragControls.addEventListener('dragend', (event) => {
      orbitControls.enabled = true;
      event.object.userData.isDragging = false;
    });

    return dragControls;
  }

  const dragControls = updateDragControls();

  return { 
    orbitControls, 
    dragControls,
    updateDragControls 
  };
}