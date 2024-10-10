<script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { DragControls } from 'three/examples/jsm/controls/DragControls';
    import { nodes as nodesStore } from '../stores/mindMapStore';

    let container;
    let scene, camera, renderer, orbitControls, dragControls;
    let nodes = [];
    let branches = [];
    let isDragging = false;

    onMount(() => {
        init();
        animate();
    });

    function init() {
        scene = new THREE.Scene();
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

        // Event listeners
        window.addEventListener('resize', onWindowResize);
    }

    function createNode(position) {
        const nodeGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const nodeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        scene.add(node);
        nodes.push(node);
        updateNodesList();
    }

    function createBranch(startNode, endNode, label) {
        const branchGeometry = createCurvedPlaneGeometry(startNode.position, endNode.position);
        const branchMaterial = new THREE.MeshPhongMaterial({ 
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
        const height = width * 0.5;
        const segments = 20;

        const geometry = new THREE.PlaneGeometry(width, height, segments, 1);
        const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
        const normal = new THREE.Vector3().subVectors(end, start).normalize();
        const binormal = new THREE.Vector3(0, 1, 0);
        const tangent = new THREE.Vector3().crossVectors(normal, binormal);

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const pos = new THREE.Vector3().lerpVectors(start, end, t);
            const bulge = Math.sin(t * Math.PI) * height * 0.5;
            pos.addScaledVector(tangent, bulge);
            geometry.vertices[i].copy(pos);
        }

        geometry.computeVertexNormals();
        return geometry;
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
