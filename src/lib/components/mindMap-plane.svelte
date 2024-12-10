<script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
    import { nodes as nodesStore } from '../stores/mindMapStore';
    import { Vector3 } from 'three'; // Add this import

    let container;
    let scene, camera, renderer, orbitControls, dragControls;
    let nodes = [];
    let branches = [];
    let isDragging = false;

    onMount(() => {
        try {
            init();
            initializeDefaultNodes();
            animate();
        } catch (error) {
            console.error('Error in onMount:', error);
        }
    });

    function init() {
        try {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xcccccc); // Add background color

            if (!container) {
                throw new Error('Container element not found');
            }

            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 10;

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            orbitControls = new OrbitControls(camera, renderer.domElement);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);

            // Initialize drag controls
            dragControls = new DragControls(nodes, camera, renderer.domElement);
            dragControls.addEventListener('dragstart', () => { isDragging = true; orbitControls.enabled = false; });
            dragControls.addEventListener('dragend', () => { isDragging = false; orbitControls.enabled = true; });
            dragControls.addEventListener('drag', updateBranches);

            // Event listeners
            window.addEventListener('resize', onWindowResize);

            console.log('Three.js scene initialized successfully');
        } catch (error) {
            console.error('Error initializing Three.js scene:', error);
        }
    }

    function createNode(position, isCenter = false) {
        const nodeGeometry = new THREE.SphereGeometry(isCenter ? 0.75 : 0.5, 32, 32);
        const nodeMaterial = new THREE.MeshPhongMaterial({ color: isCenter ? 0x00ff00 : 0x0000ff });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        scene.add(node);
        nodes.push(node);
    }

    function createBranch(startNode, endNode, label) {
        const branchGeometry = createCurvedPlaneGeometry(startNode.position, endNode.position);
        const branchMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        scene.add(branch);
        
        const textLabel = createTextLabel(label);
        scene.add(textLabel);
        
        branches.push({ branch, startNode, endNode, textLabel });
        updateBranch(branches[branches.length - 1]);
    }

    function createCurvedPlaneGeometry(start, end) {
        const width = start.distanceTo(end);
        const height = width * 0.1;
        const segments = 20;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array((segments + 1) * 3 * 2);
        const indices = [];

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const pos = new THREE.Vector3().lerpVectors(start, end, t);
            const bulge = Math.sin(t * Math.PI) * height;
            const normal = new THREE.Vector3().subVectors(end, start).normalize();
            const binormal = new THREE.Vector3(0, 1, 0);
            const tangent = new THREE.Vector3().crossVectors(normal, binormal);

            pos.addScaledVector(tangent, bulge);

            const index = i * 6;
            positions[index] = pos.x;
            positions[index + 1] = pos.y;
            positions[index + 2] = pos.z;
            positions[index + 3] = pos.x;
            positions[index + 4] = pos.y - height * 0.5;
            positions[index + 5] = pos.z;

            if (i < segments) {
                const vertexIndex = i * 2;
                indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
                indices.push(vertexIndex + 2, vertexIndex + 1, vertexIndex + 3);
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        return geometry;
    }

    function createTextLabel(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512; // Increased from 256
        canvas.height = 128; // Increased from 64
        
        context.font = 'Bold 48px Arial'; // Increased font size
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.lineWidth = 8; // Increased line width
        context.strokeText(text, 0, 64); // Adjusted y-position
        context.fillText(text, 0, 64); // Adjusted y-position
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
        });
        const geometry = new THREE.PlaneGeometry(4, 1); // Increased from (2, 0.5)
        const textMesh = new THREE.Mesh(geometry, material);
        
        return textMesh;
    }

    function updateBranch(branchObj) {
        const { branch, startNode, endNode, textLabel } = branchObj;
        const newGeometry = createCurvedPlaneGeometry(startNode.position, endNode.position);
        branch.geometry.dispose();
        branch.geometry = newGeometry;

        // Update text position and orientation
        const midPoint = new THREE.Vector3().lerpVectors(startNode.position, endNode.position, 0.5);
        const normal = new THREE.Vector3().subVectors(endNode.position, startNode.position).normalize();
        const binormal = new THREE.Vector3(0, 1, 0);
        const tangent = new THREE.Vector3().crossVectors(normal, binormal);

        textLabel.position.copy(midPoint);
        textLabel.position.addScaledVector(tangent, 0.25); // Offset above the curved plane

        // Orient the text to face the camera and align with the curve
        textLabel.lookAt(camera.position);
        textLabel.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        textLabel.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.atan2(normal.x, normal.z));
    }

    function updateBranches() {
        for (let branchObj of branches) {
            updateBranch(branchObj);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!isDragging) {
            orbitControls.update();
        }
        updateBranches();
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    onDestroy(() => {
        window.removeEventListener('resize', onWindowResize);
        // Dispose of Three.js objects
    });

    function initializeDefaultNodes() {
        const centerNode = new THREE.Vector3(0, 0, 0);
        const leftNode = new THREE.Vector3(-3, 0, 0);
        const rightNode = new THREE.Vector3(3, 0, 0);

        createNode(centerNode, true);
        createNode(leftNode);
        createNode(rightNode);

        createBranch(nodes[0], nodes[1], "Left Branch");
        createBranch(nodes[0], nodes[2], "Right Branch");

        updateBranches();
        updateNodesList();
    }

    export function addNode(x, y, z) {
        const newPosition = new THREE.Vector3(x, y, z);
        createNode(newPosition);
        
        if (nodes.length > 1) {
            createBranch(nodes[0], nodes[nodes.length - 1], "New Branch");
        }
        
        updateBranches();
        updateNodesList();
    }

    function updateNodesList() {
        $nodesStore = nodes.map((node, index) => ({
            id: index,
            x: node.position.x,
            y: node.position.y,
            z: node.position.z
        }));
    }

    export function initializeNodesFromStore(storedNodes) {
        storedNodes.forEach(node => {
            addNode(node.x, node.y, node.z);
        });
    }
</script>

<div bind:this={container}></div>

<style>
    div {
        width: 100%;
        height: 100vh;
    }
</style>
