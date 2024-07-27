<script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { DragControls } from 'three/examples/jsm/controls/DragControls';

    let container;
    let scene, camera, renderer, orbitControls, dragControls;
    let nodes = [];
    let branches = [];
    let isDragging = false;

    onMount(() => {
        if (container) {
            init();
            animate();
        } else {
            console.error('Container not available');
        }
    });

    function init() {
        try {
            // Create scene
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xcccccc);  // Light gray background

            // Create camera
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 10;

            // Create renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            // Add orbit controls
            orbitControls = new OrbitControls(camera, renderer.domElement);

            // Create initial nodes
            createNode(new THREE.Vector3(0, 0, 0), true); // Center node
            createNode(new THREE.Vector3(3, 2, 0));
            createNode(new THREE.Vector3(-2, 3, 1));

            // Create branches between nodes
            createBranch(nodes[0], nodes[1], "document");
            createBranch(nodes[0], nodes[2], "laundry");

            // Add drag controls for nodes
            dragControls = new DragControls(nodes, camera, renderer.domElement);
            dragControls.addEventListener('dragstart', onDragStart);
            dragControls.addEventListener('dragend', onDragEnd);
            dragControls.addEventListener('drag', onDrag);

            // Add lighting
            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);

            // Handle window resize
            const handleResize = () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            };
            window.addEventListener('resize', handleResize);

            // Cleanup function
            onDestroy(() => {
                window.removeEventListener('resize', handleResize);
                orbitControls.dispose();
                dragControls.dispose();
                renderer.dispose();
            });
        } catch (error) {
            console.error('Error initializing 3D scene:', error);
        }
    }

    function createNode(position, isCenter = false) {
        const nodeGeometry = new THREE.SphereGeometry(isCenter ? 0.75 : 0.5, 32, 32);
        const nodeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        scene.add(node);
        nodes.push(node);
    }

    function createBranch(startNode, endNode, label) {
        const branchGeometry = createOrganicBranchGeometry(startNode.position, endNode.position);
        const branchMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff0000,  // Bright red for visibility
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

    function createOrganicBranchGeometry(start, end) {
        const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
        const normal = new THREE.Vector3().subVectors(end, start).normalize();
        const binormal = new THREE.Vector3(0, 1, 0);
        const tangent = new THREE.Vector3().crossVectors(normal, binormal);
        
        const bulgeFactor = 1.0;
        
        const controlPoint = midPoint.clone().addScaledVector(tangent, bulgeFactor);

        const curve = new THREE.QuadraticBezierCurve3(
            start,
            controlPoint,
            end
        );

        const geometry = new THREE.TubeGeometry(curve, 64, 0.2, 8, false);
        return geometry;
    }

    function createTextLabel(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.font = 'Bold 24px Arial';
        context.fillStyle = 'black';
        context.fillText(text, 0, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
        });
        const geometry = new THREE.PlaneGeometry(2, 0.5);
        return new THREE.Mesh(geometry, material);
    }

    function updateBranch(branchObj) {
        const { branch, startNode, endNode, textLabel } = branchObj;
        const newGeometry = createOrganicBranchGeometry(startNode.position, endNode.position);
        branch.geometry.dispose();
        branch.geometry = newGeometry;

        // Update text label position and orientation
        const midpoint = new THREE.Vector3().lerpVectors(startNode.position, endNode.position, 0.5);
        textLabel.position.copy(midpoint);
        textLabel.lookAt(camera.position);

        // Align text with branch direction
        const direction = new THREE.Vector3().subVectors(endNode.position, startNode.position).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3().crossVectors(direction, up).normalize();
        textLabel.up.copy(right);
        textLabel.lookAt(camera.position);
    }

    function updateBranches() {
        for (let branchObj of branches) {
            updateBranch(branchObj);
        }
    }

    function onDragStart(event) {
        isDragging = true;
        orbitControls.enabled = false;
    }

    function onDragEnd(event) {
        isDragging = false;
        orbitControls.enabled = true;
    }

    function onDrag(event) {
        if (isDragging) {
            updateBranches();
        }
    }

    function animate() {
        if (renderer && scene && camera) {
            requestAnimationFrame(animate);
            if (!isDragging) {
                orbitControls.update();
            }
            updateBranches(); // Update branch and text positions every frame
            renderer.render(scene, camera);
        }
    }
</script>

<div bind:this={container}></div>

<style>
    div {
        width: 100%;
        height: 100vh;
    }
</style>