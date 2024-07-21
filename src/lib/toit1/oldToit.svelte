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