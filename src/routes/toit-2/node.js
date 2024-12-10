import * as THREE from 'three';

export function createNode({ id, title, position, type = 'note' }) {
  // Create node geometry
  const geometry = new THREE.SphereGeometry(type === 'concept' ? 0.5 : 0.3, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: type === 'concept' ? 0x3b82f6 : 0x10b981,
    metalness: 0.3,
    roughness: 0.7
  });
  const mesh = new THREE.Mesh(geometry, material);

  // Create label
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const texture = new THREE.CanvasTexture(canvas);
  
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(2, 1, 1);
  sprite.position.y = 0.7;

  // Create group
  const group = new THREE.Group();
  group.add(mesh);
  group.add(sprite);
  group.position.copy(position);
  group.userData.nodeId = id;

  function updateLabel(text) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    texture.needsUpdate = true;
  }

  updateLabel(title);

  return {
    id,
    type,
    group,
    mesh,
    sprite,
    updateLabel,
    getPosition: () => group.position
  };
}