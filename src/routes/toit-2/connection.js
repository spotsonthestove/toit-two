import * as THREE from 'three';

export function createConnection(startNode, endNode) {
  const material = new THREE.LineBasicMaterial({
    color: 0x9ca3af,
    transparent: true,
    opacity: 0.6,
    linewidth: 2
  });

  const geometry = new THREE.BufferGeometry();
  const line = new THREE.Line(geometry, material);

  function update() {
    const startPos = startNode.getPosition();
    const endPos = endNode.getPosition();
    
    // Calculate control point for the curve
    const direction = new THREE.Vector3().subVectors(endPos, startPos);
    const distance = direction.length();
    const midPoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
    
    // Lift the curve higher for longer distances
    const lift = Math.min(distance * 0.5, 2);
    midPoint.y += lift;

    const curve = new THREE.QuadraticBezierCurve3(
      startPos,
      midPoint,
      endPos
    );

    // Increase point count for smoother curves
    const points = curve.getPoints(50);
    geometry.setFromPoints(points);
    geometry.computeBoundingSphere();
  }

  // Initial update
  update();

  return {
    line,
    startNode,
    endNode,
    update
  };
}