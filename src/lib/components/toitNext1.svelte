<script lang="ts">
  import { spring } from 'svelte/motion';

  export let size = 200;
  export let strokeWidth = 4;
  export let colors = ["#3498db", "#e74c3c", "#2ecc71"];

  let activeSegment = 0;
  let isDragging = false;
  let startAngle = 0;

  const angles = spring([2 * Math.PI / 3, 4 * Math.PI / 3, 2 * Math.PI], {
    stiffness: 0.1,
    damping: 0.6
  });

  $: radius = size / 2;
  $: innerRadius = radius - strokeWidth / 2;

  function startDrag(event: MouseEvent, index: number) {
    isDragging = true;
    activeSegment = index;
    startAngle = Math.atan2(event.clientY - radius, event.clientX - radius);
  }

  function drag(event: MouseEvent) {
    if (!isDragging) return;
    const currentAngle = Math.atan2(event.clientY - radius, event.clientX - radius);
    let angleDiff = currentAngle - startAngle;
    if (angleDiff < 0) angleDiff += 2 * Math.PI;

    const newAngles = [...$angles];
    newAngles[activeSegment] += angleDiff;
    newAngles[(activeSegment + 1) % 3] -= angleDiff;

    // Ensure angles stay within bounds
    newAngles.forEach((angle, i) => {
      if (angle < 0.1) newAngles[i] = 0.1;
      if (angle > 2 * Math.PI - 0.1) newAngles[i] = 2 * Math.PI - 0.1;
    });

    angles.set(newAngles);
    startAngle = currentAngle;
  }

  function endDrag() {
    isDragging = false;
  }
</script>

<div class="circle-segment" style="width: {size}px; height: {size}px;">
  <svg viewBox="0 0 {size} {size}" on:mousemove={drag} on:mouseup={endDrag} on:mouseleave={endDrag}>
    {#each $angles as angle, i}
      {@const startAngle = i === 0 ? 0 : $angles[i - 1]}
      {@const endAngle = angle}
      <path
        class="segment"
        d="M {radius} {radius}
           L {radius + innerRadius * Math.cos(startAngle)} {radius + innerRadius * Math.sin(startAngle)}
           A {innerRadius} {innerRadius} 0 {endAngle - startAngle > Math.PI ? 1 : 0} 1 {radius + innerRadius * Math.cos(endAngle)} {radius + innerRadius * Math.sin(endAngle)}
           Z"
        fill={colors[i]}
        stroke="white"
        stroke-width={strokeWidth}
        on:mousedown={(e) => startDrag(e, i)}
      />
    {/each}
  </svg>
</div>

<style>
  .circle-segment {
    display: inline-block;
  }

  svg {
    transform: rotate(-90deg);
  }

  .segment {
    cursor: pointer;
    transition: stroke 0.3s ease;
  }
</style>