<script>
// Import required classes
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a ring geometry
const innerRadius = 1;
const outerRadius = 2;
const thetaSegments = 64;
const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);

// Create three shades of green materials
const green1 = new THREE.MeshBasicMaterial({ color: 0x88cc44, side: THREE.DoubleSide });
const green2 = new THREE.MeshBasicMaterial({ color: 0x66aa33, side: THREE.DoubleSide });
const green3 = new THREE.MeshBasicMaterial({ color: 0x448822, side: THREE.DoubleSide });

// Create three mesh objects with the same geometry and respective materials
const ring1 = new THREE.Mesh(ringGeometry, green1);
const ring2 = new THREE.Mesh(ringGeometry, green2);
const ring3 = new THREE.Mesh(ringGeometry, green3);

// Position the mesh objects to create a wheel-like shape
ring1.rotation.z = 0;
ring2.rotation.z = (2 * Math.PI) / 3;
ring3.rotation.z = (4 * Math.PI) / 3;

// Add the mesh objects to the scene
scene.add(ring1);
scene.add(ring2);
scene.add(ring3);

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

</script>