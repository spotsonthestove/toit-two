<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { DragControls } from 'three/examples/jsm/controls/DragControls';
    import { nodes as nodesStore } from '../stores/mindMapStore';
    import { Vector3, QuadraticBezierCurve3, Scene, PerspectiveCamera, WebGLRenderer, Mesh, Material } from 'three';

    // Add type guard at the top level
    function isMesh(object: THREE.Object3D): object is THREE.Mesh {
        return 'geometry' in object && 'material' in object;
    }

    function disposeMaterial(material: Material | Material[]) {
        if (Array.isArray(material)) {
            material.forEach(m => m.dispose());
        } else {
            material.dispose();
        }
    }

    // Define types for THREE.js components
    let container: HTMLDivElement;
    let scene: Scene;
    let camera: PerspectiveCamera;
    let renderer: WebGLRenderer;
    let orbitControls: OrbitControls;
    let dragControls: DragControls;
    let threeNodes: THREE.Mesh[] = [];
    let branches: Array<{
        branch: THREE.Mesh;
        startNode: THREE.Mesh;
        endNode: THREE.Mesh;
        textLabel: THREE.Mesh;
        curve: THREE.QuadraticBezierCurve3;
    }> = [];
    let isDragging = false;

    interface Node extends THREE.Mesh {
        isCenter?: boolean;
    }

    interface NodeData {
        id: number;
        x: number;
        y: number;
        z: number;
        isCenter?: boolean;
    }

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
            
            // Initialize dragControls but don't set objects yet
            dragControls = new DragControls([], camera, renderer.domElement);
            setupDragControls();

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

    // New function to setup drag controls
    function setupDragControls() {
        // Update the objects the drag controls are tracking
        dragControls.dispose(); // Clean up old listeners
        dragControls = new DragControls(threeNodes, camera, renderer.domElement);

        dragControls.addEventListener('hoveron', function (event) {
            orbitControls.enabled = false;
            const object = event.object;
            if (object.material && 'emissive' in object.material) {
                object.material.emissive.setHex(0xff0000);
            }
        });

        dragControls.addEventListener('hoveroff', function (event) {
            orbitControls.enabled = true;
            const object = event.object;
            if (object.material && 'emissive' in object.material) {
                object.material.emissive.setHex(0x000000);
            }
        });

        dragControls.addEventListener('dragstart', function (event) {
            isDragging = true;
            orbitControls.enabled = false;
        });

        dragControls.addEventListener('drag', function (event) {
            if (isDragging) {
                updateBranches();
            }
        });

        dragControls.addEventListener('dragend', function (event) {
            isDragging = false;
            orbitControls.enabled = true;
            updateNodesList();
        });
    }

    function createNode(position: THREE.Vector3, isCenter = false): void {
        const nodeGeometry = new THREE.SphereGeometry(isCenter ? 0.75 : 0.5, 32, 32);
        const nodeMaterial = new THREE.MeshPhongMaterial({ 
            color: isCenter ? 0x4CAF50 : 0x00ff00,
            emissive: 0x000000 // Add emissive property
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial) as Node;
        node.position.copy(position);
        node.isCenter = isCenter;
        scene.add(node);
        threeNodes.push(node);
        
        // Refresh drag controls when adding new nodes
        setupDragControls();
    }

    function createBranch(startNode: Node, endNode: Node, label: string): void {
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

    function createOrganicBranchGeometry(start: THREE.Vector3, end: THREE.Vector3) {
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

    function createTextLabel(text: string): THREE.Mesh {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return new THREE.Mesh(); // Return empty mesh if context is null

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

    function updateBranch(branchObj: {
        branch: THREE.Mesh;
        startNode: Node;
        endNode: Node;
        textLabel: THREE.Mesh;
        curve: THREE.QuadraticBezierCurve3;
    }): void {
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

    export function addNode(x: number, y: number, z: number, isCenter = false): void {
        const newPosition = new THREE.Vector3(x, y, z);
        createNode(newPosition, isCenter);
        
        // Only create branches if this isn't the first node
        if (threeNodes.length > 1) {
            const centerNode = threeNodes.find(node => (node as Node).isCenter) || threeNodes[0];
            createBranch(centerNode as Node, threeNodes[threeNodes.length - 1] as Node, "New Branch");
        }
        
        updateBranches();
        updateNodesList();
    }

    function updateNodesList() {
        $nodesStore = threeNodes.map((node, index) => {
            const meshNode = node as Node;
            return {
                id: index,
                x: node.position.x,
                y: node.position.y,
                z: node.position.z,
                isCenter: meshNode.isCenter || false
            };
        });
    }

    // Update this function to include the isCenter property
    export function initializeNodesFromStore(nodeData: NodeData[]): void {
        clearExistingNodes();
        
        nodeData.forEach(node => {
            const position = new THREE.Vector3(node.x, node.y, node.z);
            createNode(position, node.isCenter);
        });
        
        // Recreate connections between nodes
        if (threeNodes.length > 1) {
            const centerNode = threeNodes.find(node => (node as Node).isCenter) || threeNodes[0];
            threeNodes.forEach((node, index) => {
                if (index > 0 && node !== centerNode) {
                    createBranch(centerNode as Node, node as Node, "Branch " + index);
                }
            });
        }
        
        // Refresh drag controls after initializing all nodes
        setupDragControls();
        
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    function clearExistingNodes() {
        if (scene) {
            // Remove all nodes and branches
            [...threeNodes].forEach(node => {
                scene.remove(node);
                if (isMesh(node)) {
                    if (node.geometry) node.geometry.dispose();
                    if (node.material) {
                        disposeMaterial(node.material);
                    }
                }
            });
            
            // Clear branches
            branches.forEach(({ branch, textLabel }) => {
                scene.remove(branch);
                scene.remove(textLabel);
                if (isMesh(branch)) {
                    if (branch.geometry) branch.geometry.dispose();
                    if (branch.material) {
                        disposeMaterial(branch.material);
                    }
                }
                if (isMesh(textLabel)) {
                    if (textLabel.geometry) textLabel.geometry.dispose();
                    if (textLabel.material) {
                        disposeMaterial(textLabel.material);
                    }
                }
            });

            // Reset arrays
            threeNodes = [];
            branches = [];
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