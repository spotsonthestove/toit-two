<script>

import TorusComponent from '$lib/TorusComponent.svelte';

import MindMap3D from '$lib/components/MindMap3D.svelte';

</script>

<h1>Toit</h1>

<h1> This will be something when I get a round Toit </h1>

<!-- <main> 
<h1>3D Mind Mapping Tool</h1>
<MindMap3D />
</main> -->

<!-- <main> 

    <TorusComponent />
</main> -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toits App with A Round Toit</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #4caf50, #1a1a1a);
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
            width: 100%;
            max-width: 400px;
        }
        h1, h2 {
            color: #fff;
            text-align: center;
            margin-bottom: 20px;
        }
        form {
            display: flex;
            margin-bottom: 20px;
        }
        input[type="text"] {
            flex-grow: 1;
            padding: 10px;
            border: none;
            border-radius: 5px 0 0 5px;
            outline: none;
        }
        button {
            padding: 10px 20px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 0 5px 5px 0;
            cursor: pointer;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            background: rgba(255, 255, 255, 0.2);
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 5px;
            color: #fff;
        }
        #torus-container {
            width: 300px;
            height: 300px;
            margin: 30px auto;
            cursor: move;
        }
        #torus-value {
            text-align: center;
            color: white;
            font-size: 18px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Toits</h1>
        <form id="todo-form">
            <input type="text" id="todo-input" placeholder="Add a new toit..." required>
            <button type="submit">Add</button>
        </form>
        <ul id="todo-list">
            <!-- Toit items will be added here dynamically -->
        </ul>
    </div>

    <div class="container">
        <h2>A Round Toit</h2>
        <div id="torus-container"></div>
        <div id="torus-value">Selected segment: None</div>
    </div>

    <script>
        // Toits App Logic
        const form = document.getElementById('todo-form');
        const input = document.getElementById('todo-input');
        const toitsList = document.getElementById('todo-list');
        const torusValue = document.getElementById('torus-value');

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (input.value.trim() !== '') {
                const li = document.createElement('li');
                li.textContent = input.value;
                toitsList.appendChild(li);
                input.value = '';
            }
        });

        // Three.js "A Round Toit" Logic
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(300, 300);
        document.getElementById('torus-container').appendChild(renderer.domElement);

        // Main (inner) torus
        const mainTorusGeometry = new THREE.TorusGeometry(1, 0.1, 16, 100);
        const mainTorusMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        const mainTorus = new THREE.Mesh(mainTorusGeometry, mainTorusMaterial);
        scene.add(mainTorus);

        // Outer clickable torus
        const clickableTorusGeometry = new THREE.TorusGeometry(1.5, 0.15, 16, 100);
        const clickableTorusMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xcccccc, 
            transparent: true, 
            opacity: 0.3 
        });

        const clickableTorus = new THREE.Mesh(clickableTorusGeometry, clickableTorusMaterial);
        scene.add(clickableTorus);

        // Create colored segments
        const segmentGeometry = new THREE.TorusGeometry(1.5, 0.15, 16, 33); // 33 segments for 1/3 of the torus
        const segmentMaterials = [
            new THREE.MeshPhongMaterial({ color: 0xff0000 }), // Red
            new THREE.MeshPhongMaterial({ color: 0x00ff00 }), // Green
            new THREE.MeshPhongMaterial({ color: 0x0000ff })  // Blue
        ];

        const segments = [];
        for (let i = 0; i < 3; i++) {
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterials[i]);
            segment.rotation.z = (i * 2 * Math.PI) / 3;
            segment.visible = false;
            clickableTorus.add(segment);
            segments.push(segment);
        }

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 0, 10);
        scene.add(light);

        camera.position.z = 3;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isDragging = false;
        let previousMousePosition = {
            x: 0,
            y: 0
        };

        renderer.domElement.addEventListener('mousedown', onMouseDown, false);
        renderer.domElement.addEventListener('mousemove', onMouseMove, false);
        renderer.domElement.addEventListener('mouseup', onMouseUp, false);
        renderer.domElement.addEventListener('click', onClick, false);

        function onMouseDown(event) {
            isDragging = true;
        }

        function onMouseMove(event) {
            if (isDragging) {
                const deltaMove = {
                    x: event.offsetX - previousMousePosition.x,
                    y: event.offsetY - previousMousePosition.y
                };

                mainTorus.rotation.y += deltaMove.x * 0.01;
                mainTorus.rotation.x += deltaMove.y * 0.01;
            }

            previousMousePosition = {
                x: event.offsetX,
                y: event.offsetY
            };
        }

        function onMouseUp(event) {
            isDragging = false;
        }

        function onClick(event) {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(clickableTorus);

            if (intersects.length > 0) {
                const clickedPoint = intersects[0].point;
                const angle = Math.atan2(clickedPoint.y, clickedPoint.x);
                const segmentIndex = Math.floor(((angle + Math.PI) / (2 * Math.PI / 3)) % 3);
                
                segments[segmentIndex].visible = !segments[segmentIndex].visible;
                torusValue.textContent = `Selected segment: ${segmentIndex + 1}`;
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        animate();
    </script>
</body>
</html>

<style>
   main {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1 {
    text-align: center;
  }
</style>
