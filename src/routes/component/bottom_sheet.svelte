<script>
    export let visible = false; // Prop to control visibility
    export let onClose; // Prop for the close action handler
    export let items = []; // List of SVG items
    export let title = '';
    export let onImageClick = (item) => {}; // Function to handle image click

    // Helper function to handle background click
    function handleBackgroundClick(event) {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }
    
    function handleImageClick(image) {
        onImageClick(image);
        onClose();
    }

    console.log(items);
  </script>
  
  <style>
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      z-index: 1201;
    }
  
    .popup-container {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%; /* Full width */
      background-color: #2c2c2e; /* Dark background for dark mode */
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      padding: 16px;
      box-sizing: border-box;
      transition: transform 0.3s ease-out;
      transform: translateY(100%);
      z-index: 1202;
    }
  
    .overlay.active {
      visibility: visible;
      opacity: 1;
    }
  
    .popup-container.open {
      transform: translateY(0);
    }
  
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #333;
    }
  
    .header-title {
      color: white;
      font-size: 16px;
      font-weight: 500;
    }
  
    .header-close {
      font-size: 18px;
      color: #007aff; /* iOS-style blue */
      cursor: pointer;
    }
  </style>
  
  <div class="overlay" class:active={visible} on:click={handleBackgroundClick}></div>
  
  <div class="popup-container" class:open={visible}>
    <!-- Header with title and close button -->
    <div class="header">
      <span class="header-title">{title}</span>
      <span class="header-close" on:click={onClose}>✖</span>
    </div>
  
    <!-- Icon Grid -->
    <slot></slot>
  </div>
  