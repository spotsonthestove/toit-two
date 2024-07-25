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
            scene.background = new THREE.Color(0xf0f0f0);

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
            createNode(new THREE.Vector3(0, 0, 0));
            createNode(new THREE.Vector3(3, 2, 0));
            createNode(new THREE.Vector3(-2, 3, 1));

            // Create branches between nodes
            createBranch(nodes[0], nodes[1]);
            createBranch(nodes[0], nodes[2]);

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

    function createNode(position) {
        const nodeGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const nodeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        scene.add(node);
        nodes.push(node);
    }

    function createBranch(startNode, endNode) {
        const branchGeometry = createOrganicBranchGeometry(startNode.position, endNode.position);
        const branchMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        scene.add(branch);
        branches.push({ branch, startNode, endNode });
    }

    function createOrganicBranchGeometry(start, end) {
        const curve = new THREE.CatmullRomCurve3([
            start,
            new THREE.Vector3().lerpVectors(start, end, 0.25).add(new THREE.Vector3(0, 0.5, 0.5)),
            new THREE.Vector3().lerpVectors(start, end, 0.75).add(new THREE.Vector3(0, -0.5, -0.5)),
            end
        ]);

        const geometry = new THREE.TubeGeometry(curve, 64, 0.2, 8, false);
        return geometry;
    }

    function updateBranch(branchObj) {
        const { branch, startNode, endNode } = branchObj;
        const newGeometry = createOrganicBranchGeometry(startNode.position, endNode.position);
        branch.geometry.dispose();
        branch.geometry = newGeometry;
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