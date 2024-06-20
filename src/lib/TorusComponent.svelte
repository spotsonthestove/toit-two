<!-- <script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
  
    let container;
    let scene, camera, renderer, torus;
  

    function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);

  const geometry = new THREE.TorusBufferGeometry(10, 2, 19, 100);
  const materials = new THREE.MeshBasicMaterial({
    vertexColors: true,
  });

  const colors = [];
  const numVertices = geometry.getAttribute('position').count;
  const positions = geometry.getAttribute('position');

  const green1 = new THREE.Color(0x32a852);
  const green2 = new THREE.Color(0x78b568);
  const green3 = new THREE.Color(0xb0d49c);

  for (let i = 0; i < numVertices; i++) {
    let color;
    const position = new THREE.Vector3().fromBufferAttribute(positions, i);
    const angle = Math.atan2(position.x, position.z);

    if (angle >= (-2 * Math.PI) / 3 && angle < (-2 * Math.PI) / 3) {
  color = green1;
} else if (angle >= (-3 * Math.PI) / 3 && angle < Math.PI / 3) {
  color = green2;
} else {
  color = green3;
}


    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  torus = new THREE.Mesh(geometry, materials);
  scene.add(torus);

  camera.position.z = 30;
}



  
    function animate() {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
  
    onMount(() => {
      init();
      container.appendChild(renderer.domElement);
      animate();
      const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        container.removeChild(renderer.domElement);
      };
    });
  </script> -->
<!--   
  <div bind:this={container} style="width: 100%; height: 100vh; position: relative;"></div>
   -->
   <script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    
    export let segments = 5;
    export let radius = 1;
    export let tube = 0.3;
    export let radialSegments = 16;
    export let tubularSegments = 100;
    
    let container;
    
    onMount(() => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
    
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
    
      const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
      const colors = [
        new THREE.Color(0xff0000), // Red
        new THREE.Color(0x00ff00), // Green
        new THREE.Color(0x0000ff), // Blue
        new THREE.Color(0xffff00), // Yellow
        new THREE.Color(0xff00ff), // Magenta
      ];
    
      const positionAttribute = geometry.getAttribute('position');
      const colorAttribute = new THREE.BufferAttribute(new Float32Array(positionAttribute.count * 3), 3);
    
      for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, i);
        
        // Calculate the angle of this vertex in the XZ plane
        const angle = Math.atan2(vertex.z, vertex.x);
        
        // Map the angle to a segment index
        const segmentIndex = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * segments) % segments;
        
        const color = colors[segmentIndex % colors.length];
        colorAttribute.setXYZ(i, color.r, color.g, color.b);
      }
    
      geometry.setAttribute('color', colorAttribute);
    
      const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
      const torus = new THREE.Mesh(geometry, material);
      scene.add(torus);
    
      camera.position.z = 5;
    
      function animate() {
        requestAnimationFrame(animate);
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
    
      animate();
    
      return () => {
        container.removeChild(renderer.domElement);
      };
    });
    </script>
    
    <div bind:this={container} style="width: 100%; height: 400px;"></div>