<script>
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { DragControls } from 'three/examples/jsm/controls/DragControls';
    import { nodes as nodesStore } from '../stores/mindMapStore';
    import { Vector3, QuadraticBezierCurve3 } from 'three';

    let container;
    let scene, camera, renderer, orbitControls, dragControls;
    let threeNodes = []; // Renamed from 'nodes' to 'threeNodes'
    let branches = [];
    let isDragging = false;

    // let mindMapId = null;

    const dispatch = createEventDispatcher();

    let initialNodesCreated = false;

    onMount(() => {
        init();
        if (container) {
            animate();
            // Create initial nodes if store is empty
            if ($nodesStore.length === 0 && !initialNodesCreated) {
                createInitialNodes();
                initialNodesCreated = true;
            }
        } else {
            console.error('Container not available');
        }
    });

    function createInitialNodes() {
        // Create center node
        addNode(0, 0, 0, true);
        // Create two additional nodes
        addNode(3, 2, 0);
        addNode(-2, 3, 1);
    }

    function init() {
        try {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xcccccc);

            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 10;

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            orbitControls = new OrbitControls(camera, renderer.domElement);

            // Remove the initial node creation from here
            // We'll create nodes based on the store data

            dragControls = new DragControls(threeNodes, camera, renderer.domElement);
            dragControls.addEventListener('dragstart', onDragStart);
            dragControls.addEventListener('dragend', onDragEnd);
            dragControls.addEventListener('drag', onDrag);

            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);

            const handleResize = () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            };
            window.addEventListener('resize', handleResize);

            onDestroy(() => {
                window.removeEventListener('resize', handleResize);
                orbitControls.dispose();
                dragControls.dispose();
                renderer.dispose();
                // mindMap.set(null);
            });
        } catch (error) {
            console.error('Error initializing 3D scene:', error);
        }
    }

    function createNode(position, isCenter = false) {
        const nodeGeometry = new THREE.SphereGeometry(isCenter ? 0.75 : 0.5, 32, 32);
        const nodeMaterial = new THREE.MeshPhongMaterial({ 
            color: isCenter ? 0x4CAF50 : 0x00ff00 
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        node.isCenter = isCenter; // Add this property to track center node
        scene.add(node);
        threeNodes.push(node);
    }

    function createBranch(startNode, endNode, label) {
        const { curve, branchGeometry } = createOrganicBranchGeometry(startNode.position, endNode.position);
        const branchMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.7
        });
        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        scene.add(branch);
        
        const textLabel = createTextLabel(label);
        scene.add(textLabel);
        
        branches.push({ branch, startNode, endNode, textLabel, curve });
        updateBranch(branches[branches.length - 1]);
    }

    function createOrganicBranchGeometry(start, end) {
        const midPoint = new Vector3().lerpVectors(start, end, 0.5);
        const normal = new Vector3().subVectors(end, start).normalize();
        const binormal = new Vector3(0, 1, 0);
        const tangent = new Vector3().crossVectors(normal, binormal);
        
        const bulgeFactor = 0.5;
        
        const controlPoint = midPoint.clone().addScaledVector(tangent, bulgeFactor);

        const curve = new QuadraticBezierCurve3(
            start,
            controlPoint,
            end
        );

        const geometry = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
        return { curve, branchGeometry: geometry };
    }

    function createTextLabel(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.font = 'Bold 24px Arial';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.lineWidth = 4;
        context.strokeText(text, 0, 32);
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
        const { branch, startNode, endNode, textLabel, curve } = branchObj;
        const { curve: newCurve, branchGeometry: newGeometry } = createOrganicBranchGeometry(startNode.position, endNode.position);
        branch.geometry.dispose();
        branch.geometry = newGeometry;
        branchObj.curve = newCurve;

        // Update text position and orientation
        const textPosition = newCurve.getPoint(0.5); // Get midpoint of the curve
        const textOffset = new Vector3(0, 0.3, 0); // Offset above the branch
        textLabel.position.copy(textPosition).add(textOffset);

        const tangent = newCurve.getTangent(0.5);
        const up = new Vector3(0, 1, 0);
        const right = new Vector3().crossVectors(tangent, up).normalize();

        textLabel.up.copy(right);
        textLabel.lookAt(camera.position);

        // Align text with the branch direction
        const startToEnd = new Vector3().subVectors(endNode.position, startNode.position);
        const angle = Math.atan2(startToEnd.y, startToEnd.x);
        textLabel.rotation.z = angle;
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
        // saveMindMapState();
    }

    function onDrag(event) {
        if (isDragging) {
            updateBranches();
            // saveMindMapState();
        }
    }

    function animate() {
        if (renderer && scene && camera) {
            requestAnimationFrame(animate);
            if (!isDragging) {
                orbitControls.update();
            }
            updateBranches();
            renderer.render(scene, camera);
        }
    }

    export function addNode(x, y, z, isCenter = false) {
        const newPosition = new THREE.Vector3(x, y, z);
        createNode(newPosition, isCenter);
        
        // Only create branches if this isn't the first node
        if (threeNodes.length > 1) {
            const centerNode = threeNodes.find(node => node.isCenter) || threeNodes[0];
            createBranch(centerNode, threeNodes[threeNodes.length - 1], "New Branch");
        }
        
        updateBranches();
        updateNodesList();
    }

    function updateNodesList() {
        $nodesStore = threeNodes.map((node, index) => ({
            id: index,
            x: node.position.x,
            y: node.position.y,
            z: node.position.z,
            isCenter: node.isCenter || false
        }));
    }

    // Update this function to include the isCenter property
    export function initializeNodesFromStore(storedNodes) {
        // Clear existing nodes first
        threeNodes.forEach(node => scene.remove(node));
        threeNodes = [];
        branches.forEach(branch => {
            scene.remove(branch.branch);
            scene.remove(branch.textLabel);
        });
        branches = [];

        // Recreate nodes from store
        storedNodes.forEach(node => {
            addNode(node.x, node.y, node.z, node.isCenter);
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