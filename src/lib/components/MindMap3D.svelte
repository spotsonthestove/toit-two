<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
    import { nodes as nodesStore } from '../stores/mindMapStore';
    import { mindMapTheme } from '../stores/themeStore';
    import type { MindMapNode } from '$lib/types/mindmap';
    import type { MindMapTheme } from '../stores/themeStore';

    // Add theme prop with default value
    export let theme: MindMapTheme = 'default';

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
    }> = [];
    let isDragging = false;
    let isInitialized = false;
    let currentTheme: MindMapTheme = theme;

    // Subscribe to theme changes
    $: {
        if (theme !== currentTheme && isInitialized) {
            currentTheme = theme;
            updateNodesAppearance();
        }
    }

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
                node.geometry.dispose();
                if (node.material) {
                    disposeMaterial(node.material);
                }
        }
    });
        branches.forEach(({ branch, textMesh, branchGroup }) => {
            scene.remove(branchGroup);
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

        dragControls.addEventListener('hoveron', (event) => {
            orbitControls.enabled = false;
            const mesh = event.object as THREE.Mesh;
            
            // Handle hover effect based on theme
            if (mesh.userData.theme === 'scifi') {
                if (mesh.material instanceof THREE.MeshPhongMaterial) {
                    mesh.material.emissiveIntensity = 1.0;
                    mesh.material.needsUpdate = true;
                }
            } else {
                if (mesh.material instanceof THREE.MeshPhongMaterial) {
                    mesh.material.emissive.setHex(0x666666);
                }
            }
        });

        dragControls.addEventListener('hoveroff', (event) => {
            orbitControls.enabled = true;
            const mesh = event.object as THREE.Mesh;
            
            // Handle hover effect based on theme
            if (mesh.userData.theme === 'scifi') {
                if (mesh.material instanceof THREE.MeshPhongMaterial) {
                    mesh.material.emissiveIntensity = 0.5;
                    mesh.material.needsUpdate = true;
                }
            } else {
                if (mesh.material instanceof THREE.MeshPhongMaterial) {
                    mesh.material.emissive.setHex(0x000000);
                }
            }
        });

        dragControls.addEventListener('dragstart', function (event: any) {
            if (!orbitControls) return;
            isDragging = true;
            orbitControls.enabled = false;
        });

        dragControls.addEventListener('drag', function (event: any) {
            if (isDragging) {
                updateBranches();
                updateNodePositions();
            }
        });

        dragControls.addEventListener('dragend', function (event: any) {
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

    function createNode(position: THREE.Vector3, nodeData: MindMapNode): THREE.Mesh | undefined {
        if (!scene) return undefined;

        // Create node geometry based on theme
        const nodeGeometry = new THREE.SphereGeometry(
            nodeData.isCenter ? 0.75 : 0.5, 
            currentTheme === 'scifi' ? 16 : 32, 
            currentTheme === 'scifi' ? 16 : 32
        );
        
        // Create node material based on theme
        let nodeMaterial;
        if (currentTheme === 'scifi') {
            // Sci-fi wireframe style
            nodeMaterial = new THREE.MeshPhongMaterial({ 
                color: nodeData.isCenter ? 0x00ffaa : 0x00aaff,
                wireframe: true,
                emissive: nodeData.isCenter ? 0x00aa77 : 0x0077aa,
                emissiveIntensity: 0.5,
                shininess: 100
            });
        } else {
            // Default solid style
            nodeMaterial = new THREE.MeshPhongMaterial({ 
                color: nodeData.isCenter ? 0x4CAF50 : 0x00ff00,
                emissive: 0x000000,
                shininess: 100
            });
        }
        
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        node.userData = { 
            id: nodeData.id,
            parentId: nodeData.parentId,
            title: nodeData.title,
            description: nodeData.description,
            nodeType: nodeData.nodeType,
            isCenter: nodeData.isCenter,
            theme: currentTheme
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

        // Get the positions directly from the nodes
        const startPoint = startNode.position;
        const endPoint = endNode.position;
        const midPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
        midPoint.y += 0.5;

        const points = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const point = new THREE.Vector3();
            point.x = startPoint.x * (1 - t) * (1 - t) + midPoint.x * 2 * (1 - t) * t + endPoint.x * t * t;
            point.y = startPoint.y * (1 - t) * (1 - t) + midPoint.y * 2 * (1 - t) * t + endPoint.y * t * t;
            point.z = startPoint.z * (1 - t) * (1 - t) + midPoint.z * 2 * (1 - t) * t + endPoint.z * t * t;
            points.push(point);
        }

        // Create a custom curve for the branch
        const curve = new THREE.CatmullRomCurve3(points);
        
        // Create a tapered tube geometry - wider at start, narrower at end
        const radiusSegments = 8;
        const tubularSegments = 64;
        
        // Custom geometry for tapered tube
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const indices = [];
        
        // Generate vertices for the tube with varying radius
        for (let i = 0; i <= tubularSegments; i++) {
            const u = i / tubularSegments;
            const point = curve.getPoint(u);
            
            // Calculate radius that tapers from start to end (0.08 to 0.03)
            const radius = 0.08 - (u * 0.05);
            
            // Create circle at this point
            for (let j = 0; j < radiusSegments; j++) {
                const v = j / radiusSegments;
                const theta = v * Math.PI * 2;
                
                // Calculate normal vector for the tube
                const normal = new THREE.Vector3();
                if (i < tubularSegments) {
                    const pointAhead = curve.getPoint((i + 1) / tubularSegments);
                    normal.subVectors(pointAhead, point).normalize();
                } else {
                    const pointBehind = curve.getPoint((i - 1) / tubularSegments);
                    normal.subVectors(point, pointBehind).normalize();
                }
                
                // Calculate binormal and tangent
                const binormal = new THREE.Vector3(0, 1, 0).cross(normal).normalize();
                const tangent = normal.clone().cross(binormal).normalize();
                
                // Calculate position of vertex
                const cx = point.x + radius * Math.cos(theta) * binormal.x + radius * Math.sin(theta) * tangent.x;
                const cy = point.y + radius * Math.cos(theta) * binormal.y + radius * Math.sin(theta) * tangent.y;
                const cz = point.z + radius * Math.cos(theta) * binormal.z + radius * Math.sin(theta) * tangent.z;
                
                vertices.push(cx, cy, cz);
            }
        }
        
        // Generate indices for the tube
        for (let i = 0; i < tubularSegments; i++) {
            for (let j = 0; j < radiusSegments; j++) {
                const a = i * radiusSegments + j;
                const b = i * radiusSegments + ((j + 1) % radiusSegments);
                const c = (i + 1) * radiusSegments + ((j + 1) % radiusSegments);
                const d = (i + 1) * radiusSegments + j;
                
                // Add two triangles for each quad
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }
        
        // Set attributes for the geometry
        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();

        const branchMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.7,
            shininess: 30
        });

        const branch = new THREE.Mesh(geometry, branchMaterial);
        branchGroup.add(branch);

        // Create text with dark color and transparent background
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Add text with dark color - increased font size
            context.font = 'bold 56px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            
            const text = endNode.userData.title || '';
            // Add text outline in lighter color for contrast
            context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            context.lineWidth = 5;
            context.strokeText(text, canvas.width / 2, canvas.height / 2);
            
            // Add text fill in dark color
            context.fillStyle = '#222222';
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

        // Increased text size
        const textGeometry = new THREE.PlaneGeometry(2.5, 0.6);
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Calculate direction for orientation
        const direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        
        // Create a local coordinate system for the text
        const right = new THREE.Vector3().crossVectors(direction, up).normalize();
        const textUp = new THREE.Vector3().crossVectors(right, direction).normalize();
        
        // Position text at midpoint relative to branch but with more offset
        const localMidpoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
        localMidpoint.y += 0.6; // Increased offset to move text further from branch
        textMesh.position.copy(localMidpoint);
        
        // Orient text to align with branch direction
        const textMatrix = new THREE.Matrix4();
        textMatrix.makeBasis(direction, textUp, right);
        textMesh.rotation.setFromRotationMatrix(textMatrix);
        
        branchGroup.add(textMesh);
        
        branches.push({ 
            branch, 
            startNode, 
            endNode, 
            textMesh,
            branchGroup
        });
    }

    function updateBranches() {
        if (!camera) return;

        branches.forEach(({ branch, startNode, endNode, textMesh, branchGroup }) => {
            // Get the actual positions, accounting for nodes that might be in groups
            const startPoint = startNode.position;
            const endPoint = endNode.position;
            const midPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
            midPoint.y += 0.5;

            const points = [];
            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                const point = new THREE.Vector3();
                point.x = startPoint.x * (1 - t) * (1 - t) + midPoint.x * 2 * (1 - t) * t + endPoint.x * t * t;
                point.y = startPoint.y * (1 - t) * (1 - t) + midPoint.y * 2 * (1 - t) * t + endPoint.y * t * t;
                point.z = startPoint.z * (1 - t) * (1 - t) + midPoint.z * 2 * (1 - t) * t + endPoint.z * t * t;
                points.push(point);
            }

            // Create a custom curve for the branch
            const curve = new THREE.CatmullRomCurve3(points);
            
            // Create a tapered tube geometry - wider at start, narrower at end
            const radiusSegments = 8;
            const tubularSegments = 64;
            
            // Custom geometry for tapered tube
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const indices = [];
            
            // Generate vertices for the tube with varying radius
            for (let i = 0; i <= tubularSegments; i++) {
                const u = i / tubularSegments;
                const point = curve.getPoint(u);
                
                // Calculate radius that tapers from start to end (0.08 to 0.03)
                const radius = 0.08 - (u * 0.05);
                
                // Create circle at this point
                for (let j = 0; j < radiusSegments; j++) {
                    const v = j / radiusSegments;
                    const theta = v * Math.PI * 2;
                    
                    // Calculate normal vector for the tube
                    const normal = new THREE.Vector3();
                    if (i < tubularSegments) {
                        const pointAhead = curve.getPoint((i + 1) / tubularSegments);
                        normal.subVectors(pointAhead, point).normalize();
                    } else {
                        const pointBehind = curve.getPoint((i - 1) / tubularSegments);
                        normal.subVectors(point, pointBehind).normalize();
                    }
                    
                    // Calculate binormal and tangent
                    const binormal = new THREE.Vector3(0, 1, 0).cross(normal).normalize();
                    const tangent = normal.clone().cross(binormal).normalize();
                    
                    // Calculate position of vertex
                    const cx = point.x + radius * Math.cos(theta) * binormal.x + radius * Math.sin(theta) * tangent.x;
                    const cy = point.y + radius * Math.cos(theta) * binormal.y + radius * Math.sin(theta) * tangent.y;
                    const cz = point.z + radius * Math.cos(theta) * binormal.z + radius * Math.sin(theta) * tangent.z;
                    
                    vertices.push(cx, cy, cz);
                }
            }
            
            // Generate indices for the tube
            for (let i = 0; i < tubularSegments; i++) {
                for (let j = 0; j < radiusSegments; j++) {
                    const a = i * radiusSegments + j;
                    const b = i * radiusSegments + ((j + 1) % radiusSegments);
                    const c = (i + 1) * radiusSegments + ((j + 1) % radiusSegments);
                    const d = (i + 1) * radiusSegments + j;
                    
                    // Add two triangles for each quad
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }
            
            // Set attributes for the geometry
            geometry.setIndex(indices);
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.computeVertexNormals();

            // Dispose of old geometry and update with new one
            branch.geometry.dispose();
            branch.geometry = geometry;

            // Update text content with dark color
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 128;
            
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                // Add text with dark color - increased font size
                context.font = 'bold 56px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                
                const text = endNode.userData.title || '';
                // Add text outline in lighter color for contrast
                context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                context.lineWidth = 5;
                context.strokeText(text, canvas.width / 2, canvas.height / 2);
                
                // Add text fill in dark color
                context.fillStyle = '#222222';
                context.fillText(text, canvas.width / 2, canvas.height / 2);
            }
            
            if (textMesh.material instanceof THREE.MeshBasicMaterial) {
                const texture = new THREE.CanvasTexture(canvas);
                texture.needsUpdate = true;
                textMesh.material.map = texture;
                textMesh.material.needsUpdate = true;
            }

            // Calculate direction for orientation
            const direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
            const up = new THREE.Vector3(0, 1, 0);
            
            // Create a local coordinate system for the text
            const right = new THREE.Vector3().crossVectors(direction, up).normalize();
            const textUp = new THREE.Vector3().crossVectors(right, direction).normalize();
            
            // Position text at midpoint relative to branch but with more offset
            const localMidpoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
            localMidpoint.y += 0.6; // Increased offset to move text further from branch
            textMesh.position.copy(localMidpoint);
            
            // Orient text to align with branch direction
            const textMatrix = new THREE.Matrix4();
            textMatrix.makeBasis(direction, textUp, right);
            textMesh.rotation.setFromRotationMatrix(textMatrix);
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
        renderer.render(scene, camera);
    }

    // Add function to update nodes appearance when theme changes
    function updateNodesAppearance() {
        if (!scene) return;
        
        threeNodes.forEach(node => {
            // Get node data
            const nodeData = $nodesStore.find(n => n.id === node.userData.id);
            if (!nodeData) return;
            
            // Skip if the node is already using the current theme
            if (node.userData.theme === currentTheme) return;
            
            // Update the node's theme in userData
            node.userData.theme = currentTheme;
            
            // Dispose of old geometry and material
            node.geometry.dispose();
            if (Array.isArray(node.material)) {
                node.material.forEach(m => m.dispose());
            } else if (node.material) {
                node.material.dispose();
            }
            
            // Create new geometry based on theme
            node.geometry = new THREE.SphereGeometry(
                nodeData.isCenter ? 0.75 : 0.5, 
                currentTheme === 'scifi' ? 16 : 32, 
                currentTheme === 'scifi' ? 16 : 32
            );
            
            // Create new material based on theme
            if (currentTheme === 'scifi') {
                // Sci-fi wireframe style
                node.material = new THREE.MeshPhongMaterial({ 
                    color: nodeData.isCenter ? 0x00ffaa : 0x00aaff,
                    wireframe: true,
                    emissive: nodeData.isCenter ? 0x00aa77 : 0x0077aa,
                    emissiveIntensity: 0.5,
                    shininess: 100
                });
            } else {
                // Default solid style
                node.material = new THREE.MeshPhongMaterial({ 
                    color: nodeData.isCenter ? 0x4CAF50 : 0x00ff00,
                    emissive: 0x000000,
                    shininess: 100
                });
            }
        });
    }

    // Update initializeNodesFromStore to use the current theme
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
            scene.remove(branchGroup);
            scene.remove(textMesh);
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
            // Update userData for all node types
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
                canvas.width = 512;
                canvas.height = 128;

                if (context) {
                    // Increased font size for better visibility
                    context.font = 'bold 56px Arial';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    
                    const text = nodeData.title || '';
                    // Add text outline in lighter color for contrast
                    context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                    context.lineWidth = 5;
                    context.strokeText(text, canvas.width / 2, canvas.height / 2);
                    
                    // Add text fill in dark color
                    context.fillStyle = '#222222';
                    context.fillText(text, canvas.width / 2, canvas.height / 2);
                }

                const texture = new THREE.CanvasTexture(canvas);
                if (branch.textMesh.material instanceof THREE.MeshBasicMaterial) {
                    branch.textMesh.material.map = texture;
                    branch.textMesh.material.needsUpdate = true;
                }
            }
        }
    }

    // Force-directed layout implementation
    export function applyForceDirectedLayout() {
        if (!scene || threeNodes.length === 0) return;
        
        // Find center node
        const centerNode = threeNodes.find(node => node.userData.isCenter);
        if (!centerNode) return;
        
        // Set center node at origin
        centerNode.position.set(0, 0, 0);
        
        // Create simulation objects for each node
        const nodeSimulations = threeNodes.map(node => ({
            node,
            velocity: new THREE.Vector3(0, 0, 0),
            force: new THREE.Vector3(0, 0, 0)
        }));
        
        // Parameters for the simulation
        const repulsionStrength = 5;  // Strength of repulsion between nodes
        const attractionStrength = 0.2;  // Strength of attraction between connected nodes
        const centerAttractionStrength = 0.05;  // Strength of attraction to center
        const damping = 0.8;  // Damping factor to prevent oscillation
        const iterations = 100;  // Number of simulation iterations
        
        // Run simulation
        for (let i = 0; i < iterations; i++) {
            // Reset forces
            nodeSimulations.forEach(sim => {
                sim.force.set(0, 0, 0);
            });
            
            // Apply repulsion forces between all nodes
            for (let j = 0; j < nodeSimulations.length; j++) {
                for (let k = j + 1; k < nodeSimulations.length; k++) {
                    const nodeA = nodeSimulations[j];
                    const nodeB = nodeSimulations[k];
                    
                    const direction = new THREE.Vector3().subVectors(
                        nodeB.node.position,
                        nodeA.node.position
                    );
                    
                    const distance = direction.length();
                    
                    // Avoid division by zero
                    if (distance === 0) continue;
                    
                    // Normalize direction
                    direction.normalize();
                    
                    // Calculate repulsion force (inverse square law)
                    const repulsionForce = repulsionStrength / (distance * distance);
                    
                    // Apply repulsion in opposite directions
                    nodeA.force.sub(direction.clone().multiplyScalar(repulsionForce));
                    nodeB.force.add(direction.clone().multiplyScalar(repulsionForce));
                }
            }
            
            // Apply attraction forces between connected nodes
            branches.forEach(({ startNode, endNode }) => {
                const startSim = nodeSimulations.find(sim => sim.node === startNode);
                const endSim = nodeSimulations.find(sim => sim.node === endNode);
                
                if (!startSim || !endSim) return;
                
                const direction = new THREE.Vector3().subVectors(
                    endSim.node.position,
                    startSim.node.position
                );
                
                const distance = direction.length();
                
                // Normalize direction
                direction.normalize();
                
                // Calculate attraction force (linear with distance)
                const attractionForce = attractionStrength * distance;
                
                // Apply attraction in opposite directions
                startSim.force.add(direction.clone().multiplyScalar(attractionForce));
                endSim.force.sub(direction.clone().multiplyScalar(attractionForce));
            });
            
            // Apply center attraction for non-center nodes
            nodeSimulations.forEach(sim => {
                if (sim.node !== centerNode) {
                    const direction = new THREE.Vector3().subVectors(
                        centerNode.position,
                        sim.node.position
                    );
                    
                    const distance = direction.length();
                    
                    // Normalize direction
                    direction.normalize();
                    
                    // Calculate center attraction force (linear with distance)
                    const centerAttractionForce = centerAttractionStrength * distance;
                    
                    // Apply center attraction
                    sim.force.add(direction.clone().multiplyScalar(centerAttractionForce));
                }
            });
            
            // Update velocities and positions
            nodeSimulations.forEach(sim => {
                // Skip center node
                if (sim.node === centerNode) return;
                
                // Update velocity with force and damping
                sim.velocity.add(sim.force);
                sim.velocity.multiplyScalar(damping);
                
                // Update position
                sim.node.position.add(sim.velocity);
            });
        }
        
        // Update branches and node positions in store
        updateBranches();
        updateNodePositions();
    }

    // Layout selection function
    export function applyLayout(layoutType: string) {
        switch(layoutType) {
            case 'force':
                applyForceDirectedLayout();
                break;
            // Other layout types can be added here
            default:
                console.warn('Unknown layout type:', layoutType);
        }
    }

    // Add function to switch theme
    export function switchTheme(newTheme: MindMapTheme) {
        currentTheme = newTheme;
        updateNodesAppearance();
    }

    export function clearScene() {
        if (!scene) return;
        
        // Clear existing nodes and branches
        threeNodes.forEach(node => {
            scene.remove(node);
            
            // Dispose of geometry and materials
            if (isMesh(node)) {
                node.geometry.dispose();
                if (node.material) {
                    disposeMaterial(node.material);
                }
            }
        });
        
        branches.forEach(({ branch, textMesh, branchGroup }) => {
            scene.remove(branchGroup);
            
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
        
        // Reset arrays
        threeNodes = [];
        branches = [];
        
        // Update drag controls
        setupDragControls();
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