<script>
    export let items = []; // List of SVG items
    export let onImageClick = (item) => {}; // Function to handle image click
  
    function handleImageClick(image) {
      onImageClick(image);
    }
  </script>
  
  <style>
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      padding: 16px 0;
    }
  
    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .icon-item img {
      width: 60px;
      height: 60px;
      background-color: #E5E5EA;
      border-radius: 15px;
    }
  </style>
  
  <!-- Icon Grid -->
  <div class="icon-grid">
    {#each items as item}
      <div class="icon-item" on:click={() => handleImageClick(item)}>
        <img src={item.src} alt={item.label} />
      </div>
    {/each}
  </div>
  