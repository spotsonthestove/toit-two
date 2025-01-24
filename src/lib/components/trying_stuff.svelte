<script>
    // Props for customization
    export let size = "300px";
    export let primaryColor = "#FF6B00";
    export let secondaryColor = "#FFB800";
</script>

<div class="orb-container" style="--size: {size}">
    <div class="orb" style="--primary-color: {primaryColor}; --secondary-color: {secondaryColor};">
    </div>
</div>

<style>
    .orb-container {
        width: var(--size);
        height: var(--size);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .orb {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: radial-gradient(circle at center,
            var(--secondary-color) 0%,
            var(--primary-color) 100%);
        box-shadow: 
            0 0 60px var(--primary-color),
            inset 0 0 60px var(--secondary-color);
        animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); opacity: 0.95; }
        50% { transform: scale(1.02); opacity: 1; }
        100% { transform: scale(1); opacity: 0.95; }
    }
</style>
