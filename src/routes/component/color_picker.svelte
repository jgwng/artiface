<script>
  export let onColorClick = (color) => {}; // Function to handle color click

  // List of colors to choose from
  const colors = [
    "#ABDEE6", "#CBAACB", "#FFFFB5", "#FFCCB6",
    "#FEE1E8", "#FED7C3", "#ECD5E3", "#F3B0C3",
    "#C6DBDA", "#FF968A", "#FFAEA5", "#FFC5BF",
    "#FFD8BE", "#FFC8A2", "#97C1A9", "#B6CFB6"
  ];

  // Handle color click
  function handleColorClick(color) {
    onColorClick(color);
  }
</script>

<style>
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 16px 0;
    justify-items: center; /* Center items horizontally within each grid cell */
    align-items: center; /* Center items vertically within each grid cell */
  }

  .color-block {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    cursor: pointer; /* Add cursor to indicate clickable */
    transition: transform 0.2s ease; /* Add a smooth transition */
  }

  .color-block:hover {
    transform: scale(1.1); /* Slightly enlarge on hover */
  }
</style>

<div class="icon-grid">
  {#each colors as color}
    <div
      class="color-block"
      style="background-color: {color};"
      on:click={() => handleColorClick(color)}>
    </div>
  {/each}
</div>
