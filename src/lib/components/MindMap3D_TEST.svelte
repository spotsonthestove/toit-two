<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
    import { nodes as nodesStore } from '../stores/mindMapStore';
    import type { MindMapNode } from '$lib/types/mindmap';

    let animationFrameId: number;
    let container: HTMLDivElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let orbitControls: OrbitControls;
    let dragControls: DragControls;
    let threeNodes: THREE.Mesh[] = [];
    let branches: Array<{
        branch: THREE.Mesh;
        startNode: THREE.Mesh;
        endNode: THREE.Mesh;
        textMesh: THREE.Mesh;
        branchGroup: THREE.Group;
        textAligner: THREE.Object3D;
    }> = [];
    let isDragging = false;
    let isInitialized = false;

    const dispatch = createEventDispatcher();

    function isMesh(object: THREE.Object3D): object is THREE.Mesh {
        return 'geometry' in object && 'material' in object;
    }

    function disposeMaterial(material: THREE.Material | THREE.Material[]) {
        if (Array.isArray(material)) {
            material.forEach(m => m.dispose());
        } else {
            material.dispose();
        }
    }

    onMount(() => {
        if (!isInitialized) {
        init();
            isInitialized = true;
        }
    });

    onDestroy(() => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        cleanup();
    });

    function cleanup() {
        if (renderer) {
            renderer.dispose();
        }
        if (orbitControls) {
            orbitControls.dispose();
        }
        if (dragControls) {
            dragControls.dispose();
        }
        // Clean up geometries and materials
        threeNodes.forEach(node => {
            if (isMesh(node)) {
                scene?.remove(node);
                node.geometry.dispose();
                if (node.material) {
                    disposeMaterial(node.material);
                }
            }
        });
        
        branches.forEach(({ branch, textMesh, branchGroup }) => {
            scene?.remove(branchGroup); // Remove the entire branch group
            if (isMesh(branch)) {
                branch.geometry.dispose();
                if (branch.material) {
                    disposeMaterial(branch.material);
                }
            }
            if (isMesh(textMesh)) {
                textMesh.geometry.dispose();
                if (textMesh.material) {
                    disposeMaterial(textMesh.material);
                }
            }
        });
    }

    function init() {
        if (!container) return;

        // Scene setup
            scene = new THREE.Scene();
        scene.background = new THREE.Color(0xcccccc);

        // Camera setup
        const aspect = container.clientWidth / container.clientHeight;
        camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
            camera.position.z = 10;

        // Renderer setup
            renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: true
            });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

        // Controls setup
            orbitControls = new OrbitControls(camera, renderer.domElement);
        // orbitControls.enableDamping = true;
        // orbitControls.dampingFactor = 0.05;
            
            dragControls = new DragControls([], camera, renderer.domElement);
            setupDragControls();

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);

        // Handle window resize
            const handleResize = () => {
            if (!container || !camera || !renderer) return;
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            };
            window.addEventListener('resize', handleResize);

        // Start animation loop
        animate();
    }

    function setupDragControls() {
        if (!dragControls || !camera || !renderer) return;

        dragControls.dispose();
        dragControls = new DragControls(threeNodes, camera, renderer.domElement);

        dragControls.addEventListener('hoveron', function (event: any) {
            if (!orbitControls) return;
            orbitControls.enabled = false;
            const object = event.object;
            if (isMesh(object) && object.material && 'emissive' in object.material) {
                object.material.emissive.setHex(0x666666);
            }
        });

        dragControls.addEventListener('hoveroff', function (event: any) {
            if (!orbitControls) return;
            orbitControls.enabled = true;
            const object = event.object;
            if (isMesh(object) && object.material && 'emissive' in object.material) {
                object.material.emissive.setHex(0x000000);
            }
        });

        dragControls.addEventListener('dragstart', function (event: any) {
            if (!orbitControls) return;
            isDragging = true;
            orbitControls.enabled = false;
        });

        dragControls.addEventListener('drag', function () {
            if (isDragging) {
                updateBranches();
                updateNodePositions();
            }
        });

        dragControls.addEventListener('dragend', function () {
            if (!orbitControls) return;
            isDragging = false;
            orbitControls.enabled = true;
            updateNodePositions();
            updateBranches();
        });

        renderer.domElement.addEventListener('click', handleClick);
    }

    function handleClick(event: MouseEvent) {
        if (isDragging || !camera || !renderer) return;
        
        event.preventDefault();
        
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(threeNodes, false);
        
        if (intersects.length > 0) {
            const clickedNode = intersects[0].object as THREE.Mesh;
            const nodeData = $nodesStore.find(n => n.id === clickedNode.userData.id);
            if (nodeData) {
                dispatch('nodeSelect', {
                    nodeId: nodeData.id,
                    position: {
                        x: clickedNode.position.x,
                        y: clickedNode.position.y,
                        z: clickedNode.position.z
                    },
                    nodeData
                });
            }
        }
    }

    function createNode(position: THREE.Vector3, nodeData: MindMapNode): THREE.Mesh {
        if (!scene) return;

        // Adjust node size based on whether it's the center node
        const radius = nodeData.isCenter ? 1.0 : 0.5;
        const nodeGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const nodeMaterial = new THREE.MeshPhongMaterial({ 
            color: nodeData.isCenter ? 0x2E7D32 : 0x4CAF50, // Darker green for center
            emissive: 0x000000,
            shininess: 100,
            specular: 0x444444
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        node.userData = { 
            id: nodeData.id,
            parentId: nodeData.parentId,
            title: nodeData.title,
            description: nodeData.description,
            nodeType: nodeData.nodeType,
            isCenter: nodeData.isCenter
        };
        scene.add(node);
        threeNodes.push(node);
        
        if (nodeData.parentId !== null && !nodeData.isCenter) {
            const parentNode = threeNodes.find(n => n.userData.id === nodeData.parentId);
            if (parentNode) {
                createBranch(parentNode, node);
            }
        }
        
        setupDragControls();
        return node;
    }

    function createBranch(startNode: THREE.Mesh, endNode: THREE.Mesh) {
        if (!scene || !camera) return;

        // Create a group to hold branch and text
        const branchGroup = new THREE.Group();
        scene.add(branchGroup);

        const points = [];
        const startPoint = startNode.position;
        const endPoint = endNode.position;
        
        // Calculate control points for a more natural curve
        const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
        const distance = direction.length();
        const midPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
        const offset = Math.min(distance * 0.25, 1.0);
        midPoint.y += offset;

        // Create curve points
        for (let i = 0; i <= 30; i++) {
            const t = i / 30;
            const point = new THREE.Vector3();
            point.x = startPoint.x * (1 - t) * (1 - t) + midPoint.x * 2 * (1 - t) * t + endPoint.x * t * t;
            point.y = startPoint.y * (1 - t) * (1 - t) + midPoint.y * 2 * (1 - t) * t + endPoint.y * t * t;
            point.z = startPoint.z * (1 - t) * (1 - t) + midPoint.z * 2 * (1 - t) * t + endPoint.z * t * t;
            points.push(point);
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const segments = 30;
        const radiusSegments = 8;
        const startRadius = 0.1;
        const endRadius = 0.03;
        
        // Create branch geometry
        const frames = curve.computeFrenetFrames(segments);
        const branchGeometry = new THREE.BufferGeometry();
        const vertices = [];
        const indices = [];
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const radius = startRadius * (1 - t) + endRadius * t;
            const point = curve.getPointAt(t);
            const normal = frames.normals[i];
            const binormal = frames.binormals[i];

            for (let j = 0; j < radiusSegments; j++) {
                const angle = (j / radiusSegments) * Math.PI * 2;
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);
                const x = point.x + radius * (cos * normal.x + sin * binormal.x);
                const y = point.y + radius * (cos * normal.y + sin * binormal.y);
                const z = point.z + radius * (cos * normal.z + sin * binormal.z);
                vertices.push(x, y, z);
            }
        }

        // Create faces
        for (let i = 0; i < segments; i++) {
            const offset = i * radiusSegments;
            for (let j = 0; j < radiusSegments; j++) {
                const a = offset + j;
                const b = offset + ((j + 1) % radiusSegments);
                const c = offset + radiusSegments + ((j + 1) % radiusSegments);
                const d = offset + radiusSegments + j;
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        branchGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        branchGeometry.setIndex(indices);
        branchGeometry.computeVertexNormals();

        const branchMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8B4513,
            transparent: true,
            opacity: 0.9,
            shininess: 30
        });

        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        branchGroup.add(branch);

        // Create text canvas with dark background for better visibility
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 1024;
        canvas.height = 256;
        
        if (context) {
            context.fillStyle = 'rgba(0, 0, 0, 0.6)'; // Semi-transparent dark background
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = 'bold 72px Arial';
            context.fillStyle = 'white';
            context.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            context.lineWidth = 6;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            
            const text = endNode.userData.title || '';
            context.strokeText(text, canvas.width / 2, canvas.height / 2);
            context.fillText(text, canvas.width / 2, canvas.height / 2);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            alphaTest: 0.1
        });

        // Create text mesh
        const textGeometry = new THREE.PlaneGeometry(3, 0.75);
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Create a helper object to align text with curve
        const textAligner = new THREE.Object3D();
        const midPoint3D = curve.getPointAt(0.5);
        const tangent = curve.getTangentAt(0.5);
        
        textAligner.position.copy(midPoint3D);
        
        // Orient text to follow branch direction
        const up = new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3().crossVectors(up, tangent).normalize();
        
        textAligner.lookAt(endPoint);
        textAligner.rotateOnAxis(right, Math.PI / 2); // Rotate to align with branch
        
        // Offset text above branch
        const midpointRadius = startRadius * 0.5 + endRadius * 0.5;
        textMesh.position.y = midpointRadius * 3;
        
        textAligner.add(textMesh);
        branchGroup.add(textAligner);
        
        branches.push({ 
            branch, 
            startNode, 
            endNode, 
            textMesh, 
            branchGroup,
            textAligner 
        });
    }

    function updateBranches() {
        if (!camera) return;

        branches.forEach(({ branch, startNode, endNode, textMesh, branchGroup, textAligner }) => {
            const points = [];
            const startPoint = startNode.position;
            const endPoint = endNode.position;
            
            const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
            const distance = direction.length();
            const midPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
            const offset = Math.min(distance * 0.25, 1.0);
            midPoint.y += offset;

            for (let i = 0; i <= 30; i++) {
                const t = i / 30;
                const point = new THREE.Vector3();
                point.x = startPoint.x * (1 - t) * (1 - t) + midPoint.x * 2 * (1 - t) * t + endPoint.x * t * t;
                point.y = startPoint.y * (1 - t) * (1 - t) + midPoint.y * 2 * (1 - t) * t + endPoint.y * t * t;
                point.z = startPoint.z * (1 - t) * (1 - t) + midPoint.z * 2 * (1 - t) * t + endPoint.z * t * t;
                points.push(point);
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const segments = 30;
            const radiusSegments = 8;
            const startRadius = 0.1;
            const endRadius = 0.03;
            
            // Update branch geometry
            const frames = curve.computeFrenetFrames(segments);
            const newGeometry = new THREE.BufferGeometry();
            const vertices = [];
            const indices = [];
            
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const radius = startRadius * (1 - t) + endRadius * t;
                const point = curve.getPointAt(t);
                const normal = frames.normals[i];
                const binormal = frames.binormals[i];

                for (let j = 0; j < radiusSegments; j++) {
                    const angle = (j / radiusSegments) * Math.PI * 2;
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);
                    const x = point.x + radius * (cos * normal.x + sin * binormal.x);
                    const y = point.y + radius * (cos * normal.y + sin * binormal.y);
                    const z = point.z + radius * (cos * normal.z + sin * binormal.z);
                    vertices.push(x, y, z);
                }
            }

            // Update faces
            for (let i = 0; i < segments; i++) {
                const offset = i * radiusSegments;
                for (let j = 0; j < radiusSegments; j++) {
                    const a = offset + j;
                    const b = offset + ((j + 1) % radiusSegments);
                    const c = offset + radiusSegments + ((j + 1) % radiusSegments);
                    const d = offset + radiusSegments + j;
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }

            newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            newGeometry.setIndex(indices);
            newGeometry.computeVertexNormals();

            branch.geometry.dispose();
            branch.geometry = newGeometry;

            // Update text aligner position and orientation
            const midPoint3D = curve.getPointAt(0.5);
            const tangent = curve.getTangentAt(0.5);
            
            textAligner.position.copy(midPoint3D);
            
            const up = new THREE.Vector3(0, 1, 0);
            const right = new THREE.Vector3().crossVectors(up, tangent).normalize();
            
            textAligner.lookAt(endPoint);
            textAligner.rotateOnAxis(right, Math.PI / 2);
            
            // Keep text offset
            const midpointRadius = startRadius * 0.5 + endRadius * 0.5;
            textMesh.position.y = midpointRadius * 3;
        });
    }

    function updateNodePositions() {
        threeNodes.forEach(node => {
            const storeNode = $nodesStore.find(n => n.id === node.userData.id);
            if (storeNode) {
                storeNode.x = node.position.x;
                storeNode.y = node.position.y;
                storeNode.z = node.position.z;
                }
            });
        nodesStore.set($nodesStore);
    }

    function animate() {
        if (!scene || !camera || !renderer || !orbitControls) return;
        
        animationFrameId = requestAnimationFrame(animate);
        orbitControls.update();
        
        // Remove the text orientation update since we want it to stay aligned with the branch
        renderer.render(scene, camera);
    }

    export function initializeNodesFromStore(nodes: MindMapNode[]) {
        if (!scene) return;

        // Clear existing nodes and branches
        threeNodes.forEach(node => {
            scene.remove(node);
            if (isMesh(node)) {
                node.geometry.dispose();
                if (node.material) {
                    disposeMaterial(node.material);
                }
            }
        });
            
        branches.forEach(({ branch, textMesh, branchGroup }) => {
            scene.remove(branchGroup); // Remove the entire branch group
            if (isMesh(branch)) {
                branch.geometry.dispose();
                if (branch.material) {
                    disposeMaterial(branch.material);
                }
            }
            if (isMesh(textMesh)) {
                textMesh.geometry.dispose();
                if (textMesh.material) {
                    disposeMaterial(textMesh.material);
                }
            }
        });

        threeNodes = [];
        branches = [];

        // Create new nodes
        nodes.forEach(nodeData => {
            const position = new THREE.Vector3(nodeData.x, nodeData.y, nodeData.z);
            createNode(position, nodeData);
        });

        setupDragControls();
    }

    export function addNodeToScene(nodeData: MindMapNode) {
        if (!scene) return;
        const position = new THREE.Vector3(nodeData.x, nodeData.y, nodeData.z);
        createNode(position, nodeData);
    }

    export function updateNode(nodeData: MindMapNode) {
        if (!scene) return;
        const node = threeNodes.find(n => n.userData.id === nodeData.id);
        if (node) {
            node.userData = {
                ...node.userData,
                title: nodeData.title,
                description: nodeData.description
            };
            
            // Update branch text if this node has a parent
            const branch = branches.find(b => b.endNode === node);
            if (branch) {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 64;

                if (context) {
                    context.font = '24px Arial';
                    context.fillStyle = 'white';
                    context.textAlign = 'center';
                    context.fillText(nodeData.title || '', canvas.width / 2, canvas.height / 2);
                }

                const texture = new THREE.CanvasTexture(canvas);
                if (branch.textMesh.material instanceof THREE.MeshBasicMaterial) {
                    branch.textMesh.material.map = texture;
                    branch.textMesh.material.needsUpdate = true;
                }
            }
        }
    }
</script>

<div bind:this={container}></div>

<style>
    div {
        width: 100%;
        height: 100vh;
        background: rgba(204, 204, 204, 0.5);
    }
</style>