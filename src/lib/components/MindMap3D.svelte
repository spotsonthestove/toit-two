<script>
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { DragControls } from 'three/examples/jsm/controls/DragControls';
    import { nodes as nodesStore } from '../stores/mindMapStore';

    let container;
    let scene, camera, renderer, orbitControls, dragControls;
    let threeNodes = []; // Renamed from 'nodes' to 'threeNodes'
    let branches = [];
    let isDragging = false;

    // let mindMapId = null;

    const dispatch = createEventDispatcher();

    onMount(() => {
        init();
        // loadMindMapState();
        if (container) {
            animate();
        } else {
            console.error('Container not available');
        }
    });

    // Function to load mind map state from the store
    // function loadMindMapState() {
    //     // ... (commented out)
    // }

    // Function to save mind map state to the store
    // function saveMindMapState() {
    //     // ... (commented out)
    // }

    // function generateUniqueId() {
    //     // ... (commented out)
    // }

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
        const nodeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        scene.add(node);
        threeNodes.push(node); // Use 'threeNodes' instead of 'nodes'
        updateNodesList();
    }

    function createBranch(startNode, endNode, label) {
        const branchGeometry = createOrganicBranchGeometry(startNode.position, endNode.position);
        const branchMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.7
        });
        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        scene.add(branch);
        
        const textLabel = createTextLabel(label);
        scene.add(textLabel);
        
        branches.push({ branch, startNode, endNode, textLabel });
        updateBranch(branches[branches.length - 1]);
        // saveMindMapState();
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

        const midpoint = new THREE.Vector3().lerpVectors(startNode.position, endNode.position, 0.5);
        textLabel.position.copy(midpoint);
        textLabel.lookAt(camera.position);

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

    export function addNode(x, y, z) {
        const newPosition = new THREE.Vector3(x, y, z);
        createNode(newPosition);
        
        if (threeNodes.length > 1) { // Use 'threeNodes' instead of 'nodes'
            createBranch(threeNodes[0], threeNodes[threeNodes.length - 1], "New Branch");
        }
        
        updateBranches();
        updateNodesList();
    }

    function updateNodesList() {
        $nodesStore = threeNodes.map((node, index) => ({
            id: index,
            x: node.position.x,
            y: node.position.y,
            z: node.position.z
        }));
    }

    // Remove this reactive statement as we're updating the store directly now
    // $: {
    //     if (nodes.length > 0) {
    //         updateNodesList();
    //     }
    // }

    // Add this function to initialize nodes from the store
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