<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three.js Scene</title>
    <style>
        body { margin: 0; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        // Set up the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Create a large circle
        const circleGeometry = new THREE.CircleGeometry(2, 64);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        scene.add(circle);

        // Create arc segments
        const arcMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });

        function createArc(innerRadius, outerRadius, startAngle, endAngle) {
            const arcShape = new THREE.Shape();
            arcShape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
            arcShape.absarc(0, 0, innerRadius, endAngle, startAngle, true);
            const arcGeometry = new THREE.ShapeGeometry(arcShape);
            const arc = new THREE.Mesh(arcGeometry, arcMaterial);
            return arc;
        }

        const arc1 = createArc(2.1, 2.2, Math.PI * 0.75, Math.PI * 1.25);
        const arc2 = createArc(2.1, 2.2, Math.PI * 1.5, Math.PI * 1.75);
        const arc3 = createArc(2.1, 2.2, Math.PI * 0.25, Math.PI * 0.5);

        scene.add(arc1);
        scene.add(arc2);
        scene.add(arc3);

        // Position the camera
        camera.position.z = 5;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            // Rotate the circle and arcs
            circle.rotation.z += 0.01;
            arc1.rotation.z += 0.01;
            arc2.rotation.z += 0.01;
            arc3.rotation.z += 0.01;

            // Render the scene
            renderer.render(scene, camera);
        }
        animate();
    </script>
</body>
</html>
