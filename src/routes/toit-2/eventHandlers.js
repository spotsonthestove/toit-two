import * as THREE from 'three';

export function setupEventHandlers({ container, camera, mindMapManager, showSidebar, renderer }) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedNode = null;

  // Node selection
  renderer.domElement.addEventListener('click', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(
      mindMapManager.getDraggableObjects().map(obj => obj.children[0]),
      true
    );
    
    if (intersects.length > 0) {
      const nodeId = intersects[0].object.parent.userData.nodeId;
      selectedNode = mindMapManager.getNode(nodeId);
      showSidebar(selectedNode);
    }
  });

  // Add new node
  const addNodeBtn = document.getElementById('addNodeBtn');
  addNodeBtn.addEventListener('click', () => {
    if (selectedNode) {
      const direction = new THREE.Vector3(
        Math.random() - 0.5,
        0,
        Math.random() - 0.5
      ).normalize();
      
      const offset = direction.multiplyScalar(2);
      const newPosition = selectedNode.getPosition().clone().add(offset);
      
      mindMapManager.createNode({
        title: 'New Node',
        position: newPosition,
        parentId: selectedNode.id
      });
    }
  });
}